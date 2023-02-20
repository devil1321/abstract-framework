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