class Nav{
    constructor(){
        this.hamburgers = document.querySelectorAll('.nav__hamburger')
        this.elements = document.querySelectorAll('.nav')
    }
    handleMenuSetup(){
        if(typeof window !== 'undefined'){
            if(window.innerWidth <= 1024){
                this.elements.forEach(el => {
                    const nav_menu = el.querySelector('.nav__menu')
                    nav_menu.style.transition = 'all 0s ease-in-out'
                    nav_menu.style.top = el.clientHeight + 'px'
                })
            }
        }
    }
    handleMenu(e){
        this.elements.forEach(el => {
            const nav_target = e.target.getAttribute('data-target-id')
            const nav_menu = el.querySelector('.nav__menu')
            const nav_menu_items = [...el.querySelectorAll('[class*="nav__menu-item"]')]
            const nav_overlay = document.querySelector('.nav__overlay')
            if(nav_target === nav_menu.id){
                nav_menu.style.transition = 'all 1s ease-in-out'
                const isFade = [...nav_menu.classList].filter(c => /nav__menu-fade/.test(c)).length > 0 ? true : false
                const isSlide = [...nav_menu.classList].filter(c => /nav__menu-slide/.test(c)).length > 0 ? true : false
                const isSlideLeft = [...nav_menu.classList].filter(c => /nav__menu-slide-left/.test(c)).length > 0 ? true : false
                const isSlideRight = [...nav_menu.classList].filter(c => /nav__menu-slide-right/.test(c)).length > 0 ? true : false
                const isSlideTop = [...nav_menu.classList].filter(c => /nav__menu-slide-top/.test(c)).length > 0 ? true : false
                if(!el.classList.contains('nav--open')){
                    nav_overlay.style.display = 'block'
                    setTimeout(() => {
                        nav_overlay.style.opacity = 1
                    }, 10);
                    if(typeof window !== 'undefined'){
                        if(isFade){
                            nav_menu.style.opacity = 1
                        }else if(isSlideLeft | isSlideRight){
                            nav_menu.style.transform = 'translateX(0px)'
                        }else if(isSlideTop){
                            nav_menu.style.maxHeight = window.innerHeight + 'px'
                        }else if(isSlide){
                            nav_menu.style.transition = 'all 2s ease-in-out'
                            nav_menu.style.maxHeight = window.innerHeight + 'px'
                        }
                    }
                    e.target.classList.add('active')
                    el.classList.add('nav--open')
                    let timeout = 0
                    setTimeout(() => {
                        nav_menu.style.transition = 'all 1s ease-in-out'
                        nav_menu_items.forEach(i => {
                            setTimeout(() => {
                                i.style.opacity = 1
                            }, timeout += 200);
                        })
                    }, 300);
                }else{
                    e.target.classList.remove('active')
                    el.classList.remove('nav--open')
                    let timeout = 0
                    nav_menu_items.reverse().forEach(i => {
                        setTimeout(() => {
                            i.style.opacity = 0
                        }, timeout += 100);
                    })
                    setTimeout(() => {
                        nav_overlay.style.opacity = 0
                        setTimeout(() => {
                            nav_overlay.style.display = 'none'
                        }, 1000);
                        if(isFade){
                            nav_menu.style.opacity = 0
                        }else if(isSlideLeft){
                            nav_menu.style.transform = 'translateX(-100%)'
                        }
                        else if(isSlideRight){
                            nav_menu.style.transform = 'translateX(100%)'
                        }else if(isSlideTop){
                            nav_menu.style.maxHeight = '0%'
                        }else if(isSlide){
                            nav_menu.style.maxHeight = '0px'
                        }
                    }, timeout)
                        
                }
            }
        })
    }
    handleSetup(){
        this.handleMenuSetup()
        this.hamburgers.forEach(h => h.addEventListener('click',(e)=>this.handleMenu(e)))
    }
}
class Nav_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.nav = new Nav()
    }
    static component_name = 'ui-nav'
    connectedCallback() {
        this.handleMakeNav()
        setTimeout(() => {
         this.nav = new Nav()
         this.nav.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeNav(){
        const nav = document.createElement('div')
        nav.classList.add('nav')
        this.candy_utils.handlePassId(this,nav)
        this.candy_utils.handlePassClass(this,nav)
        this.candy_utils.handleSetAttributes(this,nav)

        const nav_hamburger = this.querySelector('ui-nav-hamburger')
        if(nav_hamburger){
            const nav_hamburger_div = document.createElement('div')
            const nav_hamburger_div_html = `
                <div class="nav__hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `
            // nav_hamburger_div.outerHTML = nav_hamburger_div_html
            const target_id = nav_hamburger.getAttribute('target-id')
            if(target_id){
                nav_hamburger_div.setAttribute('data-target-id',target_id)
            }
            nav.appendChild(nav_hamburger_div)
        }

        const nav_menu = this.querySelector('ui-nav-menu')
        const nav_menu_div = document.createElement('div')
        if(nav_menu){
            nav_menu_div.classList.add('nav__menu')
            const transition_control = nav_menu.getAttribute('transition-control')
            if(transition_control){
                nav_menu_div.classList.add(`nav__menu-${transition_control}`)
            }
            this.candy_utils.handlePassId(nav_menu,nav_menu_div)
            this.candy_utils.handlePassClass(nav_menu,nav_menu_div)
            this.candy_utils.handleSetAttributes(nav_menu,nav_menu_div)
        }

        const nav_menu_items = this.querySelectorAll('ui-nav-menu-item')
        nav_menu_items.forEach(item =>{
            const nav_menu_item_div = document.createElement('div')
            nav_menu_item_div.classList.add('nav__menu-item')

            const underline = item.getAttribute('underline')
            if(underline){
                nav_menu_item_div.classList.add(`nav__menu-item-underline-${underline}`)
            }
            const hover_transition = item.getAttribute('hover-transition')
            if(hover_transition){
                nav_menu_item_div.classList.add(`nav__menu-item-hover-${hover_transition}`)
            }

            const isActive = item.getAttribute('active')
            if(isActive === 'true'){
                nav_menu_item_div.classList.add('active')
            } 
            nav_menu_item_div.innerHTML = item.innerHTML
            nav_menu_div.appendChild(nav_menu_item_div)
        })

        if(nav_menu){
            nav.appendChild(nav_menu_div)
        }
        this.innerHTML = ''
        this.appendChild(nav)
    }
}
window.customElements.define(Nav_Component.component_name,Nav_Component)