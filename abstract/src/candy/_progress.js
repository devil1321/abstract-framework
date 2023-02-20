class Progress{
    constructor(){
        this.elements = document.querySelectorAll('.progress')
        this.round_elements = document.querySelectorAll('.progress-round')
    }
    handleMixedProgess(){
        this.elements.forEach(el =>{
            const isMixed = [...el.classList].filter(c => /progress__mixed/.test(c)).length > 0 ? true : false
            const progress_bar = el.querySelector('.progress__bar')
            const progress_mixed_wrapper = document.createElement('div')
            progress_mixed_wrapper.classList.add('progress__mixed-wrapper')
            progress_bar.appendChild(progress_mixed_wrapper)
            if(isMixed){
                for(let i = progress_bar.clientWidth + 500; i > 0; i -= 20){
                    const progress_mixed_item = document.createElement('div')
                    if(progress_mixed_item){
                        progress_mixed_item.style.backgroundColor = 'var(--medium-white)'
                        progress_mixed_item.style.minWidth = '20px'
                        progress_mixed_item.style.height = '20px'
                        progress_mixed_item.classList.add('progress__mixed-item')
                    }
                    progress_mixed_wrapper.appendChild(progress_mixed_item)
                }
            }
        })
    }
    handleProgress(id_or_progress_el,progress_percentage){
        let el
        if(typeof id_or_progress_el === 'string'){
            el = document.querySelector(`#${id_or_progress_el}`)
        }else{
            el = id_or_progress_el
        }
        if(el){
            const width = el.clientWidth
            const step = width / 100
            const progress_bar = el.querySelector('.progress__bar')
            const position = el.querySelector('.progress__position')
            const position_round = el.querySelector('.progress-round__position')
            if(progress_percentage <= 100){
                if(position_round){
                    position_round.textContent = progress_percentage + '%'
                }
                if(position){
                    position.textContent = progress_percentage + '%'
                }
            }
            if(progress_bar){
                progress_bar.style.width = progress_percentage * step + 'px'
            }
        }
    }
    handleRoundProgress(){
        this.round_elements.forEach(el =>{
            const progress_position = el.querySelector('.progress-round__position')
            const position_background = getComputedStyle(progress_position).backgroundColor
            progress_position.style.boxShadow = `0px 0px 10px ${position_background}`
            for(let i = 360; i > 0; i -= 20){
                const progress_dot_wrapper = document.createElement('div')
                progress_dot_wrapper.classList.add('progress-round__dot-wrapper')
                progress_dot_wrapper.style.height = el.clientHeight / 3 + 'px'
                progress_dot_wrapper.style.top = '18%'
                progress_dot_wrapper.style.left = '44%'
                const progress_dot = document.createElement('div')
                progress_dot.classList.add('progress-round__dot')
                const classRegex = /progress-round__dot-[a-zA-Z]+/gi
                const el_background = [...el.classList].find(c => classRegex.test(c))
                progress_dot.classList.add(el_background)
                progress_dot_wrapper.style.transform = `rotate(${i}deg)`
                progress_dot_wrapper.appendChild(progress_dot)
                const items_odd = [
                    { transform: `rotate(${i}) scale(1.5)` },
                    { transform: `rotate(${360 + i}deg) scale(2)` },
                    { transform: `rotate(${i}) scale(1.5)` },
                  ];
                  const items_odd_timing = {
                    duration: 2000,
                    iterations: 100000,
                  }
                const items_even = [
                    { transform: `rotate(${i}) scale(1.5)` },
                    { transform: `rotate(${360 + i}deg) scale(2)` },
                    { transform: `rotate(${i}) scale(1.5)` },
                  ];
                  const items_even_timing = {
                    duration: 4000,
                    iterations: 100000,
                  }
                  if(i % 40 === 0){
                    progress_dot_wrapper.animate(items_odd,items_odd_timing)
                  }else{
                      progress_dot_wrapper.animate(items_even,items_even_timing)
                  }
                el.appendChild(progress_dot_wrapper)
            }
        })
    }
    handleSetup(){
        this.handleMixedProgess()
        this.handleRoundProgress()
        let p = 0
        setInterval(
            () => {
                p+=1
                this.handleProgress('progess',p)
            },100
        )
    }
}
class Progress_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.progress = new Progress()
    }
    static component_name = 'ui-progress'
    connectedCallback() {
        this.handleMakeProgres()
        setTimeout(() => {
         this.progress = new Progress()
         this.progress.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeProgres(){
        const progress = document.createElement('div')
        this.candy_utils.handlePassId(this,progress)
        this.candy_utils.handlePassClass(this,progress)
        this.candy_utils.handleSetAttributes(this,progress)
        const type = this.getAttribute('type')
        if(type === 'line' | !type) {
            progress.classList.add('progress')
        }else if(type === 'round'){
            progress.classList.add('progress-round')
            const dot_color = this.getAttribute('dot-color')
            if(dot_color){
                progress.classList.add(`progress-round__dot-${dot_color}`)
            }
        }
        const mixed = this.getAttribute('mixed')
        if(mixed === 'true'){
            progress.classList.add('progress__mixed')
        }

        const progress_position = this.querySelector('ui-progress-position')
        const progress_position_div = document.createElement('div')
        if(progress_position){
            if(type === 'round'){
                progress_position_div.classList.add('progress-round__position')
            }else if(type === 'line'){
                progress_position_div.classList.add('progress__position')
            }
            const position = this.getAttribute('position')
            this.candy_utils.handlePassId(progress_position,progress_position_div)
            this.candy_utils.handlePassClass(progress_position,progress_position_div)
            this.candy_utils.handleSetAttributes(progress_position,progress_position_div)
            if(position){
                progress_position_div.textContent = position
            }
            progress.appendChild(progress_position_div)
        }
        if(type === 'line' | !type){
            const progress_bar = this.querySelector('ui-progress-bar')
            const progress_bar_div = document.createElement('div')
            if(progress_bar){
                this.candy_utils.handlePassId(progress_bar,progress_bar_div)
                this.candy_utils.handlePassClass(progress_bar,progress_bar_div)
                this.candy_utils.handleSetAttributes(progress_bar,progress_bar_div)
                progress_bar_div.classList.add('progress__bar')
                progress.appendChild(progress_bar_div)
            }
        }
        this.innerHTML = ''
        this.appendChild(progress)
     }
}
window.customElements.define(Progress_Component.component_name,Progress_Component)