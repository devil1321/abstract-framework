class Sidebar{
    constructor(){
        this.elements = document.querySelectorAll('.sidebar')
        this.open_buttons = document.querySelectorAll('.sidebar__open-sidebar')
        this.html = document.querySelector('html')
    }
    handleSidebarOpen(btn){
        const sidebar_target = btn.getAttribute('data-target-id')
        const sidebar = document.querySelector(`#${sidebar_target}`)
        const isCircle = [...sidebar.classList].filter(c => /sidebar__circle/.test(c)).length > 0 ? true : false
        if(!sidebar.classList.contains('sidebar--open')){
            sidebar.style.transition = 'all 1s ease-in-out'
            if(isCircle){
                sidebar.style.borderTopRightRadius = '0px'
                sidebar.style.borderBottomRightRadius = '0px'
                sidebar.style.borderTopLeftRadius = '0px'
                sidebar.style.borderBottomLeftRadius = '0px'
            }
            if(sidebar.classList.contains('sidebar__top')){
                sidebar.style.transform = 'translateY(0px)'
            }
            if(sidebar.classList.contains('sidebar__right')){
                sidebar.style.transform = 'translateX(0px)'
            }
            if(sidebar.classList.contains('sidebar__bottom')){
                sidebar.style.transform = 'translateY(0px)'
            }
            if(sidebar.classList.contains('sidebar__left')){
                sidebar.style.transform = 'translateX(0px)'
            }
            if(sidebar.classList.contains('sidebar__slide-top-left') | sidebar.classList.contains('sidebar__slide-top-right') | sidebar.classList.contains('sidebar__slide-bottom-right') | sidebar.classList.contains('sidebar__slide-bottom-left')){
                sidebar.style.height = '100%'
            }
            sidebar.classList.add('sidebar--open')
        }else{
            if(sidebar.classList.contains('sidebar__top')){
                sidebar.style.transform = 'translateY(-100%)'
            }
            if(sidebar.classList.contains('sidebar__right')){
                sidebar.style.transform = 'translateX(100%)'
            }
            if(sidebar.classList.contains('sidebar__bottom')){
                sidebar.style.transform = 'translateY(100%)'
            }
            if(sidebar.classList.contains('sidebar__left')){
                sidebar.style.transform = 'translateX(-100%)'
            }
            if(sidebar.classList.contains('sidebar__slide-top-left') | sidebar.classList.contains('sidebar__slide-top-right') | sidebar.classList.contains('sidebar__slide-bottom-right') | sidebar.classList.contains('sidebar__slide-bottom-left')){
                sidebar.style.height = '0%'
            }
            if(sidebar.classList.contains('sidebar__circle-left')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopRightRadius = '100%'
                    sidebar.style.borderBottomRightRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-right')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopLeftRadius = '100%'
                    sidebar.style.borderBottomLeftRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-top')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderBottomLeftRadius = '100%'
                    sidebar.style.borderBottomRightRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-bottom')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopLeftRadius = '100%'
                    sidebar.style.borderTopRightRadius = '100%'
                }, 1000);
            }
            sidebar.classList.remove('sidebar--open')
            
        }
    }
    handlePreventClose(){
        this.elements.forEach(el =>{
            el.addEventListener('click',(e)=> e.stopImmediatePropagation())
        })
    }
    handleSetup(){
        this.open_buttons.forEach(btn => btn.addEventListener('click',(e) => {
            e.stopImmediatePropagation()
            this.handleSidebarOpen(btn)
        }))
        this.html.addEventListener('click',(e)=>{
            e.stopImmediatePropagation()
            this.open_buttons.forEach(btn => this.handleSidebarOpen(btn))
        })
    }
}
class Sidebar_Button_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.sidebar = new Sidebar()
    }
    static component_name = 'ui-sidebar-button'
    connectedCallback() {
        this.handleMakeSidebarButton()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeSidebar(){
        
     }
     handleMakeSidebarButton(){
        const button = document.createElement('button')
        button.classList.add('sidebar__open-sidebar')
        this.candy_utils.handlePassId(this,button)
        this.candy_utils.handlePassClass(this,button)
        this.candy_utils.handleSetAttributes(this,button)
        const target = this.getAttribute('target-id')
        if(target){
            button.setAttribute('data-target-id',target)
        }
        button.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(button)
     }
}
window.customElements.define(Sidebar_Button_Component.component_name,Sidebar_Button_Component)
class Sidebar_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.sidebar = new Sidebar()
    }
    static component_name = 'ui-sidebar'
    connectedCallback() {
        this.handleMakeSidebar()
        setTimeout(() => {
         this.sidebar = new Sidebar()
         this.sidebar.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeSidebar(){
        const sidebar = document.createElement('sidebar')
        sidebar.classList.add('sidebar')
        this.candy_utils.handlePassId(this,sidebar)
        this.candy_utils.handlePassClass(this,sidebar)
        this.candy_utils.handleSetAttributes(this,sidebar)

        const transition_control = this.getAttribute('transition-control')
        if(transition_control){
            sidebar.classList.add(`sidebar__${transition_control}`)
        }
        const circle = this.getAttribute('circle')
        if(circle){
            sidebar.classList.add(`sidebar__circle-${circle}`)
        }

        const sidabar_items = this.querySelectorAll('ui-sidebar-item')
        sidabar_items.forEach(item =>{
            const sidebar_item_div = document.createElement('div')
            sidebar_item_div.classList.add('sidebar__item')
            const sidebar_item_icon = document.createElement('i')
            sidebar_item_icon.classList.add('fa')
            const isLeft = this.getAttribute('direction')
            if(isLeft === 'left' | !isLeft){
                sidebar_item_icon.classList.add('fa-chevron-right')
            }else if(isLeft === 'right'){
                sidebar_item_icon.classList.add('fa-chevron-left')
            }
            sidebar_item_icon.classList.add('fa-1x')
            if(isLeft === 'left' | !isLeft){
                sidebar_item_div.innerHTML = item.innerHTML
                sidebar_item_div.appendChild(sidebar_item_icon)
            }else if(isLeft === 'right'){
                sidebar_item_div.innerHTML = item.innerHTML
                sidebar_item_div.prepend(sidebar_item_icon)
            }
            this.candy_utils.handlePassId(item,sidebar_item_div)
            this.candy_utils.handlePassClass(item,sidebar_item_div)
            this.candy_utils.handleSetAttributes(item,sidebar_item_div)
            sidebar.appendChild(sidebar_item_div)
        })
        this.innerHTML = ''
        this.appendChild(sidebar)
     }
}
window.customElements.define(Sidebar_Component.component_name,Sidebar_Component)