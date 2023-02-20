class Divider{
    constructor(){
        this.elements = document.querySelectorAll('.divider')
    }
    handleSetup(){
        this.elements.forEach(el => {
            const content = el.querySelector(':nth-child(2)')
            const dividersHorizontal = el.querySelectorAll(`[class^="divider__horizontal"]`)
            const dividersVertical = el.querySelectorAll(`[class^="divider__vertical"]`)
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const percentageX = ( screenWidth - content.clientWidth ) / screenWidth;
            const percentageY = ( screenHeight - content.clientHeight ) / screenHeight;
            const pxY = (content.clientHeight / 2);  
            const pxX = (content.clientWidth / 2);  
            if(!content.classList.contains('divider__text-vertical')){
                dividersHorizontal.forEach(d => {
                    el.style.width = '100%'
                    d.style.width = percentageX * 100 / 2 - 3 + '%'
                    d.style.top = pxY + 'px'
                })
            }else{
                dividersVertical.forEach(d => {
                    el.style.height = '100%'
                    d.style.height = percentageY * 100 / 2 - 3 + '%'
                    d.style.left = pxX + 'px'
                })
            }
            const isAnimation = [...el.classList].filter(c => /divider__with-animation/.test(c)).length > 0 ? true : false
            if(isAnimation){
                content.addEventListener('mouseenter',(e) => {
                    if(dividersHorizontal[0] || dividersVertical[0] ){
                        if(dividersHorizontal[0]){
                            dividersHorizontal[0].style.transform = 'translateX(-10px)'
                        }
                        if(dividersVertical[0]){
                            dividersVertical[0].style.transform = 'translateY(-10px)'
                        }
                    }
                    if(dividersHorizontal[1] || dividersVertical[1] ){
                        if(dividersHorizontal[1]){
                            dividersHorizontal[1].style.transform = 'translateX(10px)'
                        }
                        if(dividersVertical[1]){
                            dividersVertical[1].style.transform = 'translateY(10px)'
                        }
                    }
                })
                content.addEventListener('mouseout',(e) => {
                    if(dividersHorizontal[0] || dividersVertical[0] ){
                        if(dividersHorizontal[0]){
                            dividersHorizontal[0].style.transform = 'translateX(0px)'
                        }
                        if(dividersVertical[0]){
                            dividersVertical[0].style.transform = 'translateY(0px)'
                        }
                    }
                    if(dividersHorizontal[1] || dividersVertical[1] ){
                        if(dividersHorizontal[1]){
                            dividersHorizontal[1].style.transform = 'translateX(0px)'
                        }
                        if(dividersVertical[1]){
                            dividersVertical[1].style.transform = 'translateY(0px)'
                        }
                    }
                })
            }
        })
    }
}
class Divider_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.divider = new Divider()
    }
    static component_name = 'ui-divider'
    connectedCallback() {
        this.handleMakeDivider()
        setTimeout(() => {
        this.divider = new Divider()
         this.divider.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDivider(){
        const text = this.getAttribute('text')
        const tag = this.getAttribute('tag')
        const type = this.getAttribute('type')
        const color_type = this.getAttribute('color-type')
        const color = this.getAttribute('color')
        const divider = document.createElement('div')
        divider.classList.add('divider')
        const divider_line_1 = document.createElement('div')
        const divider_line_2 = document.createElement('div')
        let divider_text
        if(tag){
            divider_text = document.createElement(`${tag}`)
        }else{
            divider_text = document.createElement(`h3`)
        }
        if(type){
            divider_text.classList.add(`divider__text-${type}`)
        }
        divider_text.innerHTML = this.innerHTML
        if(type && color_type && color){
            divider_line_1.classList.add(`divider__${type}-${color_type}-${color}`)
            divider_line_2.classList.add(`divider__${type}-${color_type}-${color}`)
        }else{
            alert('You need to specify divider type color-type and color')
        }
        divider.appendChild(divider_line_1)
        divider.appendChild(divider_text)
        divider.appendChild(divider_line_2)
        this.innerHTML = divider.outerHTML


     }
}
window.customElements.define(Divider_Component.component_name,Divider_Component)