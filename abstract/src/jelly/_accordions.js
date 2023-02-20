class Accordion{
    constructor(){
        this.headings = document.querySelectorAll('.accordion__heading')
    }
    handleAccordions(h){
        const handleAccordion = () =>{
            const animationIn = framework.utils.handleTransitionIn(h)
            const animationOut = framework.utils.handleTransitionOut(h)
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
                        },framework.globalSetup.animationTime);
                        body.style.animation = 'none'
                        body.style.animation = animationOut                    
                    }
            }
        }
        h.addEventListener('click',handleAccordion)
    }
    handleSetup(){
        this.headings.forEach(h => this.handleAccordions(h))
    }
}