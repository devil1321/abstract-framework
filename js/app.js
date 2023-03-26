

// const store = createStore({
//     transition:'fadeIn'
// })


// dynamic.points = [{
//     section_parent:'#root',
//     section_child:'#app'
// }]




class Code{
    constructor() {
        this.code_buttons = document.querySelectorAll('.ui__show-code')
        this.component_buttons = document.querySelectorAll('.ui__show-component')
    }
    handleCode(btn){
        const anim_in = framework.utils.handleTransitionIn(btn)
        const anim_out = framework.utils.handleTransitionOut(btn)
        const codes = document.querySelectorAll('.ui__code')
        codes.forEach(c => c.style.animation = 'none')
        const code = btn.parentElement.parentElement.querySelector('.ui__code')
        if(btn.classList.contains('ui__show-code')){
            code.style.animation = anim_in
        }else{
            code.style.animation = anim_out
        }
    }
    handleSetup(){
        this.code_buttons.forEach(b => b.addEventListener('click', (e)=>this.handleCode(b)))
        this.component_buttons.forEach(b => b.addEventListener('click', (e)=>this.handleCode(b)))
    }
}

const code_component_controller = new Code()
code_component_controller.handleSetup()


class UI_Select_Collapse {
    constructor(){
        this.ui_selects = document.querySelectorAll('.ui__select-collapse')
        this.ui_select_collapse_in = document.querySelector('.ui__select-collapse-in')
        this.ui_select_collapse_out = document.querySelector('.ui__select-collapse-out')
        this.ui_select_collapse_type = document.querySelector('.ui__select-collapse-type')
        this.ui_options_collapse_in =   this.ui_select_collapse_in.querySelectorAll('.ui__option-in')
        this.ui_options_collapse_out =   this.ui_select_collapse_out.querySelectorAll('.ui__option-out')
        this.ui_options_collapse_type =   this.ui_select_collapse_type.querySelectorAll('.ui__option-type')
        this.collapse = document.querySelector('.ui__component #collapse')
    }
    handleTypeClass(type){
        this.collapse.classList = 'collapse  mr-t-2'
        if(type !== 'Type'){
            this.collapse.classList.add(type)
        }
        JellyFramework.collapse.handleSetup()
    }
    handleTypeCollapseIn(e){
        if(e.target.textContent !== 'Transtion In'){
            this.collapse.setAttribute('data-transition_in',e.target.textContent)
        }
        JellyFramework.collapse.handleSetup()
    }
    handleTypeCollapseOut(e){
        if(e.target.textContent !== 'Transtion out'){
            this.collapse.setAttribute('data-transition_out',e.target.textContent)
        }
        JellyFramework.collapse.handleSetup()
    }
    handleSelect(el){
        if(!el.classList.contains('select--open')){
            el.classList.add('select--open')
            el.style.maxHeight  = '9999px'
        }else{
            el.classList.remove('select--open')
            el.style.maxHeight = '45px'
        }
    }
    handleSetup(){
        this.ui_selects.forEach(el => el.addEventListener('click', (e)=>this.handleSelect(el)))
        this.ui_options_collapse_in.forEach((el,i)=>{
            if(i !== 0){
                el.addEventListener('click', (e)=>{
                    this.ui_options_collapse_in[0].textContent = el.textContent
                    this.handleTypeCollapseIn(e)
                })
                    
            }
        })
        this.ui_options_collapse_out.forEach((el,i)=>{
            if(i !== 0){
                el.addEventListener('click', (e)=>{
                    this.ui_options_collapse_out[0].textContent = el.textContent
                    this.handleTypeCollapseIn(e)
                })
            }
        })
        this.ui_options_collapse_type.forEach((el,i)=>{
            if(i !== 0){
                el.addEventListener('click', ()=>{
                    this.ui_options_collapse_type[0].textContent = el.textContent
                    this.handleTypeClass(el.textContent)
                })
            }
        })
    }
}
const ui_select_collapse = new UI_Select_Collapse()
ui_select_collapse.handleSetup()

class UI_Select_Accordion{
    constructor() {
        this.ui_selects = document.querySelectorAll('.ui__select-accordion')
        this.ui_selects_type = document.querySelector('.ui__select-accordion-type')
        this.ui_selects_in = document.querySelector('.ui__select-accordion-in')
        this.ui_selects_out = document.querySelector('.ui__select-accordion-out')
        this.options_type = this.ui_selects_type.querySelectorAll('.ui__option-type')
        this.options_in = this.ui_selects_in.querySelectorAll('.ui__option-in')
        this.options_out = this.ui_selects_out.querySelectorAll('.ui__option-out')
        this.accordion_heading = document.querySelector('.ui__accordion-component .accordion__heading')
        this.accordion_body_wrapper = document.querySelector('.ui__accordion-component .accordion__body-wrapper')
    }
    handleTypeAccordion(type){
        if(type !== 'Type'){
            this.accordion_body_wrapper.classList = 'accordion__body-wrapper'
            this.accordion_body_wrapper.classList.add(type)
            framework.accordion.handleSetup()
        }
    }
    handleTypeAccordionIn(type){
        this.accordion_heading.setAttribute('data-transition_in',type)
        framework.accordion.handleSetup()

    }
    handleTypeAccordionOut(type){
        if(type !== 'Transition Out'){
            this.accordion_heading.setAttribute('data-transition_out',type)
        }
        framework.accordion.handleSetup()
    }
    handleSelect(el){
        if(!el.classList.contains('select--open')){
            el.classList.add('select--open')
            el.style.maxHeight  = '9999px'
        }else{
            el.classList.remove('select--open')
            el.style.maxHeight = '45px'
        }
    }
    handleSetup(){
        this.ui_selects.forEach(el => el.addEventListener('click',()=>this.handleSelect(el)))
        this.options_type.forEach(el => el.addEventListener('click',()=>this.handleTypeAccordion(el.textContent)))
        this.options_in.forEach(el => el.addEventListener('click',()=>this.handleTypeAccordionIn(el.textContent)))
        this.options_out.forEach(el => el.addEventListener('click',()=>this.handleTypeAccordionOut(el.textContent)))
    }
}

const ui_select_accordion = new UI_Select_Accordion()
ui_select_accordion.handleSetup()

