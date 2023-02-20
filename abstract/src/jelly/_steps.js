class Step {
    constructor(){
        this.elements = document.querySelectorAll('.step')
    }
    handleZindex(){
        this.elements.forEach(el => {
            const step_items = el.querySelectorAll('div')
            const step_items_left = el.querySelectorAll('.step__left')
            let z_index = 8999
            step_items.forEach(i => {
                i.style.zIndex = z_index
                z_index--
            })
            z_index = 9999
            step_items_left.forEach(item => {
                item.style.zIndex = z_index
                z_index--
            })
        })
    }
    handleSetup(){
        this.handleZindex()
    }
}