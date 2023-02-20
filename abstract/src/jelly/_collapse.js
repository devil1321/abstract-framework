class ButtonCollapse{
    constructor(){
        this.buttons = document.querySelectorAll('.button__collapse')
    }
    handleCollapses(btn){
        const target = document.querySelector(`${btn.dataset.target}`)
        const animationIn = framework.utils.handleTransitionIn(target)
        const animationOut = framework.utils.handleTransitionOut(target)
        target.style.borderWidth = '0px'
        btn.addEventListener('click',(e)=>{
            target.style.removeProperty('border-width')
            if(!target.classList.contains('collapse__open')){
                target.classList.add('collapse__open')
                    target.style.padding = '20px 10px'
                    target.style.animation = 'none'
                    target.style.animation = animationIn
            }else{
                target.classList.remove('collapse__open')
                    let stopTimer
                    clearTimeout(stopTimer)
                    if(target.classList.contains('slide-y') || target.classList.contains('slide-x')){
                        stopTimer = setTimeout(function(){
                            target.style.padding = '0px 0px'
                            target.style.borderWidth = '0px'
                        },framework.globalSetup.animationTime);
                    }
                    target.style.animation = 'none'
                    target.style.animation = animationOut
            }
        })
    }
    handleSetup(){
        this.buttons.forEach(btn => this.handleCollapses(btn))
    }
}