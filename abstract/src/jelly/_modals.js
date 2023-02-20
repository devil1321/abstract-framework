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