class Step {
    constructor(){
        this.elements = document.querySelectorAll('.step')
    }
    handleZindex(){
        this.elements.forEach(el => {
            const step_items = el.querySelectorAll('div')
            const step_items_left = el.querySelectorAll('.step__left')
            let z_index = 8999
            step_items.forEach(i => {
                i.style.zIndex = z_index
                z_index--
            })
            z_index = 9999
            step_items_left.forEach(item => {
                item.style.zIndex = z_index
                z_index--
            })
        })
    }
    handleSetup(){
        this.handleZindex()
    }
}
window.customElements.define(Loader_Component.component_name,Loader_Component)
class Step_Right_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-right'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__right')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Right_Sub_Component.component_name,Step_Right_Sub_Component)
class Step_Left_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-left'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__left')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Left_Sub_Component.component_name,Step_Left_Sub_Component)
class Step_Content_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-content'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__content')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Content_Sub_Component.component_name,Step_Content_Sub_Component)
class Step_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(step)
     }
}
window.customElements.define(Step_Component.component_name,Step_Component)