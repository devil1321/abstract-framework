class Toast{
    constructor(){
        this.elements = document.querySelectorAll('.toast')
    }
    handleSetup(){
        this.elements.forEach(el => {
            const toast_close = el.querySelector('.toast__close')
            toast_close.addEventListener('click', (e)=>{
                const toast = e.target.parentElement.parentElement
                toast.style.opacity = 0
                toast.style.transform = 'translateY(-20px)'
                setTimeout(() => {
                    toast.style.display = 'none'
                }, 1000);
            })
        })
    }
}
class Toast_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.toast = new Toast()
    }
    static component_name = 'ui-toast'
    connectedCallback() {
        this.handleMakeToast()
        setTimeout(() => {
         this.toast = new Toast()
         this.toast.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeToast(){
        const toast = document.createElement('div')
        toast.classList.add('toast')
        this.candy_utils.handlePassId(this,toast)
        this.candy_utils.handlePassClass(this,toast)
        this.candy_utils.handleSetAttributes(this,toast)

        const toast_header = this.querySelector('ui-toast-header')
        const toast_header_div = document.createElement('div')
        if(toast_header){
            toast_header_div.classList.add('toast__header')
            this.candy_utils.handlePassId(toast_header,toast_header_div)
            this.candy_utils.handlePassClass(toast_header,toast_header_div)
            this.candy_utils.handleSetAttributes(toast_header,toast_header_div)
            toast_header_div.innerHTML = toast_header.innerHTML
            const toast_close = this.querySelector('ui-toast-close')
            const toast_close_div = document.createElement('div')
            const toast_close_span_1 = document.createElement('span')
            const toast_close_span_2 = document.createElement('span')
            if(toast_close){
                toast_close_div.classList.add('toast__close')
                toast_close_div.appendChild(toast_close_span_1)
                toast_close_div.appendChild(toast_close_span_2)
                toast_header_div.appendChild(toast_close_div)
            }
            toast.appendChild(toast_header_div)
        }

        const toast_body = this.querySelector('ui-toast-body')
        const toast_body_div = document.createElement('div')
        if(toast_body){
            toast_body_div.classList.add('toast__body')
            this.candy_utils.handlePassId(toast_body,toast_body_div)
            this.candy_utils.handlePassClass(toast_body,toast_body_div)
            this.candy_utils.handleSetAttributes(toast_body,toast_body_div)
            toast_body_div.innerHTML = toast_body.innerHTML
            toast.appendChild(toast_body_div)
        }
        this.innerHTML = ''
        this.appendChild(toast)
     }
}
window.customElements.define(Toast_Component.component_name,Toast_Component)