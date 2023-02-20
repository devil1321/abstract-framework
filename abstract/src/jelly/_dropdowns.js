class Dropdown{
    constructor(){
        this.allMenus = document.querySelectorAll('.dropdown__menu')
        this.allDropdownItem = document.querySelectorAll('.dropdown__item')
        this.allSubMenusItems = document.querySelectorAll('.dropdown__menu-item')
        this.allMenusInner = document.querySelectorAll('.dropdown__menu-inner')
        this.allSubMenus = document.querySelectorAll('.dropdown__submenu')
    }
    handleSetGraphic(){
        this.allMenus.forEach(m => {
            const items = [...m.querySelectorAll(':scope > .dropdown__menu-item')]
            const isHaveInnerMenu = [...m.querySelectorAll(':scope > .dropdown__menu-inner')]
            
            if(isHaveInnerMenu.length > 0){
                m.style.boxShadow = 'none'
                m.style.background = 'transparent'
            }
    
            if(items.length > 0){
                items[0].style.borderTopLeftRadius = '5px'
                items[0].style.borderTopRightRadius = '5px'
                items[items.length - 1].style.borderBottomLeftRadius = '5px'
                items[items.length - 1].style.borderBottomRightRadius = '5px'
            }
        })
    }
    handleDropdownItemInit(){
        this.allDropdownItem.forEach(i => {
            const button = i.firstElementChild
            const menu = button.nextElementSibling.firstElementChild
            if(button && menu){
                if(button.classList.contains('event--click')){
                    button.addEventListener('click',(e)=>{
                        e.stopImmediatePropagation()
                        if(menu){
                            if(!menu.classList.contains('menu__open')){
                                // const mainSubMenu = e.target.parentElement.querySelector('.dropdown__submenu')
                                // const allInnerMenus = mainSubMenu.querySelectorAll('.dropdown__menu')
                                const mainMenus = e.target.parentElement.parentElement.querySelectorAll('.dropdown__menu-wrapper > .dropdown__menu')
                                mainMenus.forEach(m=>{
                                    if(m){
                                        m.classList.remove('menu__open')
                                        m.style.animation = 'none'
                                    }
                                })
                                this.handleMenusInit(e)
                                this.handleMenuOpen(e,menu)
     
    
                            }else{
                                this.handleMenuClose(e,menu)
                                const mainSubMenu = e.target.parentElement.querySelector('.dropdown__submenu')
                                const allInnerMenus = mainSubMenu.querySelectorAll('.dropdown__menu')
                                allInnerMenus.forEach(m=>{
                                    if(m){
                                        m.classList.remove('menu__open')
                                        m.style.animation = 'none'
                                    }
                                })
                            }
                        }
                    })
                    
                }
                if(button.classList.contains('event--hover')){
                    button.addEventListener('mouseenter',(e) => {
                        e.stopImmediatePropagation()
                        e.stopImmediatePropagation()
                        if(menu){
                            if(!menu.classList.contains('menu__open')){
                                this.handleMenusInit(e)
                                this.handleMenuOpen(e,menu)
    
                            }else{
                                this.handleMenuClose(e,menu)
                            }
                        }
                    })
                }
            }
        })
    }
    handleDropdownSubMenusInit(){
        this.allSubMenusItems.forEach(mi => {
            const subMenu = mi.nextElementSibling
            let menu
            if(subMenu?.querySelector('.dropdown__menu')){
                menu = subMenu.querySelector('.dropdown__menu')
            }
            if(menu?.classList.contains('dropdown__menu')){
                if(mi && menu){
                    if(mi.classList.contains('event--click')){
                        mi.addEventListener('click',(e)=>{
                            e.stopImmediatePropagation()
                            if(menu){
                                if(!menu.classList.contains('menu__open')){
                                    this.handleMenusInit(e)
                                    this.handleMenuOpen(e,menu,subMenu)
        
                                }else{
                                    this.handleMenuClose(e,menu,subMenu)
        
                                }
                            }
                        })
                    }
                    if(mi.classList.contains('event--hover')){
                        mi.addEventListener('mouseover',(e)=>{
                            e.stopImmediatePropagation()
                            if(menu){
                                if(!menu.classList.contains('menu__open')){
                                    this.handleMenusInit(e)
                                    this.handleMenuOpen(e,menu,subMenu)
        
                                }else{
                                    this.handleMenuClose(e,menu,subMenu)
        
                                }
                            }
                        })
                    }
                }
            }
    
        })
    }
    handleClose(menus){
        menus.forEach(menu => {
            menu.style.opacity = '0'
            if(menu.parentElement.classList.contains('dropdown__menu-wrapper')){
                menu.parentElement.style.opacity = '0'
            }
            let stopTimer
            clearTimeout(stopTimer)
            stopTimer = setTimeout(()=>{
                menu.style.animation = 'none'
                menu.classList.remove('menu__open')
                menu.style.removeProperty("opacity")
                if(menu.parentElement.classList.contains('dropdown__menu-wrapper')){
                    menu.parentElement.style.removeProperty("opacity")
                }
            },500)
        })

    }
    handleCloseAll(condition){
        if(condition){
            this.allMenus = document.querySelectorAll('.dropdown__menu')
            this.allMenusInner = document.querySelectorAll('.dropdown__menu-inner')
            this.allSubMenus = document.querySelectorAll('.dropdown__submenu')
            this.handleClose(this.allMenus);
            this.handleClose(this.allMenusInner);
            this.handleClose(this.allSubMenus);
        }
    }
    transitionControlOpen(fixOffset,offset,menu,subMenu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trInAttr = menu.getAttribute('tr_')
        if(trInAttr === 'slideInYBottom'){
            if(children.length > 2){
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length - 1)}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length)}px)`       
            }
        }
        else if(trInAttr === 'slideInYCenter'){
            if(children.length > 2){

                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight  * (children.length / 2) / 2}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${0}px)`  

            }      
        }
        else if(trInAttr === 'slideInXCenter'){
            subMenu.style.transform = `translate(${fixOffset}px, ${-children[0].clientHeight}px)`         
        }
        else if(trInAttr === 'fadeIn' || trInAttr === null){
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`                  
        }else{
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`    
        }
    }
    transitionControlMenuInOpen(menu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trInAttr = menu.getAttribute('data-transition_in')
        if(trInAttr === 'slideInYBottom'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight  * (children.length * 1.075)}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length)}px)`       
            }
        }
        else if(trInAttr === 'slideInYCenter'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children.length * children[0].clientHeight - 30}px)`
            }else{
                menu.parentElement.style.transform = `translateY(${65}px)`       

            }      
        }
        else if(trInAttr === 'slideInXCenter'){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.15}px)`         
        }
        else if(trInAttr === 'fadeIn' || trInAttr === null){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.2 }px)`                  
        }
        else if(trInAttr === 'scaleIn'){
            menu.parentElement.style.transform = `translateY(${children[0].clientHeight + 30 / 3}px)`                  
        }
        else{
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.20}px)`    
        }
    }
    handleMenuOpen(e,menu,subMenu){
        menu.classList.remove('menu__open')
        const items = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const animationIn = framework.utils.handleTransitionIn(menu)
            items.forEach(i => {
                i.style.padding = '5px 10px'
            })
            menu.classList.add('menu__open')
            const trInAttr = menu.getAttribute('data-transition_in')
            if(!subMenu){
                this.transitionControlMenuInOpen(menu)
            }
            if(subMenu){
                if(subMenu.classList.contains('left')){
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginLeft = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginLeft = correctOffset + 'px'
                        }
                    }
                    this.transitionControlOpen(-e.target.clientWidth - 40 ,-e.target.clientWidth - 5,menu,subMenu)
                }else if(subMenu.classList.contains('right')){         
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginRight = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginRight = correctOffset + 'px'
                        }
                    }
                    this.transitionControlOpen(e.target.clientWidth+5,e.target.clientWidth + 5,menu,subMenu)

                }else{
                    const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
                    subMenu.style.height = children.length * children[0].clientHeight + 'px'
                    if(trInAttr === 'slideInYCenter'){
                        subMenu.style.transform = `translateY(-200%)`
                    }
                }
                if(trInAttr !== 'slideInYCenter' && trInAttr !== 'slideInYBottom'){
                    menu.classList.add('dropdown__menu-fix-top')
                }
            }
           
            menu.style.animation = animationIn
    }
    transitionControlClose(fixOffset,offset,menu,subMenu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trOutAttr = menu.getAttribute('data-transition_out')
        if(trOutAttr === 'slideOutYBottom'){
            if(menu.children.length > 2){
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length - 1)}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length )}px)`       

            }
        }
        else if(trOutAttr === 'slideOutYCenter'){
            if(children.length > 2){
                subMenu.style.transform = `translate(${offset}px, null)`  
            }else{
                subMenu.style.transform = `translate(${offset}px, ${30}px)`       

            }      
        }
        else if(trOutAttr === 'slideOutXCenter'){
            subMenu.style.transform = `translate(${fixOffset}px, ${-children[0].clientHeight}px)`         
        }
        else if(trOutAttr === 'fadeOut' || trOutAttr === null){
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`                  
        }else{
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`    
        }
    }
    transitionControlMenuOutClose(menu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trOutAttr = menu.getAttribute('data-transition_out')
        if(trOutAttr === 'slideOutYBottom'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length * 1.07)}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length - 1)}px)`       
            }
        }
        else if(trOutAttr === 'slideOutYCenter'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight  * children.length / 1.55}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${65}px)`       

            }      
        }
        else if(trOutAttr === 'slideOutXCenter'){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.15}px)`        
        }
        else if(trOutAttr === 'fadeOut' || trOutAttr === null){
            menu.parentElement.style.transform = `translateY(${children[0].clientHeight + 8 - children[0].clientHeight}px)`                  
        }else{
            menu.parentElement.style.transform = `translate(Y(${-children[0].clientHeight + 8}px)`    
        }
    }
    handleMenuClose(e,menu,subMenu){
        const animationOut = framework.utils.handleTransitionOut(menu)
            const trOutAttr = menu.getAttribute('data-transition_out')
            const trInAttr = menu.getAttribute('data-transition_in')
            menu.style.animation = animationOut
            if(!subMenu){
                menu.classList.remove('dropdown__menu-fix')
                this.transitionControlMenuOutClose(menu)
            }
            if(subMenu){
                if(subMenu.classList.contains('left')){
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginLeft = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginLeft = correctOffset + 'px'
                        }
                    }
                    this.transitionControlClose(-e.target.clientWidth - 5,-e.target.clientWidth - 5,menu,subMenu)
                }else if(subMenu.classList.contains('right')){         
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginRight = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginRight = correctOffset + 'px'
                        }
                    }
                    this.transitionControlClose(e.target.clientWidth + 5,e.target.clientWidth + 5,menu,subMenu)
                }else{
                    if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && trInAttr === 'slideInYCenter'){
                        subMenu.style.transform = `translateY(0%)`
                    }
                    if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && trOutAttr === 'slideOutYCenter'){
                        subMenu.style.transform = `translateY(-200%)`
                    }
                }
                  
                if(trOutAttr !== 'slideOutYCenter' && trOutAttr !== 'slideOutYBottom'){
                    menu.classList.remove('dropdown__menu-fix-top')
                }
            }
            let timeout
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
                menu.classList.remove('menu__open')
                if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && subMenu){
                    subMenu.style.height = '0px'
                }
            },framework.globalSetup.animationTime)

           
    }
    handleMenusInit(e){
        const subMenus = e.target.parentElement.querySelectorAll('.dropdown__submenu')
        subMenus.forEach(sm => {
            const menu = sm.querySelector('.dropdown__menu')
            if(menu.classList.contains('menu__open')){
                this.handleMenuClose(e,menu,sm)
            }
        })
    }
    handleSetup(){
        this.handleSetGraphic()
        this.handleDropdownItemInit()
        this.handleDropdownSubMenusInit()
        document.addEventListener('click',(e) => this.handleCloseAll((!e.target.classList.contains('dropdown__menu-item') && !e.target.classList.contains('dropdown__button') && !e.target.classList.contains('dropdown__link'))))
    }
}