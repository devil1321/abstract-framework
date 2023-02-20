class Tooltip{
    constructor(){
        this.elements = document.querySelectorAll('.tooltip')
    }
    handleSetup(){
        this.elements.forEach(el =>{
            const child = document.querySelector('[class^="tooltip__content"]')
            // const header = document.querySelector('[class^="tooltip__header"]')
            if(child.classList.contains('tooltip__content-left')){
                child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                child.style.left = el.offsetLeft - child.clientWidth - 100 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                        child.style.left = el.offsetLeft - child.clientWidth - 10 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.left = el.offsetLeft - child.clientWidth - 100 + 'px'
                    }
                })
            }
            if(child.classList.contains('tooltip__content-right')){
                child.style.left = el.offsetLeft + el.clientWidth + 100 + 'px'
                child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.left = el.offsetLeft + el.clientWidth  + 10 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.left = el.offsetLeft + el.clientWidth + 100 + 'px'
                    }
                })
            }
            if(child.classList.contains('tooltip__content-top')){
                child.style.top = el.offsetTop - 200 + 'px'
                child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop - child.clientHeight - 10 + 'px'

                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.top = el.offsetTop - 200 + 'px'

                    }
                })
            }
            if(child.classList.contains('tooltip__content-bottom')){
                child.style.top = el.offsetTop + el.clientHeight + 100 + 'px'
                child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight + 10 + 'px'
                        child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight + 100 + 'px'
                    }
                })
            }
        })
    }
}
class Tooltip_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.tooltip = new Tooltip()
    }
    static component_name = 'ui-tooltip'
    connectedCallback() {
        this.handleMakeTooltip()
        setTimeout(() => {
         this.tooltip = new Tooltip()
         this.tooltip.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeTooltip(){
        const tooltip = document.createElement('div')
        tooltip.classList.add('tooltip')  
        this.candy_utils.handlePassId(this,tooltip)
        this.candy_utils.handlePassClass(this,tooltip)
        this.candy_utils.handleSetAttributes(this,tooltip)
        
        const tooltip_target = this.querySelector('ui-tooltip-target')
        const tooltip_target_div = document.createElement('div')

        if(tooltip_target){
            this.candy_utils.handlePassId(tooltip_target,tooltip_target_div)
            this.candy_utils.handlePassClass(tooltip_target,tooltip_target_div)
            this.candy_utils.handleSetAttributes(tooltip_target,tooltip_target_div)
            tooltip_target_div.innerHTML = tooltip_target.innerHTML
            tooltip_target.remove()
            tooltip.appendChild(tooltip_target_div)
        }

        const tooltip_content = this.querySelector('ui-tooltip-content')
        const tooltip_content_div = document.createElement('div')
        const tooltip_direction = this.getAttribute('direction')

        if(tooltip_content){
            if(tooltip_direction){
                tooltip_content_div.classList.add(`tooltip__content-${tooltip_direction}`)
            }else{
                tooltip_content_div.classList.add('tooltip__content-top')
            }
            this.candy_utils.handlePassId(tooltip_content,tooltip_content_div)
            this.candy_utils.handlePassClass(tooltip_content,tooltip_content_div)
            this.candy_utils.handleSetAttributes(tooltip_content,tooltip_content_div)
        }

        const tooltip_header = this.querySelector('ui-tooltip-header')
        const tooltip_header_div = document.createElement('div')
        if(tooltip_header){
            tooltip_header_div.classList.add('tooltip__header')
            tooltip_header_div.innerHTML = tooltip_header.innerHTML
            this.candy_utils.handlePassId(tooltip_header,tooltip_header_div)
            this.candy_utils.handlePassClass(tooltip_header,tooltip_header_div)
            this.candy_utils.handleSetAttributes(tooltip_header,tooltip_header_div)
            tooltip_content_div.appendChild(tooltip_header_div)
        }

        const tooltip_text = this.querySelector('ui-tooltip-text')
        const tooltip_text_div = document.createElement('div')
        if(tooltip_text){
            tooltip_text_div.classList.add('tooltip__text')
            tooltip_text_div.innerHTML = tooltip_text.innerHTML
            this.candy_utils.handlePassId(tooltip_text,tooltip_text_div)
            this.candy_utils.handlePassClass(tooltip_text,tooltip_text_div)
            this.candy_utils.handleSetAttributes(tooltip_text,tooltip_text_div)
            tooltip_content_div.appendChild(tooltip_text_div)
        }

        if(tooltip_content){
            tooltip.appendChild(tooltip_content_div)
        }
        this.innerHTML = ''
        this.appendChild(tooltip)
     }
}
window.customElements.define(Tooltip_Component.component_name,Tooltip_Component)