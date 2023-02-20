class Carousel{
    constructor(){
        this.moveX = 0 
        this.moveY = 0
        this.count = 1
        this.prevCount = 1
        this.isPlay = false
        this.elements = document.querySelectorAll('.carousel')
        this.items = []
        this.headings = [[],[],[]]
        this.texts = [[],[],[]]
        this.footers = [[],[],[]]
        this.srcs = []
    }
    handleSetButtons(){
        this.elements.forEach(el =>{
            const isButtons  = [...el.classList].filter(c => /carousel__buttons/gi.test(c))
            if(isButtons.length > 0){
                const wrapper = document.createElement('div')
                wrapper.classList.add('carousel__controls')
                const chevron_prev = document.createElement('div')
                chevron_prev.classList.add('carousel__chevron')
                const chevron_next = document.createElement('div')
                chevron_next.classList.add('carousel__chevron')
                const prev = document.createElement('div')
                prev.classList.add('carousel__prev')
                prev.appendChild(chevron_prev)
                wrapper.appendChild(prev)
                const next = document.createElement('div')
                next.classList.add('carousel__next')
                next.appendChild(chevron_next)
                wrapper.appendChild(next)
                el.appendChild(wrapper)
            }
        })
    }
    handleSetPins(){
        this.elements.forEach(el =>{
            const isPins  = [...el.classList].filter(c => /carousel__pins/gi.test(c))
            if(isPins.length > 0){
                const view  = el.querySelector('.carousel__view')
                let items = [...view.querySelectorAll('.carousel__item')]
                const last = items[0].cloneNode(true)
                const first = items[items.length - 1].cloneNode(true)
                items.push(last)
                items.unshift(first)
                view.innerHTML = ''
                items.forEach(i => {
                    view.append(i)
                })
                const wrapper = document.createElement('div')
                wrapper.classList.add('carousel__dots')
                items.forEach(i => {
                    const dot = document.createElement('div')
                    dot.classList.add('carousel__dot')
                    wrapper.appendChild(dot)
                })
                el.appendChild(wrapper)
                const dots = [...document.querySelectorAll('.carousel__dot')]
                if(dots.length > 0){
                    dots[1].classList.add('carousel__dot--active')
                }
                dots.forEach((d,i) => d.addEventListener('click',()=>{this.handlePinEffect(el,i)}))
            }
        })
    }
    handleActivePin(){
        const dots = document.querySelectorAll('.carousel__dot')
        dots.forEach(d => d.classList.remove('carousel__dot--active'))
        dots[this.count].classList.add('carousel__dot--active')

    }
    handlePinEffect(el,index){
        const view = el.querySelector('.carousel__view')
        const items = view.querySelectorAll('.carousel__item')
        const isMerge = [el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
        const isFade = [el.classList].filter(c => /carousel__fade/.test(c)).length > 0 ? true : false
        const isTextEffect = [el.classList].filter(c => /carousel__with-text-effect/.test(c)).length > 0 ? true : false
        let direction = 'prev'
        this.count = index 
        if(this.count > this.prevCount){
            direction = 'next'
        }else{
            direction = 'prev'
        }
        this.prevCount = index 
        if(isMerge){
            if(items[2]){
                items[2].style.transition = 'all 1s ease-in-out'
                items[2].style.backgroundSize = 'cover'
                items[2].style.backgroundImage = `url(${this.srcs[index+1]})`
            }
            const nextHeadings = items[this.count+1].querySelectorAll('.carousel__item-heading > *')
            const nextTexts = items[this.count+1].querySelectorAll('.carousel__item-text > *')
            const nextFooters = items[this.count+1].querySelectorAll('.carousel__item-footer > *')
            if(this.count !== 1){
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[this.count - 1] = [...tempHeadings]
                this.texts[this.count - 1] = [...tempTexts]
                this.footers[this.count - 1] = [...tempFooters]
            }
            const heading = items[2].querySelector('.carousel__item-heading')
            const text = items[2].querySelector('.carousel__item-text')
            const footer = items[2].querySelector('.carousel__item-footer')
            if(heading){
                heading.innerHTML = ''
            }
            if(text){
                text.innerHTML = ''
            }
            if(footer){
                footer.innerHTML = ''
            }
                this.headings[index-1].forEach(h =>{
                    const el = document.createElement(`${h.tag}`)
                    el.textContent = h.text
                    heading.appendChild(el)
                })
                this.texts[index-1].forEach(t =>{
                    const el = document.createElement(`${t.tag}`)
                    el.textContent = t.text
                    text.appendChild(el)
                })
                this.footers[index-1].forEach(f =>{
                    const el = document.createElement(`${f.tag}`)
                    el.textContent = f.text
                    footer.appendChild(el)
                })
        } else {
            this.moveX = items[index + 1].offsetLeft 
            if(view){
                view.style.transition = 'all 1s ease-in-out'
            }
            if(!isFade){
                if(view){
                    view.style.transform = `translateX(-${this.moveX}px)`
                }
            }else{
                if(view){
                    view.style.opacity = 0
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        view.style.transform = `translateX(-${this.moveX}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            },200);
                        }
                    }, 1000);
                }
            }
        }
        if(isTextEffect && isMerge | isFade){
            this.handleCarouselTextEffectIn(direction,isMerge,isFade)
        }else if(isMerge){
           const body = items[2].querySelector('.carousel__item-body')
           if(body){
               body.style.opacity = 0
               body.style.transition = 'all 0s ease-in-out'
               setTimeout(() => {
                   body.style.transition = 'all 1s ease-in-out'
                   body.style.opacity = 1
                }, 1000);
            }
        }else if(isFade){
            const body = items[this.count+1].querySelector('.carousel__item-body')
            if(body){
                body.style.opacity = 0
                body.style.transition = 'all 0s ease-in-out'
                setTimeout(() => {
                    body.style.transition = 'all 1s ease-in-out'
                    body.style.opacity = 1
                }, 2000);
            }
        }
    }
    handleCarouselTextEffectIn(direction,isMerge,isFade){
        let nextHeading =  this.items[2].querySelector('.carousel__item-heading')
        let nextText = this.items[2].querySelector('.carousel__item-text')
        let nextFooter = this.items[2].querySelector('.carousel__item-footer')
        let prevHeading = this.items[2].querySelector('.carousel__item-heading')
        let prevText = this.items[2].querySelector('.carousel__item-text')
        let prevFooter = this.items[2].querySelector('.carousel__item-footer')

        if(!isMerge){
            if(this.count === 1 && direction === 'prev'){
                if(!isMerge){
                    nextHeading = this.items[2].querySelector('.carousel__item-heading')
                    nextText = this.items[2].querySelector('.carousel__item-text')
                    nextFooter = this.items[2].querySelector('.carousel__item-footer')
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                }
            
                if(prevHeading){
                    prevHeading.style.transition = 'all 1s ease-in-out'
                    prevHeading.style.transform = 'translateX(1200px)'
                }
                if(prevText){

                    prevText.style.transition = 'all 1s ease-in-out'
                    prevText.style.transform = 'translateX(-500px)'
                }
                if(prevFooter){

                    prevFooter.style.transition = 'all 1s ease-in-out'
                    setTimeout(() => {
                        prevFooter.style.transform = 'translateX(-500px)'
                    }, 200);
                }
                const handleEffectOnePrev = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        nextFooter.style.transform =  'translateY(0px)'
                    }
                }
                if(!isFade){
                    setTimeout(() => {
                        handleEffectOnePrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectOnePrev()
                    }, 1000);
                }
            }
            if(this.count === 1 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[2].querySelector('.carousel__item-heading')
                    nextText = this.items[2].querySelector('.carousel__item-text')
                    nextFooter = this.items[2].querySelector('.carousel__item-footer')
                    prevHeading = this.items[4].querySelector('.carousel__item-heading')
                    prevText = this.items[4].querySelector('.carousel__item-text')
                    prevFooter = this.items[4].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.opacity = 0
                    nextHeading.style.transform = 'translateY(-100px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.opacity = 0
                    nextText.style.transform = 'translateX(400px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.opacity = 0
                    nextFooter.style.transform = 'translateY(200px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-400px)'
                    prevFooter.style.opacity = 0
                }

                const handleEffectOneNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1.5s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform  = 'translateY(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1.8s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1.8s ease-in-out'
                        setTimeout(() => {
                            nextFooter.style.opacity = 1
                            nextFooter.style.transform =  'translateY(0px)'
                        }, 200);
                    }
                }
                if(!isFade){
                    setTimeout(() => {
                        handleEffectOneNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectOneNext()
                    }, 1000);
                }
            }
            if(this.count % 2 === 0 && direction === 'prev'){
                if(!isMerge){
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                }

                if(prevHeading){
                    prevHeading.style.transition = 'all 0s ease-in-out'
                    prevHeading.style.transform = 'translateY(200px)'
                }
                if(prevText){
                    prevText.style.transition = 'all 0s ease-in-out'
                    prevText.style.transform = 'translateX(500px)'
                }
                if(prevFooter){
                    prevFooter.style.transition = 'all 0s ease-in-out'
                    prevFooter.style.transform = 'translateY(-500px)'
                }

                if(nextHeading){
                    nextHeading.style.transform = 'translateX(200px)'
                    nextHeading.style.opacity = 0
                }
                if(nextText){
                    nextText.style.transform = 'translateX(-400px)'
                    nextText.style.opacity = 0
                }
                if(nextFooter){
                    nextFooter.style.transform = 'translateX(400px)'
                    nextFooter.style.opacity = 0
                }

                const handleEffectTwoPrev = () =>{
                    if(prevHeading){
                        prevHeading.style.transition = 'all 1s ease-in-out'
                        prevHeading.style.opacity = 1
                        prevHeading.style.transform = 'translateY(0px)'
                    }
                    if(prevText){
                        prevText.style.transition = 'all 1s ease-in-out'
                        prevText.style.opacity = 1
                        prevText.style.transform = 'translateX(0px)'
                    }
                    if(prevFooter){
                        prevFooter.style.transition = 'all 1s ease-in-out'
                        prevFooter.style.opacity = 1
                        prevFooter.style.transform =  'translateY(0px)'
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectTwoPrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectTwoPrev()
                    }, 1000);
                }
            }
            if(this.count % 2 === 0 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[3].querySelector('.carousel__item-heading')
                    nextText = this.items[3].querySelector('.carousel__item-text')
                    nextFooter = this.items[3].querySelector('.carousel__item-footer')
                    prevHeading = this.items[2].querySelector('.carousel__item-heading')
                    prevText = this.items[2].querySelector('.carousel__item-text')
                    prevFooter = this.items[2].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateX(1200px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(-500px)'
                }
                if(nextFooter){    
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateY(500px)'
                }
                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(-400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateY(400px)'
                    prevFooter.style.opacity = 0
                }
                const handleEffectTwoNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        nextFooter.style.transform =  'translateY(0px)'
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectTwoNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectTwoNext()
                    }, 1000);
                }
            }
            if(this.count % 3 === 0 && direction === 'prev'){
                if(!isMerge){
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                    prevHeading = this.items[2].querySelector('.carousel__item-heading')
                    prevText = this.items[2].querySelector('.carousel__item-text')
                    prevFooter = this.items[2].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateX(-500px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(500px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(-500px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-400px)'
                    prevFooter.style.opacity = 0
                }


                const handleEffectThreePrev = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1.5s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1.5s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1.5s ease-in-out'
                        nextFooter.style.opacity = 1
                        setTimeout(() => {
                            nextFooter.style.transform =  'translateX(0px)'
                        }, 200);
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectThreePrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectThreePrev()
                    }, 1000);
                }
            }
            if(this.count % 3 === 0 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(-400px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(500px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(500px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(800px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(-400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-800px)'
                    prevFooter.style.opacity = 0
                }

                const handleEffectThreeNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateY(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        setTimeout(() => {
                            nextFooter.style.transform =  'translateX(0px)'
                        }, 200);
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectThreeNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectThreeNext()
                    }, 1000);
                }
            }
        }else{
            if(this.count === 1 && direction==='prev'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateY(-500px)'
                    }
                    if(nextText){

                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.opacity = 0
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.transform = 'translateX(500px)'
                    }
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(-500px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        if(nextFooter){

                            nextFooter.style.opacity = 1
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(0px)'
                        }
                    }, 100);
                }, 1000);
            }
            if(this.count === 1 && direction==='next'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextText){

                            nextText.style.opacity = 0
                            nextText.style.transition = 'all 1s ease-in-out'
                            nextText.style.transform = 'translateX(500px)'
                        }
                    }, 200);
                    setTimeout(() => {
                        if(nextFooter){

                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(500px)'
                        }
                    }, 400);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(800px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(800px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(-800px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                        setTimeout(() => {
                            if(nextFooter){

                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1600);
            }
            if(this.count % 2 === 0 && direction==='prev'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'    
                        nextHeading.style.transform = 'translateX(800px)'
                    }
                    if(nextText){
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(800px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(400px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(800px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){

                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
            if(this.count % 2 === 0 && direction==='next'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translatY(800px)'
                    }
                    if(nextText){

                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(-500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.opacity = 0
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.transform = 'translateY(-800px)'
                    }
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(-400px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(-400px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(-400px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1400);
            }
            if(this.count % 3 === 0 && direction==='prev'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateX(800px)'
                    }
                    if(nextText){
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateY(-500px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateY(800px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(400px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateY(800px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){
                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateY(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
            if(this.count % 3 === 0 && direction==='next'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateY(-400px)'
                    }
                    if(nextText){    
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateY(-800px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateY(-1200px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(400px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(-800px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){
                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
        }
    }
    handleCarouselEffect(el,direction,isVertical){
        const view  = el.querySelector('.carousel__view')
        const isFade = [...el.classList].filter(c => /carousel__fade/.test(c)).length > 0 ? true : false
        const isMerge = [...el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
        const isSlide = [...el.classList].filter(c => /carousel__slide/.test(c)).length > 0 ? true : false
        const isTextEffect = [...el.classList].filter(c => /carousel__with-text-effect/.test(c)).length > 0 ? true : false
        let items = [...view.querySelectorAll('.carousel__item')]

        let maxLengthX = 0
        let maxLengthY = 0
        let stepX = 0
        let stepY = 0

        items.forEach(el => maxLengthX += el.clientWidth)
        items.forEach(el => maxLengthY += el.clientHeight)
        if(items.length > 0){
            stepX = items[0].clientWidth
            stepY = items[0].clientHeight
        }
        if(!isMerge){
            if(direction ==='prev' && !isVertical){
                this.moveX += stepX
                if(this.moveX >= -stepX){
                    this.count = items.length - 4
                    if(view){
                        view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                        }
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            this.moveX = -maxLengthX + stepX * 3 
                            view.style.transform = `translateX(${this.moveX}px)`
                            if(isFade){
                                setTimeout(() => {
                                    view.style.transition = 'all 1s ease-in-out'
                                    view.style.opacity = 1
                                },200);
                            }
                        }, 1000);
                    }
                }else{
                    this.count -= 1
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                            setTimeout(() => {
                                view.style.transition = 'all 0s ease-in-out'
                                view.style.transform = `translateX(${this.moveX}px)`
                                if(isFade){
                                    setTimeout(() => {
                                        view.style.transition = 'all 1s ease-in-out'
                                        view.style.opacity = 1
                                    },200);
                                }
                            }, 1000);
                        }
                    }
                }
            }
            if(direction ==='next' && !isVertical){
                this.moveX -= stepX
                if(this.moveX < -maxLengthX + stepX * 3){
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                        }
                        this.count = 1
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            this.moveX = -stepX * 2
                            view.style.transform = `translateX(${this.moveX}px)`
                            if(isFade){
                                setTimeout(() => {
                                    view.style.transition = 'all 1s ease-in-out'
                                    view.style.opacity = 1
                                },200);
                            }
                        }, 1000);
                    }
                }else{
                    this.count += 1
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                            setTimeout(() => {
                                view.style.transition = 'all 0s ease-in-out'
                                view.style.transform = `translateX(${this.moveX}px)`
                                if(isFade){
                                    setTimeout(() => {
                                        view.style.transition = 'all 1s ease-in-out'
                                        view.style.opacity = 1
                                    },200);
                                }
                            }, 1000);
                        }
                    }
                }
            }
            if(direction ==='prev' && isVertical){
            this.moveY += stepY
            if(this.moveY >= -stepY){
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    this.count = items.length - 4
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                    }
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        this.moveY = -maxLengthY + stepY * 3
                        view.style.transform = `translateY(${this.moveY}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }
                    }, 1000);
                }
            }else{
                this.count -= 1
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            view.style.transform = `translateY(${this.moveY}px)`
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }, 1000);
                    }
                }
            }
            }
            if(direction ==='next' && isVertical){
            this.moveY -= stepY
            if(this.moveY < -maxLengthY + stepY * 3){
                if(view){

                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                    }
                    this.count = 1
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        this.moveY = -stepY * 2
                        view.style.transform = `translateY(${this.moveY}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }else{
                            
                        }
                    }, 1000);
                }
            }else{
                this.count += 1
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            view.style.transform = `translateY(${this.moveY}px)`
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }, 1000);
                    }
                }
            }
            }
        }else{
            const item = items[2]
            item.style.transition = 'all 1s ease-in-out'
            item.style.backgroundSize = 'cover'
            if(direction ==='prev' && !isVertical){
                this.moveX += stepX
                if(item){
                    if(this.moveX >= -stepX){
                        this.count = items.length - 4
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                        setTimeout(() => {
                            this.moveX = -maxLengthX + stepX * 3 
                        },1000)
                    }else{
                        this.count -= 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }    
                }
            }
            if(direction ==='next' && !isVertical){
                this.moveX -= stepX
                if(item){
                    if(this.moveX < -maxLengthX + stepX * 3){
                        item.style.backgroundImage = `url(${this.srcs[this.count-1]})`
                        this.count = 1
                        setTimeout(() => {
                            this.moveX = -stepX * 2
                        }, 1000);
                    }else{
                        this.count += 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            if(direction ==='prev' && isVertical){
                this.moveY += stepY
                if(item){
                    if(this.moveY >= -stepY){
                        this.count = items.length - 4
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    setTimeout(() => {
                        this.moveY = -maxLengthY + stepY * 3
                    }, 1000);
                }else{
                        this.count -= 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            if(direction ==='next' && isVertical){
                this.moveY -= stepY
                if(item){
                    if(this.moveY < -maxLengthY + stepY * 3){
                        this.count = 1
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    setTimeout(() => {
                        this.moveY = -stepY * 2
                    }, 1000);
                }else{
                    this.count += 1
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            let body = item.querySelector('.carousel__item-body')
            let heading = item.querySelector('.carousel__item-heading')
            let text = item.querySelector('.carousel__item-text')
            let footer = item.querySelector('.carousel__item-footer')
            if(!body){
                body = document.createElement('div')
                body.classList.add('carousel__item-body')
                item.appendChild(body)
            }
            if(!heading){
                heading = document.createElement('div')
                heading.classList.add('carousel__item-heading')
                body.appendChild(heading)
            }
            if(!text){
                text = document.createElement('div')
                text.classList.add('carousel__item-text')
                body.appendChild(text)
            }
            if(!footer){
                footer = document.createElement('div')
                footer.classList.add('carousel__item-footer')
                body.appendChild(footer)
            }
            const nextHeadings = items[this.count+1].querySelectorAll('.carousel__item-heading > *')
            const nextTexts = items[this.count+1].querySelectorAll('.carousel__item-text > *')
            const nextFooters = items[this.count+1].querySelectorAll('.carousel__item-footer > *')
            if(this.count !== 1){
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[this.count - 1] = [...tempHeadings]
                this.texts[this.count - 1] = [...tempTexts]
                this.footers[this.count - 1] = [...tempFooters]
            }
            if(heading){
                heading.innerHTML = ''
                this.headings[this.count-1].forEach(h =>{
                    const el = document.createElement(`${h.tag}`)
                    el.textContent = h.text
                    heading.appendChild(el)
                })
            }
            if(text){
                text.innerHTML = ''
                this.texts[this.count-1].forEach(t =>{
                    const el = document.createElement(`${t.tag}`)
                    el.textContent = t.text
                    text.appendChild(el)
                })
            }
            if(footer){
                footer.innerHTML = ''
                this.footers[this.count-1].forEach(f =>{
                    const el = document.createElement(`${f.tag}`)
                    el.textContent = f.text
                    footer.appendChild(el)
                })
            }
        }

        const setTimeoutTime = (isFade) =>{
            if(isFade){
                return 2000
            }else{
                return 1000
            }
        }

        if(isTextEffect && isMerge | isFade | isSlide){
            this.handleCarouselTextEffectIn(direction,isMerge,isFade)
        }else if(isMerge){
           const body = items[2].querySelector('.carousel__item-body')
           if(body){
               body.style.opacity = 0
               body.style.transition = 'all 0s ease-in-out'
               setTimeout(() => {
                   body.style.transition = 'all 1s ease-in-out'
                   body.style.opacity = 1
                }, 1000);
            }
        }else if(isFade | isSlide){
            const body = items[this.count+1].querySelector('.carousel__item-body')
            if(body){
                body.style.opacity = 0
                body.style.transition = 'all 0s ease-in-out'
                setTimeout(() => {
                    const heading = body.querySelector('.carousel__item-heading')
                    const text = body.querySelector('.carousel__item-text')
                    const footer = body.querySelector('.carousel__item-footer')
                    if(heading){
                        heading.style.opacity = 1
                    }
                    if(text){
                        text.style.opacity = 1
                    }
                    if(footer){
                        footer.style.opacity = 1
                    }
                    body.style.transition = 'all 1s ease-in-out'
                    body.style.opacity = 1
                }, setTimeoutTime(isFade));
            }
        }
        this.handleActivePin()
    }
    handleCarousel(){
        this.elements.forEach(el =>{
            const prev = el.querySelector('.carousel__prev')
            const next = el.querySelector('.carousel__next')
            const view  = el.querySelector('.carousel__view')
            const isMerge = [...el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
            const first_heading = view.querySelectorAll('.carousel__item-heading')
            const first_text = view.querySelectorAll('.carousel__item-text')
            const first_footer = view.querySelectorAll('.carousel__item-footer')
            if(first_heading){
                first_heading[1].style.opacity = 1
            }
            if(first_text){
                first_text[1].style.opacity = 1
            }
            if(first_footer){
                first_footer[1].style.opacity = 1
            }
            let items = [...view.querySelectorAll('.carousel__item')]
            const last = items[0].cloneNode(true)
            const first = items[items.length - 1].cloneNode(true)
            let stepX
            let stepY
            items.push(last)
            items.unshift(first)
            view.innerHTML = ''
            items.forEach(i => {
                if(view){
                    view.append(i)
                }
            })
            this.items = items
            const isVertical  = [...el.classList].filter(c => /carousel__vertical/gi.test(c))
            if(items.length > 0 && isVertical.length === 0){
                stepX = items[0].clientWidth
                this.moveX -= stepX * 2
                if(view){
                    view.style.transition = 'all 0s ease-in-out'
                    view.style.transform = `translateX(${this.moveX}px)`
                }
            }else if(items.length > 0 && isVertical.length > 0){
                stepY = items[0].clientHeight
                this.moveY -= stepY * 2
                if(view){
                    view.style.transition = 'all 0s ease-in-out'
                    view.style.transform = `translateY(${this.moveY}px)`
                }
            }
            if(isMerge){
                const first_heading = view.querySelectorAll('.carousel__item-heading')
                const first_text = view.querySelectorAll('.carousel__item-text')
                const first_footer = view.querySelectorAll('.carousel__item-footer')
                if(first_heading){
                    first_heading[2].style.opacity = 1
                }
                if(first_text){
                    first_text[2].style.opacity = 1
                }
                if(first_footer){
                    first_footer[2].style.opacity = 1
                }
                this.srcs = items.map(i =>{
                    const img = i.querySelector('img')
                    img.style.visibility = 'hidden'
                    const src = img.src
                    return src
                })
                items.forEach(i => {
                    const img = i.querySelector('img')
                    img.style.visibility = 'hidden'
                })
                const image = items[2].querySelector('img')
                items[2].style.backgroundImage = `url(${image.src})`
                items[2].style.backgroundSize = 'cover'
                const nextHeadings = items[2].querySelectorAll('.carousel__item-heading > *')
                const nextTexts = items[2].querySelectorAll('.carousel__item-text > *')
                const nextFooters = items[2].querySelectorAll('.carousel__item-footer > *')
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[0] = [...tempHeadings]
                this.texts[0] = [...tempTexts]
                this.footers[0] = [...tempFooters]
            }
            if(isVertical.length > 0){
                if(prev){

                    prev.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'prev',true)
                        this.isPlay = true
                        setTimeout(() => {
                            this.isPlay = false
                        }, 1000);
                    }
                })
            }
            if(next){

                next.addEventListener('click',(e) => {
                    if(!this.isPlay){
                        this.handleCarouselEffect(el,'next',true)
                        this.isPlay = true
                        setTimeout(() => {
                            this.isPlay = false
                        }, 1000);
                    }
                })
            }
            }else{
                if(prev){

                    prev.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'prev',false)
                            this.isPlay = true
                            setTimeout(() => {
                                this.isPlay = false
                            }, 1000);
                        }
                    })
                }
                if(next){
                    next.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'next',false)
                            this.isPlay = true
                            setTimeout(() => {
                                this.isPlay = false
                            }, 1000);
                        }
                    })
                }
            }
        }) 
    }
    handleSetup(){
        this.handleSetButtons()
        this.handleSetPins()
        this.handleCarousel()
    }
}