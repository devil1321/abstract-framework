class Grid_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-grid'
    connectedCallback() {
        this.handleMakeGrid()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeGrid(){
        const grid = document.createElement('div')
        grid.classList.add('grid')
        
        const grid_attr = this.getAttribute('grid')
        if(grid_attr){
            grid.classList.add(`grid__${grid_attr}`)
        }
        const grid_column_attr = this.getAttribute('column')
        if(grid_column_attr){
            grid.classList.add(`grid__${grid_column_attr}`)
        }
        const grid_row_attr = this.getAttribute('row')
        if(grid_row_attr){
            grid.classList.add(`grid__${grid_row_attr}`)
        }

        const justify = this.getAttribute('justify-self')
        if(justify){
            grid.classList.add(`justify-self__${justify}`)
        }
        const align = this.getAttribute('align-self')
        if(align){
            grid.classList.add(`align-self__${align}`)
        }

        grid.innerHTML = this.innerHTML


        this.innerHTML = ''
        this.appendChild(grid)
     }
}
window.customElements.define(Grid_Component.component_name,Grid_Component)