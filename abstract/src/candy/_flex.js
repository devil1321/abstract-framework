class Flex_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-flex'
    connectedCallback() {
        this.handleMakeFlex()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeFlex(){
        const flex = document.createElement('div')
        flex.classList.add('flex')

        const flex_attr = this.getAttribute('flex')

        if(flex_attr){
            flex.classList.add(`flex__${flex_attr}`)
        }
        const flex_wrap_attr = this.getAttribute('flex-wrap')

        if(flex_wrap_attr){
            flex.classList.add(`flex__wrap-${flex_wrap_attr}`)
        }
        const jusitfy_attr = this.getAttribute('justify')

        if(jusitfy_attr){
            flex.classList.add(`justify__flex-${jusitfy_attr}`)
        }
        const align_attr = this.getAttribute('align')

        if(align_attr){
            flex.classList.add(`align-items__flex-${align_attr}`)
        }

        flex.innerHTML = this.innerHTML

        this.innerHTML = ''
        this.appendChild(flex)
        
     }
}
window.customElements.define(Flex_Component.component_name,Flex_Component)
