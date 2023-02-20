class Tabs{
    constructor() {
        this.elements = document.querySelectorAll('.tabs')
    }
    handleTab(e,dataTab){
        this.elements.forEach(el =>{
            const links = el.querySelectorAll('.tabs__nav-item')
            const tabs = el.querySelectorAll('.tabs__tab')
            const view = el.querySelector('.tabs__view')
       
            const wrapper = view.parentElement
            const tab = [...tabs].find(t => t.getAttribute('data-tab') === dataTab)
            links.forEach(l => l.classList.remove('active'))
            e.target.classList.add('active')
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')
            const isFade = [el.classList].filter(c => /tabs__fade/.test(c)).length > 0 ? true : false
            const isSlideX = [el.classList].filter(c => /tabs__slide-x/.test(c)).length > 0 ? true : false
            const isSlideY = [el.classList].filter(c => /tabs__slide-y/.test(c)).length > 0 ? true : false
            const handleTabIn = () =>{
                tabs.forEach(t => t.style.display = 'none');
                if(tab){
                    tab.style.display = 'block'
                    tab.style.opacity = 0
                }
                setTimeout(()=>{
                    if(tab){
                        tab.style.opacity = 1
                    }
                },100)
            }
            if(isFade){
                handleTabIn()
            }else if(isSlideX){
                if(view){
                    view.style.transform = `translateX(-${tab.offsetLeft}px)`
                }
            }else if(isSlideY){
                if(wrapper){
                    wrapper.style.height = tab.clientHeight + 2 + 'px'
                }
                if(view){
                    view.style.transform = `translateY(-${tab.offsetTop}px)`
                }
            }else{
                tabs.forEach(t => t.style.transition = 'all 0s ease-in-out')
                handleTabIn()
            }
        })
        
    }
    handleTabs(){
        this.elements.forEach(el => {
            const tabs = el.querySelectorAll('.tabs__tab')
            const wrapper = el.querySelector('.tabs__tabs-wrapper')
            const links = el.querySelectorAll('.tabs__nav-item')
            const isSlideY = [el.classList].filter(c => /tabs__slide-y/.test(c)).length > 0 ? true : false
            links.forEach((link,index) =>{
                const data_tab = link.getAttribute('data-tab')
                if(!data_tab){
                    link.setAttribute('data-tab',index + 1)
                }
                const data_tab_tab = tabs[index].getAttribute('data-tab')
                if(!data_tab_tab){
                    tabs[index].setAttribute('data-tab',index + 1)
                }
            })
            if(isSlideY){
                if(wrapper){
                    wrapper.style.height = tabs[0].clientHeight + 2 + 'px'
                }
            }
            links.forEach(link => {
                const dataTab = link.getAttribute('data-tab')
                link.addEventListener('click',(e)=>this.handleTab(e,dataTab))
            })
        })
    }
    handleSetup(){
        this.handleTabs()
    }
}
class Tabs_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.tabs = new Tabs()
    }
    static component_name = 'ui-tabs'
    connectedCallback() {
        this.handleMakeTabs()
        setTimeout(() => {
         this.tabs = new Tabs()
         this.tabs.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeTabs(){
        const tabs = document.createElement('div')
        tabs.classList.add('tabs')
        this.candy_utils.handlePassId(this,tabs)
        this.candy_utils.handlePassClass(this,tabs)
        this.candy_utils.handleSetAttributes(this,tabs)

        const pills = this.getAttribute('pills')

        if(pills === 'true'){
            tabs.classList.add('tabs__pills')
        }

        const tabs_nav = this.querySelector('ui-tabs-nav')
        const tabs_nav_div = document.createElement('div')

        if(tabs_nav){
            tabs_nav_div.classList.add('tabs__nav')
            this.candy_utils.handlePassId(tabs_nav,tabs_nav_div)
            this.candy_utils.handlePassClass(tabs_nav,tabs_nav_div)
            this.candy_utils.handleSetAttributes(tabs_nav,tabs_nav_div)
        }

        const tabs_nav_items = [...this.querySelectorAll('ui-tabs-nav-item')]

        tabs_nav_items.forEach(item =>{
            const tabs_nav_item_div = document.createElement('div')
            tabs_nav_item_div.classList.add('tabs__nav-item')
            const data_tab = item.getAttribute('data-tab')
            if(data_tab){
                tabs_nav_item_div.setAttribute('data-tab',data_tab)
            }
            this.candy_utils.handlePassId(item,tabs_nav_item_div)
            this.candy_utils.handlePassClass(item,tabs_nav_item_div)
            this.candy_utils.handleSetAttributes(item,tabs_nav_item_div)
            tabs_nav_item_div.innerHTML = item.innerHTML
            tabs_nav_div.appendChild(tabs_nav_item_div)
        })

        if(tabs_nav_items.length > 0){
            tabs.appendChild(tabs_nav_div)
        }


        const tabs_wrapper = this.querySelector('ui-tabs-wrapper')
        const tabs_wrapper_div = document.createElement('div')
        if(tabs_wrapper){
            tabs_wrapper_div.classList.add('tabs__tabs-wrapper')
            this.candy_utils.handlePassId(tabs_wrapper,tabs_wrapper_div)
            this.candy_utils.handlePassClass(tabs_wrapper,tabs_wrapper_div)
            this.candy_utils.handleSetAttributes(tabs_wrapper,tabs_wrapper_div)
        }

        const tabs_view = this.querySelector('ui-tabs-view')
        const tabs_view_div = document.createElement('div')
        if(tabs_view){
            tabs_view_div.classList.add('tabs__view')
            this.candy_utils.handlePassId(tabs_view,tabs_view_div)
            this.candy_utils.handlePassClass(tabs_view,tabs_view_div)
            this.candy_utils.handleSetAttributes(tabs_view,tabs_view_div)
            tabs_wrapper_div.appendChild(tabs_view_div)
        }

        const tabs_tabs = [...this.querySelectorAll('ui-tabs-tab')]
        tabs_tabs.forEach((tab,index) =>{
            const tabs_tab_div = document.createElement('div')
            tabs_tab_div.classList.add('tabs__tab')
            const isActive = tab.getAttribute('active')
            if(isActive === 'true'){
                tabs_tab_div.classList.add('active')
            }
            this.candy_utils.handlePassId(tab,tabs_tab_div)
            this.candy_utils.handlePassClass(tab,tabs_tab_div)
            this.candy_utils.handleSetAttributes(tab,tabs_tab_div)
            tabs_tab_div.innerHTML = tab.innerHTML
            tabs_view_div.appendChild(tabs_tab_div)
        })

        if(tabs_wrapper){
            tabs.appendChild(tabs_wrapper_div)
        }

        this.innerHTML = ''
        this.append(tabs)
     }
}
window.customElements.define(Tabs_Component.component_name,Tabs_Component)