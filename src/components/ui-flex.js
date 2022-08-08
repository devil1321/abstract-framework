
export class Flex extends HTMLElement{
    static componentName = 'ui-flex'
    constructor(){
        super()
        this.div = document.createElement('div')
        this.childNodesArr = [...this.childNodes]
        this.styles = document.head.querySelector('style')
        // this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    }
    connectedCallback() {
        this.setChildren()
        this.setClass()
        this.setFlex()
        this.appendChild(this.div)
    }
    setChildren(){
        this.childNodesArr.forEach(c=>{
            this.div.appendChild(c)
        })
    }
    setClass(){
        this.div.classList.add('flex')
    }
    setFlex(){
        this.styles.textContent += `.flex{
            display:flex;
        }`
    }
}