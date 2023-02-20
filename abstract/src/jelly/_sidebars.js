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