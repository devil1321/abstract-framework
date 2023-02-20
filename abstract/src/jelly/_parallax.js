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