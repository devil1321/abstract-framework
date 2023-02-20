class Breadcrumb{
    constructor() {
        this.paths = [...document.querySelectorAll('.breadcrumb__path'),'reset']
    }
    handleBreadcrumbAnim(){
        let time = 0
        this.paths.forEach((p)=>{
        if(p !== 'reset'){
            if(p.parentElement.classList.contains('breadcrumb__animated')){
                if(p !== 'reset'){
                    setTimeout(()=>{
                        p.style.animation = 'animItem 1s ease-in-out'
                    },time += 1000)
                }else{
                    setTimeout(()=>{
                        this.paths.forEach((p)=>{
                            if(p !== 'reset'){
                                p.style.animation = 'none'
                            }
                        })
                    },1000 * this.paths.length - 3)
                }
            }
        }
    })            
    }
    handleSetup(){
        this.handleBreadcrumbAnim()
    }
}
class Breadcrumb_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.breadcrumb = undefined
    }
    static component_name = 'ui-breadcrumb'
    connectedCallback() {
       this.handleMakeBreadcrumb()
       setTimeout(() => {
        this.breadcrumb = new Breadcrumb()
        this.breadcrumb.handleSetup()
     }, 100);
    }
    disconnectedCallback() {

    }
    attributeChangedCallback(name, oldValue, newValue) {
     
    }
    adoptedCallback() {
    }
    handleMakeBreadcrumb(){
        const breadcrumb = document.createElement('div')
        breadcrumb.classList.add('breadcrumb')
        const isAnimated = this.getAttribute('isAnimated')
        if(isAnimated === 'true'){
            breadcrumb.classList.add('breadcrumb__animated')
        }
        this.candy_utils.handlePassClass(this,breadcrumb)
        this.candy_utils.handlePassId(this,breadcrumb)
        this.candy_utils.handleSetAttributes(this,breadcrumb)
        
        const breadcrumb_paths = this.querySelectorAll('ui-breadcrumb-path')
        let len = breadcrumb_paths.length
        let paths = []
        let dividers = []
        breadcrumb_paths.forEach(p =>{
            const breadcrumb_path_div = document.createElement('div')
            breadcrumb_path_div.classList.add('breadcrumb__path')
            this.candy_utils.handlePassClass(p,breadcrumb_path_div)
            this.candy_utils.handlePassId(p,breadcrumb_path_div)
            this.candy_utils.handleSetAttributes(p,breadcrumb_path_div)
            breadcrumb_path_div.innerHTML = p.innerHTML
            p.remove()
            paths.push(breadcrumb_path_div)
        })
        
        const breadcrumb_dividers = this.querySelectorAll('ui-breadcrumb-divider')
        breadcrumb_dividers.forEach(d =>{
            const breadcrumb_divider_div = document.createElement('div')
            const type = d.getAttribute('type')
            if(type){    
                breadcrumb_divider_div.classList.add(`breadcrumb__divider-${type}`)
            }else{
                breadcrumb_divider_div.classList.add(`breadcrumb__divider`)
            }
            this.candy_utils.handlePassClass(d,breadcrumb_divider_div)
            this.candy_utils.handlePassId(d,breadcrumb_divider_div)
            this.candy_utils.handleSetAttributes(d,breadcrumb_divider_div)
            breadcrumb_divider_div.innerHTML = d.innerHTML
            d.remove()
            dividers.push(breadcrumb_divider_div)
        })
            
        for(let i = 0; i < len; i++) {
            if(breadcrumb_paths[i]){
                breadcrumb.appendChild(paths[i])
            }
            if(breadcrumb_dividers[i]){
                breadcrumb.appendChild(dividers[i])
            }
        }

        this.innerHTML = ''
        this.appendChild(breadcrumb)
    }
}
window.customElements.define(Breadcrumb_Component.component_name,Breadcrumb_Component)