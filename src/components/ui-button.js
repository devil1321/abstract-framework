import { setChildren, setAttributes } from '../controllers/controllers.js'
export class Button extends HTMLElement{
    static componentName = 'ui-button'
 
    constructor(){
        super()
        this.button = document.createElement('button')
        this.pulse = document.createElement('span')
        this.styles = document.head.querySelector('style')
        this.text = this.textContent
        // this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    }
    static get observedAttributes() { 
        return ['background']; 
    }
    connectedCallback() {
        this.innerHTML = ""
        this.button.textContent = this.text
        this.setPulse()
        this.setComponentClassAndStyles()
        this.setComponent()
        setChildren(this,this.button)
        setAttributes(this,this.button)
        this.setBackground()
        this.setColor()
    }
    disconnectedCallback(){
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.setBackground()
        this.setColor()
        this.remount()
    }
    setBackground(){
        const attr = this.getAttribute('background')
        switch(attr){
            case 'orange':
                this.button.classList.add('btn__orange')
                const regex = /.btn__orange/
                this.styles.innerHTML += `.btn__orange {
                    background-color:var(--orange);
                }`
                const index =  regex.exec(this.styles.textContent).index
                const rules = "border-radius:100px !important;"
                var result = this.styles.textContent.slice(0,index+14) + rules + this.styles.textContent.slice(index+14+rules.length,this.styles.textContent.length);
                this.styles.innerHTML = result
                break
            case 'yellow':
                this.button.classList.add('btn__yellow')
                this.styles.innerHTML += `.btn__yellow{
                    background-color:var(--yellow);
                }`
                break
            case 'olive':
                this.button.classList.add('btn__olive')
                this.styles.innerHTML += `.btn__olive{
                    background-color:var(--olive);
                }`
                break
            case 'green':
                this.button.classList.add('btn__green')
                this.styles.innerHTML += `.btn__green{
                    background-color:var(--red);
                }`
                break
            case 'teal':
                this.button.classList.add('btn__teal')
                this.styles.innerHTML += `.btn__teal{
                    background-color:var(--teal);
                }`
                break
            case 'blue':
                this.button.classList.add('btn__blue')
                this.styles.innerHTML.replace(`btn__blue{
                    background-color:var(--blue);
                }`,"")
                this.styles.innerHTML += `.btn__blue{
                    background-color:var(--blue);
                }`
          
                break
            case 'violet':
                this.button.classList.add('btn__violet')
                this.styles.innerHTML += `.btn__violet{
                    background-color:var(--red);
                }`
                break
            case 'purple':
                this.button.classList.add('btn__purple')
                this.styles.innerHTML += `.btn__purple{
                    background-color:var(--purple);
                }`
                break
            case 'pink':
                this.button.classList.add('btn__pink')
                this.styles.innerHTML += `.btn__pink{
                    background-color:var(--pink);
                }`
                break
            case 'brown':
                this.button.classList.add('btn__brown')
                this.styles.innerHTML += `.btn__brown{
                    background-color:var(--brown);
                }`
                break
            case 'grey':
                this.button.classList.add('btn__grey')
                this.styles.innerHTML += `.btn__grey{
                    background-color:var(--grey);
                }`
                break
            case 'black':
                this.button.classList.add('btn__black')
                this.styles.innerHTML += `.btn__black{
                    background-color:var(--black);
                }`
                break
            default:
                this.button.classList.add('btn__custom')
                if(/{{.*}}/.test(attr)){
                    this.styles.innerHTML += `.btn__custom{
                        background-color:${eval(attr)};
                    }`
                }else{
                    this.styles.innerHTML += `.btn__custom{
                        background-color:${attr};
                    }`
                }
        }
    }
    setColor(){
        const attr = this.getAttribute('color')
        switch(attr){
            case 'orange':
                this.button.classList.add('btn__orange')
                this.styles.innerHTML += `.btn__orange {
                    color:var(--orange);
                }`
                break
            case 'yellow':
                this.button.classList.add('btn__yellow')
                this.styles.innerHTML += `.btn__yellow{
                    color:var(--yellow);
                }`
                break
            case 'olive':
                this.button.classList.add('btn__olive')
                this.styles.innerHTML += `.btn__olive{
                    color:var(--olive);
                }`
                break
            case 'green':
                this.button.classList.add('btn__green')
                this.styles.innerHTML += `.btn__green{
                    color:var(--red);
                }`
                break
            case 'teal':
                this.button.classList.add('btn__teal')
                this.styles.innerHTML += `.btn__teal{
                    color:var(--teal);
                }`
                break
            case 'blue':
                this.button.classList.add('btn__blue')
                this.styles.innerHTML += `.btn__blue{
                    color:var(--blue);
                }`
                break
            case 'violet':
                this.button.classList.add('btn__violet')
                this.styles.innerHTML += `.btn__violet{
                    color:var(--red);
                }`
                break
            case 'purple':
                this.button.classList.add('btn__purple')
                this.styles.innerHTML += `.btn__purple{
                    background-color:var(--purple);
                }`
                break
            case 'pink':
                this.button.classList.add('btn__pink')
                this.styles.innerHTML += `.btn__pink{
                    background-color:var(--pink);
                }`
                break
            case 'brown':
                this.button.classList.add('btn__brown')
                this.styles.innerHTML += `.btn__brown{
                    color:var(--brown);
                }`
                break
            case 'grey':
                this.button.classList.add('btn__grey')
                this.styles.innerHTML += `.btn__grey{
                    color:var(--grey);
                }`
                break
            case 'black':
                this.button.classList.add('btn__black')
                this.styles.innerHTML += `.btn__black{
                    color:var(--black);
                }`
                break
            default:
                this.button.classList.add('btn__custom')
                this.styles.innerHTML += `.btn__custom{
                    color:${attr};
                }`
        }
    }

    setComponentClassAndStyles(){
        this.button.classList.add('btn')
        this.styles.innerHTML += `
            .btn{
                overflow:hidden;
                position:relative;
                top:0px;
                left:0px;
                font-weight:bold;
                color:white;
                padding:7px 20px;
                border:0px;
                border-radius:5px;
                background-color:black;
            }
        `
    }
    setComponent(){
        this.appendChild(this.button)
    }
    remount(){
        const oldButton = this.querySelector('button')
        const newButton = this.button
        newButton.classList.add('btn')
        if(oldButton){
            const textNodes = [...oldButton.childNodes]
            const savedNodes = []
            textNodes.map(n => {
                const savedTextNode = window.map.find(s => s.n_index === n.n_index)
                if(savedTextNode !== undefined){
                    savedNodes.push(savedTextNode)
                }
            })
            savedNodes === savedNodes.filter(n => n !== undefined)
            newButton.innerHTML = ""
            savedNodes.forEach(n => {
                    const text = document.createTextNode(n.nodeValue)
                    text.n_index = n.n_index
                    text.nodeValueVar = n.nodeValueVar
                    newButton.appendChild(text)
            })
            newButton.setAttribute('data-node_id',oldButton.dataset.node_id)
            oldButton.replaceWith(newButton)
        }
    }
    setPulse(){
        this.button.appendChild(this.pulse)
        this.pulse.classList.add('btn__pulse')
        this.styles.innerHTML += `
        .btn__pulse{
            pointer-events:none;
            position:absolute;
            top:0px;
            left:0px;
            width:0px;
            height:0px;
            background-color:white;
            opacity:0.3;
            border-radius:100%;
            transition:all 0.3s ease-in-out;
            transform:translate(-50%, -50%);
            transform-origin:center center;
        }
        .btn__pulse--active{
            animation:pulse 0.7s linear forwards;
         }
         @keyframes pulse{
             0%{
                 width:0px;
                 height:0px;
                 opacity:0;
             }
             50%{
                 opacity:0.7;
                 width:150px;
                 height:150px;
             }
             100%{
                 opacity:0;
                 width:150px;
                 height:150px;
             }
         }
        `      
        const handlePulse = (e) => {
            e.stopPropagation();
            const x = e.clientX - e.target.offsetLeft 
            const y = e.clientY - e.target.offsetTop 
            this.pulse.style.left = x + 'px'
            this.pulse.style.top = y + 'px'
            this.button.appendChild(this.pulse)
            this.pulse.classList.add('btn__pulse--active')
        }
        this.button.addEventListener('click',handlePulse)
    }
   
}

