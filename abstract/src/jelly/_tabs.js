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