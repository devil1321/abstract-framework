class Modal{
    constructor(){
        this.elements = document.querySelectorAll('.modal-wrapper')
        this.open_modal_btns = document.querySelectorAll('.modal__open-modal')
        this.close_modal_btns = document.querySelectorAll('.modal__close-modal')
    }
    handleModal(btn){
        this.elements.forEach(el => {
            const modal = el.querySelector('.modal')
            const btn_id = btn.getAttribute('data-target')
            const el_id = btn.getAttribute('data-target')
            if(btn_id === el_id){
                
                const isCombine = [...modal.classList].filter(c => /modal__combine/.test(c)).length > 0 ? true : false
                const modal_wrapper = el
                const modal_overlay = modal_wrapper.querySelector('.modal__overlay')
                const modal_img = el.querySelector('.modal__img')
                const modal_header = el.querySelector('.modal__header')
                const modal_text = el.querySelector('.modal__text')
                const modal_footer = el.querySelector('.modal__footer')
                const modal_controls = el.querySelector('.modal__controls')

                if(isCombine){
                    if(modal_wrapper){
                        modal_wrapper.style.transition = 'all 0s ease-in-out'
                        modal_wrapper.style.display = 'block'
                        modal_wrapper.style.opacity = '1'
                    }

                    if(modal_overlay){
                        modal_overlay.style.opacity = 0
                    }
                    
                    if(modal){
                        modal.style.opacity = 0;
                    }

                    if(modal_img){
                        modal_img.style.transform = 'translateY(-2000px)'
                    }

                    if(modal_header){
                        modal_header.style.opacity = 0
                        modal_header.style.transform = 'translateX(2500px)'
                    }
                    
                    if(modal_text){
                        modal_text.style.opacity = 0
                        modal_text.style.transform = 'translateX(-2500px)'
                    }
                    
                    if(modal_footer){
                        modal_footer.style.opacity = 0
                        modal_footer.style.transform = 'translateY(2500px)'
                    }
                    
                    if(modal_controls){
                        modal_controls.style.opacity = 0
                    }
                    
                    setTimeout(() => {

                        if(modal){
                            modal.style.transition = 'all 1s ease-in-out'
                            modal.style.opacity =  1
                        }
                        
                        if(modal_overlay){
                            modal_overlay.style.transition = 'all 1s ease-in-out'
                            modal_overlay.style.opacity = 1
                        }
                        if(modal_img){
                            modal_img.style.transition = 'all 2s ease-in-out'
                            modal_img.style.transform = 'translateY(0px)'
                        }
                        
                        if(modal_header){
                            modal_header.style.transition = 'all 2s ease-in-out'
                            modal_header.style.opacity = 1
                            modal_header.style.transform = 'translateX(0px)'
                        }
                        
                        if(modal_text){
                            modal_text.style.transition = 'all 2s ease-in-out'
                            modal_text.style.opacity = 1
                            modal_text.style.transform = 'translateX(0px)'
                        }
                        
                        if(modal_footer){
                            modal_footer.style.transition = 'all 2s ease-in-out'
                            modal_footer.style.opacity = 1
                            modal_footer.style.transform = 'translateY(0px)'
                        }
                        
                        if(modal_controls){
                            modal_controls.style.transition = 'all 3s ease-in-out'
                            modal_controls.style.opacity = 1
                        }
                    }, 100);       
                }
                else{
                    if(modal_wrapper){
                        modal_wrapper.style.display = 'block'
                        modal_wrapper.style.opacity = 0
                        setTimeout(() => {
                            modal_wrapper.style.transition = 'all 1s ease-in-out'
                            modal_wrapper.style.opacity = 1
                        }, 100);
                    }
                }
            }
        })
    }
    handleCloseModal(btn){
        this.elements.forEach(el => {
            const btn_id = -btn.getAttribute('data-target')
            const el_id = -btn.getAttribute('data-target')
            if(btn_id === el_id){
                el.style.transition = 'all 1s ease-in-out'
                el.style.opacity = 0
                setTimeout(() => {
                    el.style.display = 'none'
                }, 1000);
            }
        })
    }
    handleSetup(){
        this.open_modal_btns.forEach(button => {
            button.addEventListener('click',()=>this.handleModal(button))
        })
        this.close_modal_btns.forEach(button => {
            button.addEventListener('click',() => this.handleCloseModal(button))
        })
    }
}
class Modal_Button_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.modal = new Modal()
    }
    static component_name = 'ui-modal-button'
    connectedCallback() {
        this.handleMakeModalButton()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeModalButton(){
        const modal_button = document.createElement('button')
        modal_button.classList.add('modal__open-modal') 
        this.candy_utils.handlePassId(this,modal_button)
        this.candy_utils.handlePassClass(this,modal_button)
        this.candy_utils.handleSetAttributes(this,modal_button)
        const target = this.getAttribute('target')
        if(target){
            modal_button.setAttribute('data-target',target)
        }
        this.candy_utils.handlePassId(this,modal_button)
        this.candy_utils.handlePassClass(this,modal_button)
        this.candy_utils.handleSetAttributes(this,modal_button)
        modal_button.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(modal_button)
     }
}
window.customElements.define(Modal_Button_Sub_Component.component_name,Modal_Button_Sub_Component)
class Modal_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.modal = new Modal()
    }
    static component_name = 'ui-modal'
    connectedCallback() {
        this.handleMakeModal()
        setTimeout(() => {
         this.modal = new Modal()
         this.modal.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeModal(){
        const modal = document.createElement('div')
        modal.classList.add('ui-modal')
        this.candy_utils.handlePassId(this,modal)
        this.candy_utils.handlePassClass(this,modal)
        this.candy_utils.handleSetAttributes(this,modal)
        const modal_wrapper = this.querySelector('ui-modal-wrapper')
        const modal_wrapper_div = document.createElement('div')
        if(modal_wrapper){
            modal_wrapper_div.classList.add('modal-wrapper')
            this.candy_utils.handlePassId(modal_wrapper,modal_wrapper_div)
            this.candy_utils.handlePassClass(modal_wrapper,modal_wrapper_div)
            this.candy_utils.handleSetAttributes(modal_wrapper,modal_wrapper_div)
        }

        const modal_overlay = this.querySelector('ui-modal-overlay')
        const modal_overlay_div = document.createElement('div')
        if(modal_overlay){
            modal_overlay_div.classList.add('modal__overlay')
            this.candy_utils.handlePassId(modal_overlay,modal_overlay_div)
            this.candy_utils.handlePassClass(modal_overlay,modal_overlay_div)
            this.candy_utils.handleSetAttributes(modal_overlay,modal_overlay_div)
            modal_wrapper_div.appendChild(modal_overlay_div)
        }
        const modal_item = this.querySelector('ui-modal-item')
        const modal_item_div = document.createElement('div')
        if(modal_item){
            modal_item_div.classList.add('modal')
            const combine = modal_item.getAttribute('combine')
            if(combine === 'true'){
                modal_item_div.classList.add('modal__combine')
            }
            this.candy_utils.handlePassId(modal_item,modal_item_div)
            this.candy_utils.handlePassClass(modal_item,modal_item_div)
            this.candy_utils.handleSetAttributes(modal_item,modal_item_div)
            modal_wrapper_div.appendChild(modal_item_div)
        }

        const modal_img = this.querySelector('ui-modal-img')
        const modal_img_div = document.createElement('div')
        if(modal_img){
            modal_img_div.classList.add('modal__img')
            this.candy_utils.handlePassId(modal_img,modal_img_div)
            this.candy_utils.handlePassClass(modal_img,modal_img_div)
            this.candy_utils.handleSetAttributes(modal_img,modal_img_div)
            modal_img_div.innerHTML = modal_img.innerHTML
            modal_item_div.appendChild(modal_img_div)
        }

        const modal_header = this.querySelector('ui-modal-header')
        const modal_header_div = document.createElement('div')
        if(modal_header){
            modal_header_div.classList.add('modal__header')
            this.candy_utils.handlePassId(modal_header,modal_header_div)
            this.candy_utils.handlePassClass(modal_header,modal_header_div)
            this.candy_utils.handleSetAttributes(modal_header,modal_header_div)
            modal_header_div.innerHTML = modal_header.innerHTML
            modal_item_div.appendChild(modal_header_div)
        }

        const modal_text = this.querySelector('ui-modal-text')
        const modal_text_div = document.createElement('div')
        if(modal_text){
            modal_text_div.classList.add('modal__text')
            this.candy_utils.handlePassId(modal_text,modal_text_div)
            this.candy_utils.handlePassClass(modal_text,modal_text_div)
            this.candy_utils.handleSetAttributes(modal_text,modal_text_div)
            modal_text_div.innerHTML = modal_text.innerHTML
            modal_item_div.appendChild(modal_text_div)
        }


        const modal_footer = this.querySelector('ui-modal-footer')
        const modal_footer_div = document.createElement('div')
        if(modal_footer){
            modal_footer_div.classList.add('modal__footer')
            this.candy_utils.handlePassId(modal_footer,modal_footer_div)
            this.candy_utils.handlePassClass(modal_footer,modal_footer_div)
            this.candy_utils.handleSetAttributes(modal_footer,modal_footer_div)
            modal_footer_div.innerHTML = modal_footer.innerHTML
            modal_item_div.appendChild(modal_footer_div)
        }

        const modal_close = this.querySelector('ui-modal-close')
        const modal_close_div = document.createElement('div')

        if(modal_close){
            modal_close_div.classList.add('modal__controls')
            const button = document.createElement('button')
            button.classList.add('modal__close')
            button.innerHTML = modal_close.innerHTML
            modal_close_div.appendChild(button)
            modal_item_div.appendChild(modal_close_div)
        }

        if(modal_item){
            modal_wrapper_div.appendChild(modal_item_div)
        }

        if(modal_wrapper){
            modal.appendChild(modal_wrapper_div)
        }

        this.innerHTML = ''
        this.appendChild(modal)
     }
}
window.customElements.define(Modal_Component.component_name,Modal_Component)