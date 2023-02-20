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