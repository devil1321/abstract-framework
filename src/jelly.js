const classes = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black','white','light-white','medium-white']
const root = document.documentElement
const animationTime = 700
const cssAnimationTime = 0.7
const cssShadowAnimationTime = 0.5;
function setPixel(imageData, x, y, r, g, b, a) {
    var index = 4 * (x + y * imageData.width);
    imageData.data[index+0] = r;
    imageData.data[index+1] = g
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
} 
function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

const hexToRgbArr = (hex) =>{
    if(hex.slice(1,hex.length).length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    const aRgbHex = hex.slice(1,hex.length).match(/.{1,2}/g);
    const rgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return rgb;
}

const colorToRgbArray = (c) =>{
       const isHex = /^#/
       const rgb = /(.*?)rgb\((\d+), (\d+), (\d+)\)/
        const rgba = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/
        if(rgb.test(c) && !isHex.test(c)){
            colors = rgb.exec(c)
        }else if(rgba.test(c) && !isHex.test(c)){
            colors = rgba.exec(c)
        }else{
            return hexToRgbArr(c)
        }
        const red = parseInt(colors[2])
        const green = parseInt(colors[3])
        const blue = parseInt(colors[4])
        const opacity = parseInt(colors[5])
    return [red,green,blue,opacity]
}

const handleColorLuma = (c) => {
    const rgb = /(.*?)rgb\((\d+), (\d+), (\d+)\)/
    const rgba = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/
    if(rgb.test(c)){
        colors = rgb.exec(c)
    }else if(rgba.test(c)){
        colors = rgba.exec(c)
    }
    const red = parseInt(colors[2])
    const green = parseInt(colors[3])
    const blue = parseInt(colors[4])
    let color = rgbToHex(red,green,blue)
    color = color.substring(1);    
    const rgbColor = parseInt(color, 16);
    const r = (rgbColor >> 16) & 0xff;  
    const g = (rgbColor >>  8) & 0xff;
    const b = (rgbColor >>  0) & 0xff; 
    return {
        luma:0.2126 * r + 0.7152 * g + 0.0722 * b, // per ITU-R BT.709
        color:color
    }
}
const handleTransitionIn = (target) =>{
    if(target.dataset.transition_in){
        return `${target.dataset.transition_in} ${cssAnimationTime}s ease-in-out forwards`
   }else{
       return `fadeIn ${cssAnimationTime}s ease-in-out forwards`
   }
}
const handleTransitionOut = (target) =>{
    if(target.dataset.transition_out){
        return `${target.dataset.transition_out} ${cssAnimationTime}s ease-in-out forwards`
   }else{
       return `fadeOut ${cssAnimationTime}s ease-in-out forwards`
   }
}
const getStyle = (className) =>{
    var cssText = "";
    var classes = document.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {        
        if (classes[x].selectorText === className) {
            cssText += classes[x].cssText || classes[x].style.cssText;
        }
    }
    return cssText;
}
const handleTransforms = () =>{
    const allEls = document.body.querySelectorAll('*')
    allEls.forEach(el =>{
        const classes = el.classList
        const transforms = [...classes].map(c =>{
            const regex = /transform:(.*?)\)/gi
            const transform = getStyle(`.${c}`)
            if(regex.test(transform)){
                return transform.match(regex)
            }
        }).filter(t => t !== undefined && t !== null).flat()
        const correctTransform = transforms.join().replaceAll('transform:','').replaceAll(',','')
        if(transforms.length > 0){
            el.style.transform = correctTransform
        }
    })
}
const handlePositionRules = () =>{
    const allEls = document.body.querySelectorAll('*')
    allEls.forEach(el =>{
        const classRule = [...el.classList].find(c => c === 'top-left' || c === 'top-right' || c === 'bottom-left' || c === 'bottom-right')
        let parent = el

        while(parent?.classList?.contains('relative') && parent.id !== '#root' && parent !== document.querySelector('body')){
            parent = parent.parentElement
        }

        switch(classRule){
            case 'top-left':
                el.style.top = -parent.clientHeight * 0.5 + 'px'
                el.style.left = -parent.clientWidth * 0.5 + 'px'
                break
            case 'bottom-left':
                el.style.bottom = -parent.clientHeight * 0.5 + 'px'
                el.style.left = -parent.clientWidth * 0.5 + 'px'
                break
            case 'top-right':
                el.style.top = -parent.clientHeight * 0.5 + 'px'
                el.style.right = -parent.clientWidth * 0.5 + 'px'
                break
            case 'bottom-right':
                el.style.bottom = -parent.clientHeight * 0.5 + 'px'
                el.style.right = -parent.clientWidth * 0.5 + 'px'
                break
            default:
                return
        }
    })
}
const handlePulseAnimations = () =>{
    classes.forEach(c => {
        const elsActive = document.querySelectorAll(`.pulse-outside-${c}--active`)
        const elsActiveDouble = document.querySelectorAll(`.pulse-outside-${c}--active-double`)
        const elsActiveInverted = document.querySelectorAll(`.pulse-outside-${c}--active-inverted`)
        const animation = (e,transition) =>{
            e.target.style.animation = 'none'
            let anim 
            clearTimeout(anim)    
            anim = setTimeout(function(){
                e.target.style.animation = transition
            },10)
            let timeout
            timeout = setTimeout(()=>{
                e.target.style.animation = 'none'
            },animationTime)
            clearTimeout(timeout)    
        }

        elsActive.forEach(el => {
            el.addEventListener('click',(e)=>{
                animation(e,`pulseOutlineActive${c} 0.7s ease`)
            })
        })
        elsActiveDouble.forEach(el => {
            el.addEventListener('click',(e)=>{
                animation(e,`pulseOueActiveDouble${c} 0.7s ease`)
            })  
        })
        elsActiveInverted.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`pulseOutlineActiveInverted${c} 0.7s ease`)
          })  
        })
    })
}

const handleShadowAnimations = () =>{
    classes.forEach(c => {
        const elsActive = document.querySelectorAll(`.shadow__${c}--click`)
        const elsActiveOff = document.querySelectorAll(`.shadow__${c}--click-off`)
        const elsActiveLightOff = document.querySelectorAll(`.shadow__${c}-light--click-off`)
        const elsActiveLightInsideOff = document.querySelectorAll(`.shadow__${c}-light-inside--click-off`)
        const elsActiveOffInside = document.querySelectorAll(`.shadow__${c}-inside-click-off`)
        const elsActiveLight = document.querySelectorAll(`.shadow__${c}-light--click`)
        const elsActiveInside = document.querySelectorAll(`.shadow__${c}-inside--click`)
        const elsActiveLightInside = document.querySelectorAll(`.shadow__${c}-inside-light--click`)
        const animation = (e,transition) =>{
            e.target.style.animation = 'none'
            let anim 
            clearTimeout(anim)    
            anim = setTimeout(function(){
                e.target.style.animation = transition
            },10)
            let timeout
            timeout = setTimeout(()=>{
                e.target.style.animation = 'none'
            },animationTime)
            clearTimeout(timeout)    
        }

        elsActive.forEach(el => {
            el.addEventListener('click',(e)=>{
                animation(e,`shadowClick${c} ${cssShadowAnimationTime}s ease`)
            })
        })
        elsActiveInside.forEach(el => {
            el.addEventListener('click',(e)=>{
                animation(e,`shadowClickInside${c} ${cssShadowAnimationTime}s  ease`)
            })  
        })
        elsActiveLight.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickLight${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
        elsActiveLightInside.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickLightInside${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
        elsActiveOff.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickOff${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
        elsActiveOffInside.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickOffInside${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
        elsActiveLightOff.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickOffLight${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
        elsActiveLightInsideOff.forEach(el => {
            el.addEventListener('click',(e)=>{
               animation(e,`shadowClickOffLightInside${c} ${cssShadowAnimationTime}s  ease`)
          })  
        })
    })
}


const handleButtonFocuses = () =>{
    const buttons = document.querySelectorAll('button')
    buttons.forEach(btn =>{
        btn.addEventListener("click", (e) => {  
            e.target.blur()
            e.target.focus()
        }, true);
    })
}
const handlePulses = (target) => {
    const targets = document.querySelectorAll(`${target}`)
    if(targets){
        targets.forEach(t => {
            if(t.parentElement.classList.contains('pulse') || t.classList.contains('pulse')){
            const pulse = t.querySelector('span')
                let c = getComputedStyle(t).backgroundColor
                const luma = handleColorLuma(c)
                if (luma.color === "ffffff") {
                    pulse.style.backgroundColor = 'var(--black)'
                }else if(luma.color === "000000"){
                    pulse.style.backgroundColor = 'var(--white)'
                }else if(luma.luma < 35){
                    pulse.style.backgroundColor = 'var(--black)'
                }else if(luma.luma > 180){
                    pulse.style.backgroundColor = 'var(--black)'
                }else{
                    pulse.style.backgroundColor = 'var(--white)'
                }
                if(pulse){
                    const handlePulse = (e) =>{
                        e.stopPropagation();
                        const x = e.clientX - e.target.offsetLeft 
                        const y = e.clientY - e.target.offsetTop 
                        pulse.style.left = x + 'px'
                        pulse.style.top = y + 'px'
                        t.appendChild(pulse)
                        if(pulse.classList.contains('pulse-inside')){
                            pulse.classList.add('pulse-inside--active')
                        }else if(pulse.classList.contains('pulse-inside-big')){
                            pulse.classList.add('pulse-inside--active-big')
                        }
                    }
                    t.addEventListener('click',(e)=>handlePulse(e))
                }
            }
        })
    }
}
const handleButtonCollapses = () =>{
    const btnsCollapse = document.querySelectorAll('.button__collapse')
    btnsCollapse.forEach(btn => {
        const target = document.querySelector(`${btn.dataset.target}`)
        const animationIn = handleTransitionIn(target)
        const animationOut = handleTransitionOut(target)
        target.style.borderWidth = '0px'
        btn.addEventListener('click',(e)=>{
            target.style.removeProperty('border-width')
            if(!target.classList.contains('collapse__open')){
                target.classList.add('collapse__open')
                    target.style.padding = '20px 10px'
                    target.style.animation = 'none'
                    target.style.animation = animationIn
            }else{
                target.classList.remove('collapse__open')
                    let stopTimer
                    clearTimeout(stopTimer)
                    if(target.classList.contains('slide-y') || target.classList.contains('slide-x')){
                        stopTimer = setTimeout(function(){
                            target.style.padding = '0px 0px'
                            target.style.borderWidth = '0px'
                        },animationTime);
                    }
                    target.style.animation = 'none'
                    target.style.animation = animationOut
            }
        })
    })
}
const handleAccordions = () =>{
    const headings = document.querySelectorAll('.accordion__heading')
    headings.forEach(h => {
        const handleAccordion = () =>{
            const animationIn = handleTransitionIn(h)
            const animationOut = handleTransitionOut(h)
            const chevron = document.querySelector('.chevron')
            const chevronLight = document.querySelector('.chevron-liht')
            let body
            if(!h.getAttribute('data-number')){
                body = h.nextSibling.nextSibling
                if(body.getAttribute('data-number')){ 
                    body = null
                }
            }else{
                const allBodies = document.querySelectorAll('.accordion__body')
                const correctBody = [...allBodies].find(b => b.dataset.number === h.dataset.number)
                body = correctBody
            }
            if(!h.classList.contains('accordion__open')){
                h.classList.add('accordion__open')
                if(body){
                    if(chevron){
                        chevron.classList.add('chevron-up')
                    }else if(chevronLight){
                        chevronLight.classList.add('chevron-up')
                    }
                        body.style.padding = '5px 10px'
                        body.style.animation = 'none'
                        body.style.animation = animationIn   
                        if(h.dataset.number){
                            body.previousElementSibling.style.borderBottom = '1px solid var(--medium-white)'
                        }else{
                            h.style.borderBottom = '1px solid var(--medium-white)'
                        }               
                        if(body.classList.contains('hidden')){
                            body.style.display = 'block'
                        }
                    }
            }else{
                    h.classList.remove('accordion__open')
                    if(body){
                        if(chevron){
                            chevron.classList.remove('chevron-up')
                        }else if(chevronLight){
                            chevronLight.classList.remove('chevron-up')
                        }
                        let stopTimer
                        clearTimeout(stopTimer)
                        stopTimer = setTimeout(function(){
                            body.style.padding = '0px 10px'
                            if(h.dataset.number){
                                body.previousSibling.previousSibling.style.borderBottom = '0px'
                            }else{
                                h.style.borderBottom = '0px'
                            }  
                            if(body.classList.contains('hidden')){
                                body.style.display = 'none'
                            }
                        },animationTime);
                        body.style.animation = 'none'
                        body.style.animation = animationOut                    
                    }
            }
        }
        h.addEventListener('click',handleAccordion)
    })
}
const handleClose = () => {
    const closeBtns = document.querySelectorAll('.close-button')
    closeBtns.forEach(btn => {
        const target = btn.parentElement
        const animatioOut = handleTransitionOut(target)
        btn.addEventListener('click',()=>{
            const trOutAttr = target.getAttribute('data-transition_out')
            target.style.animation = animatioOut
            if(trOutAttr === 'slideOutYCenter'){
                target.style.top = '-30px'
            }
            let stopTimer
            clearTimeout(stopTimer)
            stopTimer = setTimeout(function(){
                target.style.display ='none'
            },animationTime)
        })
    })
}
const handleBreadcrumbAnim = () =>{
    const paths = [...document.querySelectorAll('.breadcrumb__path'),'reset']
    function anim(){
        let time = 0
        paths.forEach((p)=>{
        if(p !== 'reset'){
            if(p.parentElement.classList.contains('breadcrumb__animated')){
                if(p !== 'reset'){
                    setTimeout(()=>{
                        p.style.animation = 'animItem 1s ease-in-out'
                    },time += 1000)
                }else{
                    setTimeout(()=>{
                        paths.forEach((p)=>{
                            if(p !== 'reset'){
                                p.style.animation = 'none'
                            }
                        })
                        anim()
                    },1000 * paths.length - 3)
                }
            }
        }
    })            
}
    anim()
}
const handleDropdowns = () =>{
    const allMenus = document.querySelectorAll('.dropdown__menu')
    const allDropdownItem = document.querySelectorAll('.dropdown__item')
    const allSubMenusItems = document.querySelectorAll('.dropdown__menu-item')
    allMenus.forEach(m => {
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
    const closeAll = (condition) =>{
        if(condition){
            const allMenus = document.querySelectorAll('.dropdown__menu')
            const allMenusInner = document.querySelectorAll('.dropdown__menu-inner')
            const allSubMenus = document.querySelectorAll('.dropdown__submenu')
            const close = (menus) =>{
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
            close(allMenus);
            close(allMenusInner);
            close(allSubMenus);
        }
    }
    document.addEventListener('click',(e) => closeAll((!e.target.classList.contains('dropdown__menu-item') && !e.target.classList.contains('dropdown__button') && !e.target.classList.contains('dropdown__link'))))
  
    const handleMenuOpen = (e,menu,subMenu) =>{
        menu.classList.remove('menu__open')
        const items = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const animationIn = handleTransitionIn(menu)
            items.forEach(i => {
                i.style.padding = '5px 10px'
            })
            menu.classList.add('menu__open')
            const trInAttr = menu.getAttribute('data-transition_in')
            const transitionControl = (fixOffset,offset) =>{
                const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
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
            
            const transitionControlMenuIn = () =>{
                const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
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
            if(!subMenu){
                transitionControlMenuIn()
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
                    transitionControl(-e.target.clientWidth - 40 ,-e.target.clientWidth - 5)
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
                    transitionControl(e.target.clientWidth+5,e.target.clientWidth + 5)

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
    const handleMenuClose = (e,menu,subMenu)  =>{
        const animationOut = handleTransitionOut(menu)
            const trOutAttr = menu.getAttribute('data-transition_out')
            const trInAttr = menu.getAttribute('data-transition_in')
            menu.style.animation = animationOut
            const transitionControl = (fixOffset,offset) =>{
                const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
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
            const transitionControlMenuOut = () =>{
                const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
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
            if(!subMenu){
                menu.classList.remove('dropdown__menu-fix')
                transitionControlMenuOut()
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
                    transitionControl(-e.target.clientWidth - 5,-e.target.clientWidth - 5)
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
                    transitionControl(e.target.clientWidth + 5,e.target.clientWidth + 5)
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
                if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left')){
                    subMenu.style.height = '0px'
                }
            },animationTime)

           
    }
    const handleMenusInit = (e) =>{
        const subMenus = e.target.parentElement.querySelectorAll('.dropdown__submenu')
        subMenus.forEach(sm => {
            const menu = sm.querySelector('.dropdown__menu')
            if(menu.classList.contains('menu__open')){
                handleMenuClose(e,menu,sm)
            }
        })
    }
  
    allDropdownItem.forEach(i => {
        const button = i.firstElementChild
        const menu = button.nextElementSibling.firstElementChild
        if(button && menu){
            if(button.classList.contains('event--click')){
                button.addEventListener('click',(e)=>{
                    e.stopImmediatePropagation()
                    if(menu){
                        if(!menu.classList.contains('menu__open')){
                            const mainSubMenu = e.target.parentElement.querySelector('.dropdown__submenu')
                            const allInnerMenus = mainSubMenu.querySelectorAll('.dropdown__menu')
                            const mainMenus = e.target.parentElement.parentElement.querySelectorAll('.dropdown__menu-wrapper > .dropdown__menu')
                            mainMenus.forEach(m=>{
                                if(m){
                                    m.classList.remove('menu__open')
                                    m.style.animation = 'none'
                                }
                            })
                            handleMenusInit(e)
                            handleMenuOpen(e,menu)
 

                        }else{
                            handleMenuClose(e,menu)
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
                            handleMenusInit(e)
                            handleMenuOpen(e,menu)

                        }else{
                            handleMenuClose(e,menu)
                        }
                    }
                })
            }
        }
    })
    allSubMenusItems.forEach(mi => {
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
                                handleMenusInit(e)
                                handleMenuOpen(e,menu,subMenu)
    
                            }else{
                                handleMenuClose(e,menu,subMenu)
    
                            }
                        }
                    })
                }
                if(mi.classList.contains('event--hover')){
                    mi.addEventListener('mouseover',(e)=>{
                        e.stopImmediatePropagation()
                        if(menu){
                            if(!menu.classList.contains('menu__open')){
                                handleMenusInit(e)
                                handleMenuOpen(e,menu,subMenu)
    
                            }else{
                                handleMenuClose(e,menu,subMenu)
    
                            }
                        }
                    })
                }
            }
        }

    })
}

const handlePaintCards = (cards,angle)=>{
    cards.forEach(card=>{
        let tempAngle = angle
        while(angle > 0){     
            card.style.transform = `rotate3d(1,-1,1,${tempAngle}deg)`
            card.style.transition = 'all 0s ease'
            const shadowCard = createShadowCard(isLeft,1)
            shadowCard.style.position = 'absolute'
            shadowCard.style.left = card.offsetLeft + 'px'
            shadowCard.style.top = card.offsetTop + 'px'
            shadowCard.style.transform = `rotate3d(1,-1,1,${tempAngle}deg)`
            shadowCard.style.color = 'transparent'
            card.parentElement.insertBefore(shadowCard,card)
            card.previousAngle = angle
            tempAngle -=  2
        }
    })
}

const handleCards = () =>{

    const handleCardsShadow = (targetEls,normal,isLeft,initX,initY,moveX,moveY) =>{
        const styles = document.querySelector('style')

        const handleCardShadow = (card) =>{
            let translateX = initX
            let translateY = initY
            let zIndex = -8000
            let nthType = 4
            let cardIndex
            if(Array.isArray(targetEls)){
                cardIndex = targetEls.indexOf(card) + 1
            }
            const header = card.querySelector('.card__header')
            const body = card.querySelector('.card__body')
            const footer = card.querySelector('.card__footer')
            const getColors = (el) =>{
                let gradient = getComputedStyle(el,":before").background
                const gradientExpression = /linear-gradient\((.*)\)/gi
                const validExpression = gradient.match(gradientExpression)
                let colors
                if(validExpression !== null && validExpression !== undefined){
                    if(typeof validExpression.join('') === 'string'){
                        colors = validExpression.join('').match(colorsRegex)
                    }
                }
                let gradientFirstColor
                let gradientSecondColor
                if(colors?.length > 0){
                    if(colors[0]){
                        if(rgb.test(colors[0])){
                            gradientFirstColor = colors[0].match(rgb).slice(1,4).join(', ')
                        }else{
                            gradientFirstColor = colors[0].match(rgba).slice(1,4).join(', ')
                        }
                    }
                }
                if(colors?.length > 1){
                    if(colors[1]){
                        
                        if(rgb.test(colors[1])){
                            gradientSecondColor = colors[1].match(rgb).slice(1,4).join(', ')
                        }else{
                        gradientSecondColor = colors[1].match(rgba).slice(1,4).join(', ')
                    }
                }  
                if(card.classList.contains('shadow-left-black')){
                    gradientFirstColor = '0,0,0'
                }  
                if(card.classList.contains('shadow-right-black')){
                    gradientSecondColor = '0,0,0'
                }  
                if(card.classList.contains('shadow-left-white')){
                    gradientFirstColor = '255,255,255'
                }  
                if(card.classList.contains('shadow-right-white')){
                    gradientSecondColor = '255,255,255'
                }  
            }
                return {
                    background:hexToRgbArr(rgbToHex(...colorToRgbArray(getComputedStyle(el).backgroundColor))),
                    borderColor:hexToRgbArr(rgbToHex(...colorToRgbArray(getComputedStyle(el).borderColor))),
                    borderGradient:{
                        first:gradientFirstColor,
                        second:gradientSecondColor,
                    } ,
                    isExists:getComputedStyle(el,":before").content == 'none' ? false : true
                }
            }   
        
            const cardColors = getColors(card)
            const headerColors = getColors(header)
            const bodyColors = getColors(body)
            const footerColors = getColors(footer)

            const removeBg = (el) =>{
                for (let i = el.classList.length - 1; i >= 0; i--) {
                    const className = el.classList[i];
                    if (className.startsWith('bg-')) {
                        el.classList.remove(className);
                    }
                }
            }
            const isHaveBg = (el) =>{
                for (let i = el.classList.length - 1; i >= 0; i--) {
                    const className = el.classList[i];
                    if (className.startsWith('bg-')) {
                        return true
                    }else{
                        return false
                    }
                }
            }

            const createShadowCard = (isLeft,opacity) =>{
                const shadowCard = document.createElement('div')
                const shadowHeader = document.createElement('div')
                const cardGradientClass = [...card.classList].filter(c =>{
                    if(/gradient/gi.test(c)){
                        return c
                    }
                })
                shadowCard.classList = 'card'
                cardGradientClass.forEach(c =>{
                    shadowCard.classList.add(c)
                })
                shadowHeader.classList = header.classList
                removeBg(shadowHeader)
                const shadowBody = document.createElement('div')
                shadowBody.classList = body.classList
                removeBg(shadowBody)
                const shadowFooter = document.createElement('div')
                shadowFooter.classList = footer.classList
                removeBg(shadowFooter)
                shadowCard.style.position = 'absolute'
                shadowCard.style.borderColor = `rgba(${cardColors.borderColor[0]},${cardColors.borderColor[1]},${cardColors.borderColor[2]},${opacity})`
                shadowCard.style.backgroundColor = `rgba(${cardColors.background[0]},${cardColors.background[1]},${cardColors.background[2]},${opacity})`
                if(isLeft){
                    shadowCard.style.transform = `translate(${translateX}px,${translateY}px)`
                }else{
                    shadowCard.style.transform = `translate(-${translateX}px,${translateY}px)`
                }
                shadowCard.style.width = card.clientWidth + 'px'
                shadowCard.style.zIndex = zIndex
                if(header){
                    if(isHaveBg(header)){
                        shadowHeader.style.backgroundColor = `rgba(${headerColors.background[0]},${headerColors.background[1]},${headerColors.background[2]},${opacity})`
                        shadowHeader.style.borderColor = `rgba(${headerColors.borderColor[0]},${headerColors.borderColor[1]},${headerColors.borderColor[2]},${opacity})`
                    }else{
                        header.style.backgroundColor = `rgba(${cardColors.background[0]},${cardColors.background[1]},${cardColors.background[2]},1)`
                    }
                    if(headerColors.isExists){
                        styles.innerHTML += `.card:nth-of-type(${cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${headerColors.borderGradient.first}, ${opacity}), rgba(${headerColors.borderGradient.second}, ${opacity}));\n}`
                    }
                    shadowHeader.innerHTML = header.innerHTML
                    shadowCard.appendChild(shadowHeader)
                    
                }
                if(body){
                    if(isHaveBg(body)){
                        shadowBody.style.backgroundColor = `rgba(${bodyColors.background[0]},${bodyColors.background[1]},${bodyColors.background[2]},${opacity})`
                        shadowBody.style.borderColor = `rgba(${bodyColors.background[0]},${bodyColors.background[1]},${bodyColors.background[2]},${opacity})`
                        shadowBody.style.borderTopColor = `rgba(${bodyColors.background[0]},${bodyColors.background[1]},${bodyColors.background[2]},${opacity})`
                        shadowBody.style.borderTopColor = `rgba(${bodyColors.background[0]},${bodyColors.background[1]},${bodyColors.background[2]},${opacity})`
                    }else{
                        body.style.backgroundColor = `rgba(${cardColors.background[0]},${cardColors.background[1]},${cardColors.background[2]},1)`
                    }
                    if(bodyColors.isExists){
                        styles.innerHTML += `.card:nth-of-type(${cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${headerColors.borderGradient.first}, ${opacity}), rgba(${headerColors.borderGradient.second}, ${opacity}))\n;}`
                    }
                    shadowBody.innerHTML = body.innerHTML
                    shadowCard.appendChild(shadowBody)
                    
                }
                if(footer){
                    if(isHaveBg(footer)){
                        shadowFooter.style.backgroundColor = `rgba(${footerColors.background[0]},${footerColors.background[1]},${footerColors.background[2]},${opacity})`
                        shadowFooter.style.borderColor = `rgba(${footerColors.borderColor[0]},${footerColors.borderColor[1]},${footerColors.borderColor[2]},${opacity})`
                    }else{
                        footer.style.backgroundColor = `rgba(${cardColors.background[0]},${cardColors.background[1]},${cardColors.background[2]},1)`
                    }
                    if(footerColors.isExists){
                        styles.innerHTML += `.card:nth-of-type(${cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${headerColors.borderGradient.first}, ${opacity}), rgba(${headerColors.borderGradient.second}, ${opacity}))\n;}`
                    }
                    shadowFooter.innerHTML = footer.innerHTML
                    shadowCard.appendChild(shadowFooter)
                }
                const isOneExists = [headerColors.isExists,bodyColors.isExists,footerColors.isExists]
                if(cardColors.isExists && !isOneExists.includes(true)){
                    styles.innerHTML += `.card:nth-of-type(${cardIndex}) .card:nth-of-type(${nthType})::before{ 
                        background:linear-gradient(to right, rgba(${cardColors.borderGradient.first}, ${opacity}), rgba(${cardColors.borderGradient.second}, ${opacity}));
                        max-height:99.5%;
                        
                    }\n`
                }
                return shadowCard
            }

            if(normal){
                for(let opacity = 0.6; opacity > 0.1; opacity -= 0.1){
                    const shadowCard = createShadowCard(isLeft,opacity)
                    card.appendChild(shadowCard)
                    translateX += moveX
                    translateY += moveY
                    zIndex -= 1
                    nthType += 1
                }
            }else{
               if(!card.isBack){
                  let angle
                  if(card.previousAngle > 0){
                    angle = card.previousAngle
                  }else{
                    angle = 100
                  }
      
                   if(isLeft){
                       const anim = () =>{    
                            card.style.transform = `rotate3d(1,-1,1,${angle}deg)`
                            card.style.transition = 'all 0s ease'
                            const shadowCard = createShadowCard(isLeft,1)
                            shadowCard.style.position = 'absolute'
                            shadowCard.style.left = card.offsetLeft + 'px'
                            shadowCard.style.top = card.offsetTop + 'px'
                            shadowCard.style.transform = `rotate3d(1,-1,1,${angle}deg)`
                            shadowCard.style.color = 'transparent'
                            shadowCard.previousAngle = angle
                            card.parentElement.insertBefore(shadowCard,card)
                            card.previousAngle = angle
                            angle -=  2
                            if(angle >= 0 && !card.isBack){
                                window.requestAnimationFrame(anim)
                            }

                    }
                    anim()
                    
                }else{
                    // for(let i = angle; i >= 0; i--){
                    //     setTimeout(()=>{
                    //         card.style.transform = `rotate3d(1,-1,1,${i - 1}deg)`
                    //         const shadowCard = createShadowCard(isLeft,1)
                    //         shadowCard.style.transform = `rotate3d(1,-1,1,${i}deg)`
                    //         card.appendChild(shadowCard)
                    //     },time += 7)
                    // }
                    
                    }
                }
            }
        }
        if(Array.isArray(targetEls)){
            targetEls.forEach((card,index) => {
                handleCardShadow(card)
            })
        }else{
            handleCardShadow(targetEls)
        }
    }

    const handleRotateBackClear = (card,isLeft) =>{
      
        let angle
        if(card.previousAngle > 0){
            angle = card.previousAngle
        }else{
            angle = 0
        }
      
        if(card.isBack){
            if(isLeft){
                const anim = () =>{    
                    if(angle < 100){
                        card.style.transform = `rotate3d(1,-1,1,${angle}deg)`
                        card.style.transition = 'all 0s ease'
                        const children = [...card.parentElement.querySelectorAll('.card')]
                        if(children.length >= 2){
                            card.parentElement.removeChild(children[children.length - 2])
                        }
                    card.previousAngle = angle
                    angle += 2
                    requestAnimationFrame(anim)
                }
                else if(angle === 100){
                    const children = [...card.parentElement.querySelectorAll('.card')]
                    children.slice(0,children.length - 1).forEach(c => c.remove())
                }
                                
                
            }
            anim()                    
               
            }else{
        // for(let i = angle; i >= 0; i--){
            //     setTimeout(()=>{
                //         card.style.transform = `rotate3d(1,-1,1,${i - 1}deg)`
                //         const shadowCard = createShadowCard(isLeft,1)
                //         shadowCard.style.transform = `rotate3d(1,-1,1,${i}deg)`
                //         card.appendChild(shadowCard)
                //     },time += 7)
                // }
                
            }
        }   
    }
    
    const handleRotateBack = (card,isLeft,initX,initY,moveX,moveY,angle) =>{
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        let stepX = initX
        let stepY = initY
        if(isLeft){
            card.style.transform  = `rotate3d(-1,-1,-1,${angle}deg)`
        }else{
            card.style.transform  = `rotate3d(1,-1,1,${angle}deg)`
        }
        const innerCards = [...card.querySelectorAll('.card')]
        innerCards.forEach(c => {
            if(isLeft){
                c.style.transform = `translate(-${stepX}px,${stepY}px)`
            }
            else{
                c.style.transform = `translate(${stepX}px,${stepY}px)`
            }
            stepX += moveX
            stepY += moveY
        })
    }
    const handleAnim = (card) =>{
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        const innerCards = card.querySelectorAll('.card')
        const handleDirection = (isLeft,isBottom,initX,initY,moveX,moveY) =>{
            let stepX = initX
            let stepY = initY
            let index = 0
            card.style.transform = `rotate3d(1,-1,1,0deg)`
            for(let i = 0.6; i > 0.1; i-= 0.1){
                innerCards[index].style.transform = `translate(${stepX}px,${stepY}px)`
                if(isLeft){
                    stepX -= moveX
                }
                else{
                    stepX += moveX
                }
                if(isBottom){  
                    stepY += moveY
                }else{
                    stepY -= moveY
                }
                index++
            }
     
        }
        if(card.classList.contains('card__hover--3d-65deg-right-with-shadow')){
            card.style.transform = `rotate3d(1,-1,1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow')){
            card.style.transform = `rotate3d(-1,-1,-1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        if(card.classList.contains('card__hover--3d-100deg-right-with-shadow')){
            card.style.transform = `rotate3d(1,-1,1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow')){
            card.style.transform = `rotate3d(-1,-1,-1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }

        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-left-top') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-left-top')){
            handleDirection(true,false,-65,-15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-left-bottom')){
            handleDirection(true,true,-65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-bottom')){
            handleDirection(false,true,65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-top')){
            handleDirection(false,false,65,-15,65,15) 
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-top')){
            handleDirection(true,false,-25,-10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-bottom')){
            handleDirection(true,true,-25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-bottom')){
            handleDirection(false,true,25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-top')){
            handleDirection(false,false,25,-10,25,10) 
        }
    }
    
    const ThreeD100degRightCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-100deg-right-with-shadow]')]
    const ThreeD65degRightCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-65deg-right-with-shadow]')]
    const ThreeD100degLeftCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-100deg-left-with-shadow]')]
    const ThreeD65degLeftCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-65deg-left-with-shadow]')]

    if(ThreeD100degRightCardsWithShadow){
        ThreeD100degRightCardsWithShadow.forEach(card => {
            card.isBack = false
            card.addEventListener('mouseover',(e)=>handleAnim(e.target))
            card.parentElement.addEventListener('mouseenter',(e)=>{
                e.stopPropagation()
                e.stopImmediatePropagation()
                card.isBack = false
                handleCardsShadow(card,false,true,65,15,65,15)
            })
            // card.addEventListener('mouseleave',(e)=>handleRotateBack(e.target,false,65,15,65,15,100))
            card.parentElement.addEventListener('mouseleave',(e)=>{
                card.isBack = true
                handleRotateBackClear(card,true)
            })
        })
        // handleCardsShadow(ThreeD100degRightCardsWithShadow,true,true,65,15,65,15)
    }
    if(ThreeD65degRightCardsWithShadow){
        ThreeD65degRightCardsWithShadow.forEach(card => {
            card.addEventListener('mouseover',(e)=>handleAnim(e.target))
            card.addEventListener('mouseleave',(e)=>handleRotateBack(e.target,false,25,10,25,10,65))
        })
        handleCardsShadow(ThreeD65degRightCardsWithShadow,true,true,25,10,25,10)
    }
   
    if(ThreeD100degLeftCardsWithShadow){
        ThreeD100degLeftCardsWithShadow.forEach(card => {
            card.addEventListener('mouseover',(e)=>handleAnim(e.target))
            card.addEventListener('mouseleave',(e)=>handleRotateBack(e.target,true,65,15,65,15,100))
        })
        handleCardsShadow(ThreeD100degLeftCardsWithShadow,true,false,65,15,65,15)
    }
    if(ThreeD65degLeftCardsWithShadow){
        ThreeD65degLeftCardsWithShadow.forEach(card => {
            card.addEventListener('mouseover',(e)=>handleAnim(e.target))
            card.addEventListener('mouseleave',(e)=>handleRotateBack(e.target,true,25,10,25,10,65))
        })
        handleCardsShadow(ThreeD65degLeftCardsWithShadow,true,false,25,10,25,10)
    }
}
const handleCanvasCards = () =>{
    const ThreeD100degRightCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-100deg-right-with-shadow]')]
    const ThreeD65degRightCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-65deg-right-with-shadow]')]
    const ThreeD100degLeftCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-100deg-left-with-shadow]')]
    const ThreeD65degLeftCardsWithShadow = [...document.querySelectorAll('[class*=card__hover--3d-65deg-left-with-shadow]')]
  

    class Props {
        constructor(selector,card){
            this.el = card.parentElement.querySelector(`${selector}`)
            if(this.el){
                this.child = this.el.querySelector(':scope *')
                if(this.el.children.length > 1){
                    this.children = this.el.querySelectorAll(':scope *')
                }
            }
          
        }

        parseMarginPadding(el,property){
                if(property === 'margin'){
                    var valueTop = getComputedStyle(el).marginTop.replace('px','')
                    var valueRight = getComputedStyle(el).marginRight.replace('px','')
                    var valueBottom = getComputedStyle(el).marginBottom.replace('px','')
                    var valueLeft = getComputedStyle(el).marginLeft.replace('px','')
                }else if(property === 'padding'){
                    var valueTop = getComputedStyle(el).paddingTop.replace('px','')
                    var valueRight = getComputedStyle(el).paddingRight.replace('px','')
                    var valueBottom = getComputedStyle(el).paddingBottom.replace('px','')
                    var valueLeft = getComputedStyle(el).paddingLeft.replace('px','')
                }
               
                const m = {
                    top:Number(valueTop),
                    right:Number(valueRight),
                    bottom:Number(valueBottom),
                    left:Number(valueLeft),
                }
                return m
        }

        getY(isChild){
            if(!isChild && isChild !== 'child'){
                return this.el.offsetTop
            }else{
                return this.child.offsetTop
            }
        }
        getX(isChild){
            if(!isChild && isChild !== 'child'){
                return this.el.offsetLeft
            }else{
                return this.child.offsetLeft
            }
        }
        getRect(){
            if(!isChild && isChild !== 'child'){
                return this.el.getBoundingClientRect()
            }else{
                return this.child.getBoundingClientRect()
            }
            
        }
        getWidth(isChild){
            if(!isChild && isChild !== 'child'){
                return this.el.offsetWidth
            }else{
                return this.child.offsetWidth
            }
        }
        getHeight(isChild){
            if(!isChild && isChild !== 'child'){
                return this.el.offsetHeight
            }else{
                return this.child.offsetHeight
            }
            
        }
        getText(isChild){
            if(!isChild && isChild !== 'child'){
                return this.el.textContent.trim()
            }else{
                return this.child.textContent.trim()
            }
        }
        getFont(isChild){
            if(!isChild && isChild !== 'child'){
                return getComputedStyle(this.el).font
            }else{
                return getComputedStyle(this.child).font
            }
        }
        getFontSize(isChild){
            if(!isChild && isChild !== 'child'){
                return Number(getComputedStyle(this.el).fontSize.replace('px',''))
            }else{
                return Number(getComputedStyle(this.child).fontSize.replace('px',''))
            }
        }
        getTextAlign(isChild){
            if(!isChild && isChild !== 'child'){
                return getComputedStyle(this.el).textAlign
            }else{
                return getComputedStyle(this.child).textAlign
            }
        }
        getLineHeight(isChild){
            const regex = /px/gi
            if(!isChild && isChild !== 'child'){
                const lineHeight = getComputedStyle(this.el).lineHeight
                if(regex.test(lineHeight)){
                    return Number(lineHeight.replace('px','')) 
                }else{
                    return 24 / 1.3
                }
            }else{
                const lineHeight = getComputedStyle(this.child).lineHeight
                if(regex.test(lineHeight)){
                    return Number(lineHeight.replace('px','')) 
                }else{
                    return 24 / 1.3
                }
            }
        }
        getTextPos(isChild){
            const range = document.createRange();
            if(!isChild && isChild !== 'child'){
                range.selectNode(this.el.firstChild);
                return range.getBoundingClientRect()

            }else{
                range.selectNode(this.child.firstChild);
                const elementRect = this.el.getBoundingClientRect()
                return range.getBoundingClientRect()
            }
        }
       
        getBorderRadius(isChild){
            if(!isChild && isChild !== 'child'){
                return {
                    upperLeft:Number(getComputedStyle(this.el).borderTopLeftRadius.replace('px','')),
                    upperRight:Number(getComputedStyle(this.el).borderTopRightRadius.replace('px','')),
                    lowerLeft:Number(getComputedStyle(this.el).borderBottomLeftRadius.replace('px','')),
                    lowerRight:Number(getComputedStyle(this.el).borderBottomRightRadius.replace('px',''))
                }
            }else{
                 return {
                    upperLeft:Number(getComputedStyle(this.child).borderTopLeftRadius.replace('px','')),
                    upperRight:Number(getComputedStyle(this.child).borderTopRightRadius.replace('px','')),
                    lowerLeft:Number(getComputedStyle(this.child).borderBottomLeftRadius.replace('px','')),
                    lowerRight:Number(getComputedStyle(this.child).borderBottomRightRadius.replace('px',''))
                }
            }
        }
        getBackground(isChild){
            if(!isChild && isChild !== 'child'){
                const arr = colorToRgbArray(getComputedStyle(this.el).background)
                if(arr[5]){
                    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
                }else{
                    return `rgb(${arr[0]},${arr[1]},${arr[2]})`
                }
            }else{
                const arr = colorToRgbArray(getComputedStyle(this.child).background)
                if(arr[5]){
                    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
                }else{
                    return `rgb(${arr[0]},${arr[1]},${arr[2]})`
                }
            }
        }
        getColor(isChild){
            if(!isChild && isChild !== 'child'){
                const arr = colorToRgbArray(getComputedStyle(this.el).color)
                if(arr[5]){
                    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
                }else{
                    return `rgb(${arr[0]},${arr[1]},${arr[2]})`
                }
            }else{
                const arr = colorToRgbArray(getComputedStyle(this.child).color)
                if(arr[5]){
                    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
                }else{
                    return `rgb(${arr[0]},${arr[1]},${arr[2]})`
                }
            }
        }
        getMargin(isChild){
            if(!isChild && isChild !== 'child'){
                return this.parseMarginPadding(this.el,'margin')
            }else{
                return this.parseMarginPadding(this.child,'margin')
            }
        }
        getPadding(isChild){
            if(!isChild && isChild !== 'child'){
                return this.parseMarginPadding(this.el,'padding')
            }else{
                return this.parseMarginPadding(this.child,'padding')
            }
        }
      
    }

    class CanvasCard {
        constructor(card,c_instance){
            this.place = card.parentElement
            this.canvas = document.createElement('canvas')
            this.ctx = this.canvas.getContext('2d')
            this.x = 0
            this.y = 0
            this.step = 0
            this.instance = c_instance
            this.cardPixels = []
            this.index = 0
            this.w = this.canvas.width
            this.h = this.canvas.height
        }
        setCanvas(){      
            this.canvas.style.position = 'absolute'
            this.canvas.style.top = this.instance.getY() + 400 + 'px'
            this.canvas.style.left = this.instance.getX() - 90 + 'px'
            this.canvas.setAttribute('width',this.instance.getWidth() + 200) 
            this.canvas.setAttribute('height',this.instance.getHeight() + 200) 
            this.place.appendChild(this.canvas)
        }
        getLines(text, maxWidth) {
            var words = text.split(" ");
            var lines = [];
            var currentLine = words[0];
        
            for (var i = 1; i < words.length; i++) {
                var word = words[i];
                var width = this.ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }
        getCardPixels(){
            let card = []
            const imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)
            const data = imageData.data       
            for(let i = 0; i < data.length; i+=4){
                var x = (i / 4) % this.canvas.width;
                var y = Math.floor((i / 4) / this.canvas.width);

                const r = data[i]
                const g = data[i+1]
                const b = data[i+2]
                const a = data[i+3]
                if(a !== 0){
                    card.push({x,y,r,g,b,a,c:`rgba(${r},${g},${b},${a})`})
                }
            }
            this.cardPixels = card
        }
    }


    class Bubble {
        constructor (ctx, x, y, vx, vy,accX,accY,c){
            this.ctx = ctx
            this.x = x
            this.y = y
            this.r = Math.random() * 1
            this.fx = x
            this.fy = y
            this.dx = 0
            this.dy = 0
            this.accX = accX
            this.accY = accY
            this.vx = vx
            this.vy = vy
            this.c = c
        }
        draw(){
            this.r += 0.2
            // this.x = this.x + Math.cos(this.r) * 5
            // this.y = this.y + Math.sin(this.r) * 5
            // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
            // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
            this.ctx.fillStyle = this.c
            this.ctx.beginPath()
            this.ctx.arc(this.x,this.y, 2, 0, 2 * Math.PI);
            // this.ctx.fillRect(this.x,this.y,1,1)
            this.ctx.closePath()
            this.ctx.fill()
        }
        update(){
            if(this.fx !== this.x){
                this.dx = Math.sqrt((this.fx - this.x) ** 2)
            }
            if(this.fy !== this.y){
                this.dy = Math.sqrt((this.y - this.fy) ** 2)
            }
            
            this.accX = (this.fx - this.x) / 300;
            this.accY = (this.fy - this.y) / 300;
            this.vx += this.accX * 10;
            this.vy += this.accY * 10;
            // this.x += this.vx;s
            // this.y += this.vy;
            // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
            // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
        }
    }

    class Circle {
        constructor(ctx, x, y, vx, vy,accX,accY,c){
            this.ctx = ctx
            this.x = x
            this.y = y
            this.r = Math.random() * 1
            this.fx = x
            this.fy = y
            this.dx = 0
            this.dy = 0
            this.accX = accX
            this.accY = accY
            this.vx = vx
            this.vy = vy
            this.c = c
        }
        draw(mousePos){
            // this.r += 0.2
            // this.x = this.x + Math.cos(this.r) * 5
            // this.y = this.y + Math.sin(this.r) * 5
            // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
            // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
            this.ctx.fillStyle =`rgba(0,0,255,1)`
            this.ctx.beginPath()
            this.ctx.arc(mousePos.x,mousePos.y, 20, 0, 2 * Math.PI);
            this.ctx.closePath()
            this.ctx.fill()
        }
        update(){
            this.accX = (this.fx - this.x) / 300;
            this.accY = (this.fy - this.y) / 300;
            this.vx += this.accX * 10;
            this.vy += this.accY * 10;
            // this.x += this.vx;
            // this.y += this.vy;
            // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
            // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
        }
    }

    const drawCard = (canva,c,h,b,f) =>{
    
        canva.setCanvas()

        const xTr = canva.canvas.width / 5.5 
        const yTr = canva.canvas.height / 5
        canva.ctx.clearRect(0,0,canva.canvas.width,canva.canvas.height)
        canva.ctx.strokeStyle = 'rgba(0,0,0,0)'
        canva.ctx.beginPath();    
        canva.ctx.fillStyle = c.getBackground()
        // canva.ctx.roundRect(0,0, c.getWidth(), c.getHeight(),c.getBorderRadius(),true)
        canva.ctx.font = h.getFont('child')
        const marginsAndPaddingsHeaderX = c.getPadding().left +  h.getMargin().left + h.getPadding().left + h.getMargin('child').left + h.getPadding('child').left
        const marginsAndPaddingsHeaderY = c.getPadding().top + h.getMargin().top  + h.getPadding().top  + h.getMargin('child').top  + h.getPadding('child').top  + h.getFontSize('child')
        canva.ctx.fillStyle = h.getBackground()
        canva.ctx.roundRect(xTr +c.getPadding().left,yTr+c.getPadding().top, h.getWidth() - c.getPadding().left, h.getHeight() - c.getPadding().top,h.getBorderRadius(),true)
        canva.ctx.fillStyle = h.getColor('child')
        canva.ctx.font = h.getFont('child')
        canva.ctx.fillText(h.getText('child'),xTr+marginsAndPaddingsHeaderX,yTr+marginsAndPaddingsHeaderY);

        const marginsAndPaddingsBodyX = c.getPadding().left +  b.getMargin().left + b.getPadding().left
        const marginsAndPaddingsBodyY = c.getPadding().top + b.getMargin().top + b.getPadding().top + b.getFontSize()
        canva.ctx.fillStyle = b.getBackground()
        canva.ctx.roundRect(xTr+marginsAndPaddingsBodyX - b.getPadding().left,yTr+ marginsAndPaddingsHeaderY + marginsAndPaddingsBodyY - h.getFontSize('child') / 1.5, h.getWidth(), b.getHeight(),b.getBorderRadius(),true)
        canva.ctx.fillStyle = b.getColor()
        const bodyLines = canva.getLines(b.getText(),canva.canvas.width * 1.5 - 200)
        canva.ctx.font = b.getFont()
        let step = marginsAndPaddingsBodyY + marginsAndPaddingsHeaderY + b.getPadding().top / 2 +yTr
        const lineHeight = b.getLineHeight()
        bodyLines.forEach(l =>{
            canva.ctx.fillText(l,xTr+marginsAndPaddingsBodyX,step);
            step += lineHeight 
        })

        const marginsAndPaddingsFooterX = c.getPadding().left +  f.getMargin().left + f.getPadding().left +  f.getMargin('child').left + f.getPadding('child').left
    
        canva.ctx.fillStyle = f.getBackground()
        canva.ctx.roundRect(xTr, yTr+b.getHeight() + marginsAndPaddingsHeaderY + marginsAndPaddingsBodyY -  h.getFontSize('child') / 1.3, h.getWidth() - c.getPadding().left, f.getHeight() + 5,f.getBorderRadius(),true)
        canva.ctx.fillStyle = f.getColor()
        canva.ctx.font = f.getFont('child')
        canva.ctx.fillText(f.getText('child'),xTr+marginsAndPaddingsFooterX,step);
        canva.ctx.closePath();   
        canva.getCardPixels()
    }


    
    document.querySelectorAll('.card').forEach(card =>{
        const c = new Props('.card',card)
        const h = new Props('.card__header',card)
        const b = new Props('.card__body',card)
        const f = new Props('.card__footer',card)
        const canva = new CanvasCard(card,c)
        drawCard(canva,c,h,b,f)
  
        let bubbles = []
        canva.cardPixels.forEach(p =>{
            if(p.x % 4 === 0 && p.y % 4 === 0){
                const bubble = new Bubble(canva.ctx,p.x,p.y,1,1,10,10,p.c)
                bubbles.push(bubble)
            }
        })
        

        const transformsRotate = (canva) =>{
                   
                    canva.ctx.fillStyle = `rgba(255,255,255,1)`
                    canva.ctx.fillRect(0,0,canva.canvas.width,canva.canvas.height)
                    bubbles.forEach(b => b.draw())
                    // bubbles.forEach(b => b.update())
                    
                   
                    // requestAnimationFrame(()=>transformsRotate(canva)) 
            }
        const handleCircle = (e,canva) =>{
            var rect = canva.canvas.getBoundingClientRect();
            const mousePos = {
                x:e.clientX - rect.left,
                y:e.clientY - rect.top
            }
            new Circle(canva.ctx).draw(mousePos)
            requestAnimationFrame(()=>handleCircle(e,canva))
        }
            
           
                            // if(c.x % 10 == 0){
                                //     ctx.fillStyle = 'white'
                                //     ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${255 / c.a})`
                                //     ctx.fillRect(c.x,c.y,5,5)
                                // }
                                
                                
                                // ctx.fillStyle = 'rgba(255,255,255,0.1)'
                                // ctx.fillRect(-10,-10,2000,2000)
                                // ctx.setTransform(1, 0, 0, 1, 0, 0);
                                // ctx.restore()
                                // const xTr = canvas.width / 5.5 
                                // const yTr = canvas.height / 5
                                // ctx.translate((card.offsetWidth + xTr) / 1.65,(card.offsetHeight+ yTr) / 1.6);
                                // ctx.rotate(4 * Math.PI / 180);
                                // ctx.scale(1, 1);
                                // ctx.translate(-(card.offsetWidth + xTr) / 1.65,-(card.offsetHeight+ yTr) / 1.6);
                                // drawCard()
                                // if(rotate <= 356){
                                    //     rotate++
                                    // }
                                    
                                
            
    
                    
        const canvas = card.parentElement.querySelector('canvas')
        canvas.addEventListener('mouseenter',(e)=>{
            transformsRotate(canva)
            // onMouseMove(e)
        })
        canvas.addEventListener('mousemove',(e)=>{
            // handleCircle(e,canva)
            // onMouseMove(e)
        })
    })

}

// handleButtonFocuses()
// handlePulseAnimations()
// handleShadowAnimations()
// handlePulses('button')
// handlePulses('.accordion__heading')
// handleButtonCollapses()
// handleAccordions()
// handleClose()
// handleBreadcrumbAnim()
// handleDropdowns()
handleCards()
handleCanvasCards()
handlePositionRules()
handleTransforms()

