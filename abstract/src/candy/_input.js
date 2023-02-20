class Input {
    constructor(){
        this.elements = document.querySelectorAll('[class*="input__field"]')
    }
    handleResetLabel(){
        this.elements.forEach(el => {
            const label = el.querySelector('label')
            const input = el.querySelector('input')
            if(label && input){
                label.style.top = input.clientHeight / 2 - 8  + 'px'
                label.style.left = input.offsetLeft / 2 + 5 + 'px'
            }
        })
    }
    handleLabel(label){
        if(label){
            label.style.top = -15 + 'px'
            label.style.transform = 'scale(0.7)'
            label.style.fontStyle = 'normal'
        }
    }
    handleInput(el,label){
        this.handleResetLabel()
        const isLine = [el.classList].find(c => /input__field-line/.test(c))
        const isNormal = [el.classList].find(c => /input__field-normal/.test(c))
        const isUndersoce = [el.classList].find(c => /input__field-underscore/.test(c))
        if(isNormal){
            this.handleLabel(label)
        }
        if(isLine){
            this.handleLabel(label)
            el.style.borderBottom = `1px solid var(--light-olive)`
        }
        if(isUndersoce){
            this.handleLabel(label)
            const underscores = document.querySelectorAll('.input__underscore-line-effect')
            underscores.forEach(el => el.style.width = '0px')
            const current = el.querySelector('.input__underscore-line-effect')
            if(current){
                current.style.width = '100%'
            }
        }
    }
    handleSetup(){
        this.elements.forEach(el =>{
            const label = el.querySelector('label')
            const input = el.querySelector('input')
            if(label && input){
                label.style.top = input.clientHeight / 2 - 8  + 'px'
                label.style.left = input.offsetLeft / 2 + 5 + 'px'
                input.addEventListener('click',(e)=>this.handleInput(el,label))
            }
        })
    }
}
class Input_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.input = new Input()
    }
    static component_name = 'ui-input'
    connectedCallback() {
        this.handleMakeInput()
        setTimeout(() => {
         this.input = new Input()
         this.input.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeInput(){
        const input = document.createElement('div')

        let label_el
        const input_el = document.createElement('input')
        const placeholder = this.getAttribute('placeholder')
        if(placeholder){
            input_el.setAttribute('placeholder', placeholder)
        }

        const label_attr = this.getAttribute('label')
        if(label_attr){
            label_el = document.createElement('label')
            label_el.innerHTML = label_attr
        }
        const for_attr = this.getAttribute('for')
        if(for_attr){
            label_el.setAttribute('for',for_attr)
        }
        const type = this.getAttribute('type')
        if(type){
            input_el.setAttribute('type',type)
        }
        if(label_el){
            input.appendChild(label_el)
        }
        input.appendChild(input_el)
        const style_type = this.getAttribute('style-type')
        if(style_type){
            if(style_type === 'normal'){
                input.classList.add('input__field-normal')
            }
            else if(style_type === 'line'){
                input.classList.add('input__field-line')
            }
            else if(style_type === 'underscore'){
                input.classList.add('input__field-underscore')
                const underscore_el = document.createElement('div')
                underscore_el.classList.add('input__underscore-line-effect')
                input.appendChild(underscore_el)
            }else{
                input.classList.add('input__field')
            }
        }else{
            input.classList.add('input__field')
        }

        
        this.candy_utils.handlePassId(this,input)
        this.candy_utils.handlePassClass(this,input)
        this.candy_utils.handleSetAttributes(this,input)
        this.innerHTML = ''
        this.appendChild(input)
     }
}
window.customElements.define(Input_Component.component_name,Input_Component)