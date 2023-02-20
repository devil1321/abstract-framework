class Parallax {
    constructor(){
        this.elements = document.querySelectorAll('.parallax')
    }
    handleParrallax(e,el){
        var viewportOffset = el.getBoundingClientRect();
        const scrollY = -viewportOffset.top / 1.5
        const offesetBottom = viewportOffset.bottom 
        const parallax_imgs = el.querySelectorAll('.parallax__img')
        const parallax_content = el.querySelector('.parallax__content')
        const parallax_content_header = parallax_content.querySelector('.parallax__content-header')
        const parallax_content_text = parallax_content.querySelector('.parallax__content-text')
        const isSlide = [...el.classList].filter(c => /parallax__slide/.test(c)).length > 0 ? true : false
        const isFade = [...el.classList].filter(c => /parallax__fade/.test(c)).length > 0 ? true : false
        if(isSlide){
            if(parallax_content_header){
                parallax_content_header.style.transform = `translateX(${parallax_content_header.getBoundingClientRect().top * 2.15}px)`
            }
            if(parallax_content_text){
                parallax_content_text.style.transform = `translateX(-${parallax_content_text.getBoundingClientRect().top * 2.4}px)`
            }
        }
        if(isFade){
            const r = parallax_content.getBoundingClientRect()
            if(r.top < 270){
                if(parallax_content_header){
                    parallax_content_header.style.opacity = 1
                }
                if(parallax_content_text){
                    parallax_content_text.style.opacity = 1
                }
            }
        }
        
        parallax_imgs.forEach(img =>{
            if(img.offsetTop + img.clientHeight + el.clientHeight / 3.5 > offesetBottom){
                img.style.transform = `translateY(${scrollY}px)`
            }     
        })
    }
    handleSetup(){
        this.elements.forEach(el => {
            const parallax_imgs = el.querySelectorAll('.parallax__img')
            const parallax_content = el.querySelector('.parallax__content')
           
                const parallax_content_header = parallax_content?.querySelector('.parallax__content-header')
                const parallax_content_text = parallax_content?.querySelector('.parallax__content-text')
                const isSlide = [...el.classList].filter(c => /parallax__slide/.test(c)).length > 0 ? true : false
                const isFade = [...el.classList].filter(c => /parallax__fade/.test(c)).length > 0 ? true : false
            if(isSlide){
                if(parallax_content_header){
                    parallax_content_header.style.transition = 'all 0s ease-in-out'
                    parallax_content_header.style.left = '-460px'
                }
                if(parallax_content_text){
                    parallax_content_text.style.transition = 'all 0s ease-in-out'
                    parallax_content_text.style.left = '750px'
                }
            }
            if(isFade){
                if(parallax_content_header){
                    parallax_content_header.style.opacity = 0
                    parallax_content_text.style.transition = 'all 1s ease-in-out'
                    parallax_content_header.style.left = '0px'

                }
                if(parallax_content_text){
                    parallax_content_text.style.opacity = 0
                    parallax_content_text.style.transition = 'all 1s ease-in-out'
                    parallax_content_text.style.left = '0px'

                }
            }
            setTimeout(() => {
                parallax_imgs.forEach(el => {
                    const img = el.querySelector('img')
                    el.style.height = img.clientHeight + 'px'
                })
            }, 200);
            window.addEventListener('scroll',(e) => this.handleParrallax(e,el))
        })
    }
}
class Parallax_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.parallax = new Parallax()
    }
    static component_name = 'ui-parallax'
    connectedCallback() {
        this.handleMakeParallax()
        setTimeout(() => {
         this.parallax = new Parallax()
         this.parallax.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeParallax(){
        const parallax = document.createElement('div')
        parallax.classList.add('parallax')
        this.candy_utils.handlePassId(this, parallax)
        this.candy_utils.handlePassClass(this, parallax)
        this.candy_utils.handleSetAttributes(this, parallax)

        const transition = this.getAttribute('transition')
        if(transition === 'slide' || transition === 'fade'){
            parallax.classList.add(`parallax__${transition}`)
        }

        const parallax_imgs = this.querySelectorAll('ui-parallax-img')

        parallax_imgs.forEach(img =>{
            const image = img.querySelector('img')
            const parallax_img_div = document.createElement('div')
            parallax_img_div.classList.add('parallax__img')
            this.candy_utils.handlePassId(img, parallax_img_div)
            this.candy_utils.handlePassClass(img, parallax_img_div)
            this.candy_utils.handleSetAttributes(img, parallax_img_div)
            parallax_img_div.appendChild(image)
            const parallax_content = img.querySelector('ui-parallax-content')
            const parallax_content_div = document.createElement('div')
            if(parallax_content){
                parallax_content_div.classList.add('parallax__content')
                const parallax_header = parallax_content.querySelector('ui-parallax-content-header')
                const parallax_header_div = document.createElement('div')
                if(parallax_header){
                    parallax_header_div.classList.add('parallax__content-header')
                    this.candy_utils.handlePassId(parallax_header, parallax_header_div)
                    this.candy_utils.handlePassClass(parallax_header, parallax_header_div)
                    this.candy_utils.handleSetAttributes(parallax_header, parallax_header_div)
                    parallax_header_div.innerHTML = parallax_header.innerHTML
                    parallax_content_div.appendChild(parallax_header_div)
                }
                const parallax_text = parallax_content.querySelector('ui-parallax-content-text')
                const parallax_text_div = document.createElement('div')
                if(parallax_text){
                    parallax_text_div.classList.add('parallax__content-text')
                    this.candy_utils.handlePassId(parallax_text, parallax_header_div)
                    this.candy_utils.handlePassClass(parallax_text, parallax_header_div)
                    this.candy_utils.handleSetAttributes(parallax_text, parallax_header_div)
                    parallax_text_div.innerHTML = parallax_text.innerHTML
                    parallax_content_div.appendChild(parallax_text_div)
                }
            }
            parallax_img_div.appendChild(parallax_content_div)
            parallax.appendChild(parallax_img_div)
        })
        this.innerHTML = ''
        this.appendChild(parallax)
     }
}
window.customElements.define(Parallax_Component.component_name,Parallax_Component)