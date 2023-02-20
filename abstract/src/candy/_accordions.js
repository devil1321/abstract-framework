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
class Accordion_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.accordion = undefined
    }
    static component_name = 'ui-accordion'
    connectedCallback() {
       this.handleMakeAccordion()
       setTimeout(() => {
        this.accordion = new Accordion()
        this.accordion.handleSetup()
     }, 100);
    }
    disconnectedCallback() {

    }
    attributeChangedCallback(name, oldValue, newValue) {
     
    }
    adoptedCallback() {
    }
    handleMakeAccordion(){
        const accordion = document.createElement('div')
        const accordion_transtion_in = this.candy_utils.handleGetTransitionIn(this)
        const accordion_transtion_out = this.candy_utils.handleGetTransitionOut(this)
        accordion.classList.add('accordion')
        this.candy_utils.handlePassClass(this,accordion)
        this.candy_utils.handlePassId(this,accordion)
        this.candy_utils.handleSetAttributes(this,accordion)

        const accordion_heading = this.querySelector('ui-accordion-heading')
        const accordion_heading_div = document.createElement('div')
        if(accordion_heading){
            accordion_heading_div.classList.add('accordion__heading')
            accordion_heading_div.setAttribute('data-transition_in',accordion_transtion_in)
            accordion_heading_div.setAttribute('data-transition_out',accordion_transtion_out)
            accordion_heading_div.innerHTML = accordion_heading.innerHTML
            this.candy_utils.handlePassClass(accordion_heading,accordion_heading_div)
            this.candy_utils.handlePassId(accordion_heading,accordion_heading_div)
            this.candy_utils.handleSetAttributes(accordion_heading,accordion_heading_div)
            accordion_heading.outerHTML = accordion_heading_div.outerHTML 
        }

        const accordion_body = this.querySelector('ui-accordion-body')
        const accordion_body_div = document.createElement('div')
        const accordion_body_wrapper_div = document.createElement('div')
        if(accordion_body){
            const accordion_transtion_control = this.candy_utils.handleGetTransitionControl(this)
            const accordion_body_isVisible = accordion_body.getAttribute('isVisible')
            accordion_body_wrapper_div.classList.add('accordion__body')
            accordion_body_wrapper_div.classList.add(accordion_body_isVisible)
            accordion_body_wrapper_div.classList.add(accordion_transtion_control)
            if(accordion_body_isVisible){
                accordion_heading_div.classList.add('accordion__open')
            }
            accordion_body_div.innerHTML = accordion_body.innerHTML
            this.candy_utils.handlePassId(accordion_body,accordion_body_div)
            this.candy_utils.handlePassClass(accordion_body,accordion_body_div)
            this.candy_utils.handleSetAttributes(accordion_body,accordion_body_div)
            accordion_body.outerHTML = accordion_body_wrapper_div.outerHTML
        }
            
        const accordion_footer = this.querySelector('ui-accordion-footer')
        const accordion_footer_div = document.createElement('div')
        if(accordion_footer){
            accordion_footer_div.classList.add('accordion__footer')
            accordion_footer_div.innerHTML = accordion_footer.innerHTML
            this.candy_utils.handlePassId(accordion_footer,accordion_footer_div)
            this.candy_utils.handlePassClass(accordion_footer,accordion_footer_div)
            this.candy_utils.handleSetAttributes(accordion_footer,accordion_footer_div)
            accordion_footer.outerHTML = accordion_footer_div.outerHTML
        }
            
        this.innerHTML = ''
        if(accordion_heading){
            accordion.appendChild(accordion_heading)
        }
        if(accordion_body){
            accordion.appendChild(accordion_body)
        }
        if(accordion_footer){
            accordion.appendChild(accordion_footer)
        }
        this.appendChild(accordion)

    }
}
window.customElements.define(Accordion_Component.component_name,Accordion_Component)