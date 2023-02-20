class Card{
    constructor(selector,card,normalOrPaint,isLeft,isBottom,initX,initY,moveX,moveY,angle,fangle){
        this.cards = document.querySelectorAll(selector);
        this.card = card;
        this.normalOrPaint = normalOrPaint
        this.isClicked = false
        this.isLeft = isLeft
        this.isBottom = isBottom
        this.initX = initX
        this.initY = initY
        this.moveX = moveX
        this.moveY = moveY
        this.angle = angle
        this.fangle = fangle
        this.previousAngle = 0
        this.cardIndex = 0
        this.header = card.querySelector('.card__header')
        this.body = card.querySelector('.card__body')
        this.button = card.querySelector('.card__button')
        this.footer = card.querySelector('.card__footer')
        this.headerColor = this.getColors(this.header)
        this.bodyColor = this.getColors(this.body)
        this.buttonColor = this.getColors(this.button)
        this.footerColor = this.getColors(this.footer)
        this.cardColor = this.getColors(this.card)
        this.shadowCardZIndex = -8000
        this.nthType = 4
        this.isBack = false
        this.styles = document.querySelector('style')
        this.translateX = this.initX
        this.translateY = this.initY
    }
    getColors(el){
        if(el){

        let colorsRegex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
        let rgb = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
        let rgba = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
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
        if(this.card.classList.contains('shadow-left-black')){
            gradientFirstColor = '0,0,0'
        }  
        if(this.card.classList.contains('shadow-right-black')){
            gradientSecondColor = '0,0,0'
        }  
        if(this.card.classList.contains('shadow-left-white')){
            gradientFirstColor = '255,255,255'
        }  
        if(this.card.classList.contains('shadow-right-white')){
            gradientSecondColor = '255,255,255'
        }  
    }
        return {
            background:framework.utils.hexToRgbArr(framework.utils.rgbToHex(...framework.utils.colorToRgbArray(getComputedStyle(el).backgroundColor))),
            borderColor:framework.utils.hexToRgbArr(framework.utils.rgbToHex(...framework.utils.colorToRgbArray(getComputedStyle(el).borderColor))),
            borderGradient:{
                first:gradientFirstColor,
                second:gradientSecondColor,
            } ,
            isExists:getComputedStyle(el,":before").content === 'none' ? false : true
        }
    }

    } 
    removeBg(el){
        for (let i = el.classList.length - 1; i >= 0; i--) {
            const className = el.classList[i];
            if (className.startsWith('bg-')) {
                el.classList.remove(className);
            }
        }
    }
    isHaveBg(el){
        var matches = [el.classList].filter(function(pattern) {
            return new RegExp('bg-','gi').test(pattern);
          })
        if (matches.length > 0) {
            return true
        }else{
            return false
        }
    }  
    createShadowCard(opacity){
        const shadowCard = document.createElement('div')
        const cardGradientClass = [...this.card.classList].filter(c =>{
            if(/gradient/gi.test(c)){
                return c
            }else{
                return
            }
        })
        shadowCard.classList = 'card'
        cardGradientClass.forEach(c =>{
            shadowCard.classList.add(c)
        })
        const shadowHeader = document.createElement('div')
        if(this.header){
            shadowHeader.classList = this.header.classList
            this.removeBg(shadowHeader)
        }
        const shadowBody = document.createElement('div')
        if(this.body){
            shadowBody.classList = this.body.classList
            this.removeBg(shadowBody)
        }
        const shadowButton = document.createElement('button')
        if(this.button){
            shadowButton.classList = this.button.classList
            this.removeBg(shadowButton)
        }
        const shadowFooter = document.createElement('div')
        if(this.button){
            shadowFooter.classList = this.footer.classList
            this.removeBg(shadowFooter)
        }
        shadowCard.style.position = 'absolute'
        shadowCard.style.borderColor = `rgba(${this.cardColor.borderColor[0]},${this.cardColor.borderColor[1]},${this.cardColor.borderColor[2]},${opacity})`
        shadowCard.style.backgroundColor = `rgba(${this.cardColor.background[0]},${this.cardColor.background[1]},${this.cardColor.background[2]},${opacity})`
        if(!this.isLeft){
            shadowCard.style.transform = `translate(${this.translateX}px,${this.translateY}px)`
        }else{
            shadowCard.style.transform = `translate(-${this.translateX}px,${this.translateY}px)`
        }
        shadowCard.style.width = this.card.clientWidth + 'px'
        shadowCard.style.zIndex = this.shadowCardZIndex
        if(this.header){
            if(this.isHaveBg(this.header)){
                shadowHeader.style.backgroundColor = `rgba(${this.headerColor.background[0]},${this.headerColor.background[1]},${this.headerColor.background[2]},${opacity})`
                shadowHeader.style.borderColor = `rgba(${this.headerColor.borderColor[0]},${this.headerColor.borderColor[1]},${this.headerColor.borderColor[2]},${opacity})`
            }else{
                this.header.style.background = getComputedStyle(this.card).background
            }
            if(this.headerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}));\n}`
            }
            shadowHeader.innerHTML = this.header.innerHTML
            shadowCard.appendChild(shadowHeader)
            
        }
        if(this.button){
            if(this.isHaveBg(this.button)){
                shadowButton.style.backgroundColor = `rgba(${this.buttonColor.background[0]},${this.buttonColor.background[1]},${this.buttonColor.background[2]},${opacity})`
                shadowButton.style.borderColor = `rgba(${this.buttonColor.borderColor[0]},${this.buttonColor.borderColor[1]},${this.buttonColor.borderColor[2]},${opacity})`
            }else{
                this.button.style.background = getComputedStyle(this.card).background
            }
            if(this.footerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            shadowButton.innerHTML = this.button.innerHTML
            shadowBody.innerHTML = this.body.innerHTML 
            const shadowButtonToRemove = shadowBody.querySelector('button')
            shadowButtonToRemove.remove()
            shadowBody.appendChild(shadowButton)
        }
        if(this.body){
            if(this.isHaveBg(this.body)){
                shadowBody.style.backgroundColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderTopColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderBottomColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
            }else{
                this.body.style.background = getComputedStyle(this.card).background
            }
            if(this.bodyColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            // shadowBody.innerHTML = this.body.innerHTML
            shadowCard.appendChild(shadowBody)
        }
       
        if(this.footer){
            if(this.isHaveBg(this.footer)){
                shadowFooter.style.backgroundColor = `rgba(${this.footerColor.background[0]},${this.footerColor.background[1]},${this.footerColor.background[2]},${opacity})`
                shadowFooter.style.borderColor = `rgba(${this.footerColor.borderColor[0]},${this.footerColor.borderColor[1]},${this.footerColor.borderColor[2]},${opacity})`
            }else{
                this.footer.style.background = getComputedStyle(this.card).background
            }
            if(this.footerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            shadowFooter.innerHTML = this.footer.innerHTML
            shadowCard.appendChild(shadowFooter)
        }
        const isOneExists = [this.headerColor.isExists,this.bodyColor.isExists,this.footerColor.isExists,this.buttonColor.isExists]
        if(this.cardColor.isExists && !isOneExists.includes(true)){
            this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex}) .card:nth-of-type(${this.nthType})::before{ 
                background:linear-gradient(to right, rgba(${this.cardColor.borderGradient.first}, ${opacity}), rgba(${this.cardColor.borderGradient.second}, ${opacity}));
                max-height:99.5%;
                
            }\n`
        }
        return shadowCard
    }
    // anim
    handleAnimation = () =>{
        framework.utils.cancelAllAnimationFrames()
        this.card.style.transition = 'all 0s ease'
        this.card.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
        const shadowCard = this.createShadowCard(1)
        shadowCard.style.position = 'absolute'
        shadowCard.style.left = this.card.offsetLeft + 'px'
        shadowCard.style.top = this.card.offsetTop + 'px'
        shadowCard.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
        shadowCard.style.color = 'transparent'
        shadowCard.previousAngle = this.angle
        this.card.parentElement.insertBefore(shadowCard,this.card)
        this.angle -=  2
        this.previousAngle = this.angle
        if(this.angle >= 0 && !this.isBack){
            window.requestAnimationFrame(this.handleAnimation)
        }
    }
    handleCardShadow(){
        if(Array.isArray(this.cards)){
            this.cardIndex = this.cards.indexOf(this.card) + 1
        }
        if(!this.normalOrPaint){
            for(let opacity = 0.6; opacity > 0.1; opacity -= 0.1){
                const shadowCard = this.createShadowCard(opacity)
                this.card.appendChild(shadowCard)
                this.translateX += this.moveX
                this.translateY += this.moveY
                this.shadowCardZIndex -= 1
                this.nthType += 1
            }
        }else{
           if(!this.isBack){
              if(this.previousAngle > 0){
                this.angle = this.previousAngle
              }else{
                this.angle = 0
              }
              if(this.isLeft){
                this.handleAnimation()
              }else{
            
                }
            }
        }
    }
    handleRotateBackClearAnimation = () =>{
        framework.utils.cancelAllAnimationFrames()
        if(this.angle < 100){
            if(this.card){
                this.card.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
                this.card.style.transition = 'all 0s ease-in-out'
                
                const children = [...this.card.parentElement.querySelectorAll('.card')].filter(c => this.card !== c)
                if(children[children.length - 1]){
                    this.card.parentElement.removeChild(children[children.length - 1])
                }
                this.angle += 1.85
                this.previousAngle = this.angle 
            }
            requestAnimationFrame(this.handleRotateBackClearAnimation)
        }
        else if(this.angle >= 95){
            if(this.card){
                const children = [...this.card.parentElement.querySelectorAll('.card')].filter(c=> this.card !== c)
                children.forEach(c => c.remove())
            }
        }
    }
    handleRotateBackClear(){
        if(this.previousAngle > 0){
            this.angle = this.previousAngle 
        }else{
            this.angle = 0
        }
        if(this.isBack){
            this.handleRotateBackClearAnimation()
        }   
    }
    handleRotateBack = () =>{
        let card = this.card
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        let stepX = this.initX
        let stepY = this.initY
        if(this.isLeft){
            if(card){
                card.style.transform  = `rotate3d(-1,-1,-1,${this.fangle}deg)`
            }
        }else{
            if(card){
                card.style.transform  = `rotate3d(1,-1,1,${this.fangle}deg)`
            }
        }
        const innerCards = [...card.querySelectorAll('.card')]
        innerCards.forEach(c => {
            if(this.isLeft){
                c.style.transform = `translate(-${stepX}px,${stepY}px)`
            }
            else{
                c.style.transform = `translate(${stepX}px,${stepY}px)`
            }
            stepX += this.moveX
            stepY += this.moveY
        })
    }
    handleDirection(initX,initY,moveX,moveY){
        let stepX = initX
        let stepY = initY
        let index = 0
        const innerCards = [...this.card.querySelectorAll('.card')]
        if(this.card){
            this.card.style.transform = `rotate3d(1,-1,1,0deg)`
        }
        for(let i = 0.6; i > 0.1; i-= 0.1){
            innerCards[index].style.transform = `translate(${stepX}px,${stepY}px)`
            if(this.isLeft){
                stepX -= moveX
            }
            else{
                stepX += moveX
            }
            if(this.isBottom){  
                stepY += moveY
            }else{
                stepY -= moveY
            }
            index++
        }
 
    }
    handleMainAnimation(){
        let card = this.card
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        const innerCards = card.querySelectorAll('.card')
       
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
            this.handleDirection(-65,-15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-left-bottom')){
            this.handleDirection(-65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-bottom')){
            this.handleDirection(65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-top')){
            this.handleDirection(65,-15,65,15) 
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-top')){
            this.handleDirection(-25,-10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-bottom')){
            this.handleDirection(-25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-bottom')){
            this.handleDirection(25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-top')){
            this.handleDirection(25,-10,25,10) 
        }
    }
    setupWithShadow(event_in,event_out){
        this.handleCardShadow()
        if(event_in !== 'click'){
            this.card.addEventListener(event_in,()=>{
                this.handleMainAnimation()
            })
            this.card.addEventListener(event_out,(e)=>{
                this.handleRotateBack()
            })
        }else{
                this.card.addEventListener(event_in,(e)=>{
                    if(!this.isClicked){
                        this.handleMainAnimation()
                        setTimeout(() => {
                            this.isClicked = true
                        }, 100);
                    }
                })
                this.card.addEventListener(event_out,(e)=>{
                    if(this.isClicked){
                        this.isClicked = false
                        this.handleRotateBack()
                    }
                })
          
        }
    }
    setupWithPaint(event_in,event_out){
        if(event_in !== 'click'){
            this.card.parentElement.addEventListener(event_in,(e)=>{
                this.handleAnimation()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.handleCardShadow()
                this.isBack = false
            })
            this.card.parentElement.addEventListener(event_out,(e)=>{
                this.isBack = true
                this.handleRotateBackClear()
            })
        }else{
            this.card.parentElement.addEventListener(event_in,(e)=>{
                    if(!this.isClicked){
                        this.isClicked = true
                        this.handleMainAnimation()
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                        this.isBack = false
                        this.handleCardShadow()
                    }
                })
                this.card.parentElement.addEventListener(event_out,(e)=>{
                    if(this.isClicked){
                        this.isBack = true
                        this.isClicked = false
                        this.handleRotateBackClear()
                    }
                })
        }
    }
    handleSetup(event_in,event_out){
        const isShadow  = [...this.card.classList].filter(c => /with-shadow-paint/gi.test(c))
        if(isShadow?.length === 0){
            this.setupWithShadow(event_in,event_out)
        }else{
            this.setupWithPaint(event_in,event_out)
        }
    }
}
class Card_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-card'
    connectedCallback() {
        this.handleMakeCard()
        setTimeout(() => {
         this.handleCardWithShadow()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleCardWithShadow(){
        const ThreeD100degRightCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-100deg-right-with-shadow')]
        const ThreeD65degRightCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-65deg-right-with-shadow')]
        const ThreeD100degLeftCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-100deg-left-with-shadow')]
        const ThreeD65degLeftCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-65deg-left-with-shadow')]
       
        const ThreeD100degRightCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-100deg-right-with-shadow-paint')]
        const ThreeD65degRightCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-65deg-right-with-shadow-paint')]
        const ThreeD100degLeftCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-100deg-left-with-shadow-paint')]
        const ThreeD65degLeftCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-65deg-left-with-shadow-paint')]
        // need to move to controller
        if(ThreeD100degRightCardsWithShadow){
            ThreeD100degRightCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadow){
            ThreeD65degRightCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadow){
            ThreeD100degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadow){
            ThreeD65degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degRightCardsWithShadowPaint){
            ThreeD100degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadowPaint){
            ThreeD65degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadowPaint){
            ThreeD100degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadowPaint){
            ThreeD65degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
    
    }
     handleMakeCard(){
        const card = document.createElement('div')
        card.classList.add('card')
        const hover = this.getAttribute('hover')
        if(hover){
            card.classList.add(`card__hover--${hover}`)
        }
        const hover3D = this.getAttribute('hover-3d')
        const hover3D_Direction = this.getAttribute('direction')
        if(hover3D && hover3D_Direction){
            card.classList.add(`card__hover--3d-${hover3D}-${hover3D_Direction}-with-shadow`)
        }else if(hover3D){
            alert('You need to specity hover direction')
        }
        const hover3D_with_paint = this.getAttribute('hover-3d-paint')
        if(hover3D_with_paint){
            card.classList.add(`card__hover--3d-${hover3D_with_paint}-${hover3D_Direction}-with-shadow-paint`)
        }else if(hover3D_with_paint){
            alert('You need to specity hover direction')
        }
        const isBordered = this.getAttribute('isBordered')
        if(isBordered){
            card.classList.add('card__bordered-inside')
        }
        this.candy_utils.handlePassId(this,card)
        this.candy_utils.handlePassClass(this,card)
        this.candy_utils.handleSetAttributes(this,card)
        card.innerHTML = ''
        
        const header = this.querySelector('ui-card-header')
        const header_div = document.createElement('div')
        if(header){
            header_div.classList.add('card__header')
            this.candy_utils.handlePassId(header,header_div)
            this.candy_utils.handlePassClass(header,header_div)
            this.candy_utils.handleSetAttributes(header,header_div)
            header_div.innerHTML = header.innerHTML
            header.remove()
           
        }
          
        const body = this.querySelector('ui-card-body')
        const body_div = document.createElement('div')
        const button = this.querySelector('ui-card-button')
        const button_div = document.createElement('button')
        
        if(body){
            body_div.classList.add('card__body')
            this.candy_utils.handlePassId(body,body_div)
            this.candy_utils.handlePassClass(body,body_div)
            this.candy_utils.handleSetAttributes(body,body_div)
            body_div.innerHTML = body.innerHTML
            body.remove()
        }
        if(button){
            button_div.classList.add('card__button')
            this.candy_utils.handlePassId(button,button_div)
            this.candy_utils.handlePassClass(button,button_div)
            this.candy_utils.handleSetAttributes(button,button_div)
            button_div.innerHTML = button.innerHTML
            button.remove()
        }
          
        const footer = this.querySelector('ui-card-footer')
        const footer_div = document.createElement('div')
        if(footer){
            footer_div.classList.add('card__footer')
            this.candy_utils.handlePassId(footer,footer_div)
            this.candy_utils.handlePassClass(footer,footer_div)
            this.candy_utils.handleSetAttributes(footer,footer_div)
            footer_div.innerHTML = footer.innerHTML
            footer.remove()
        }
        
        if(header){
            card.appendChild(header_div)
        }
        if(button){
            body_div.appendChild(button_div)
        }
        if(body){
            card.appendChild(body_div)
        }
        if(footer){
            card.appendChild(footer_div)
        }
        
        this.innerHTML = ''
        this.innerHTML = card.outerHTML
     }
}
window.customElements.define(Card_Component.component_name,Card_Component)