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