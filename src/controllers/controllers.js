export class UI_STATE {
    constructor(state){
        this.state = state
    }
}

export const createComponent = ({name,props,render}) => {
    class Component extends HTMLElement {
        static componentName = name
        connectedCallback() {
            this.innerHTML = render(props)
            // handleVariables(this)
        }
    }
    mount([Component])     
}

export const mount = (components) => {
    components.forEach(c => {
        customElements.define(c.componentName,c)
    })
}


export const addStyles = (styles) => {
    const stylesTag = document.head.querySelector('style')
    stylesTag.textContent += styles
}

export const insertStyles = (styles,className) => {
    const stylesTag = document.head.querySelector('style')
    const regex = new RegExp(`${className}`)
    const index =  regex.exec(stylesTag.textContent).index
    const step = className.length + 1
    const result = stylesTag.textContent.slice(0,index + step) + styles + stylesTag.textContent.slice(index+step+styles.length,stylesTag.textContent.length);
    stylesTag.innerHTML = result
}
export const handleAllEvents = (mountPoint) =>{
    const root = document.querySelector(mountPoint)
    const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT)
    let node
    while (node = iter.nextNode()) {
        const attrs = node.getAttributeNames()
        const regex = /^on:[A-Z]/gi
        const filteredEvents = attrs.filter(ev => ev.match(regex))
        const eventArray = filteredEvents.map(ev => {
            const fn = node.getAttribute(ev)
            const wholeEvent = {
                name:ev.slice(3,ev.length).toString(),
                fn:function fire(e){
                   const validFn = eval(fn)
                   validFn(e)
                }
            }
            return wholeEvent
        })

        eventArray.forEach(ev => {
                node.addEventListener(ev.name,(e)=>{
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    ev.fn(e)
                    const savedNode = window.map.find(n => n.n_index === e.target.dataset.node_id)
                    const parent = window.map.find(n => n.n_index === savedNode.parent_index)
                    const ui_element = [...document.querySelectorAll('#root *')].find(n => n.dataset.node_id === parent.n_index)
                    const targetAttrs = e.target.getAttributeNames()
                    const uiElAttrs = ui_element.getAttributeNames()
                    handleAttributes(e.target,savedNode.attrsVar,targetAttrs)
                    handleAttributes(ui_element,parent.attrsVar,uiElAttrs)
                    handleVariables(e.target,savedNode)
                    handleAllEvents('#root')
            })
        })
    }
}
export const handleRemoveEvents = (mountPoint) =>{
    const root = document.querySelector(mountPoint)
    const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT)
    let node
    while (node = iter.nextNode()) {
        const attrs = node.getAttributeNames()
        const regex = /^on:[A-Z]/gi
        const filteredEvents = attrs.filter(ev => ev.match(regex))
        const eventArray = filteredEvents.map(ev => {
            const fn = node.getAttribute(ev)
            const wholeEvent = {
                name:ev.slice(3,ev.length).toString(),
                fn:function fire(){
                    eval(fn)
                }
            }
            return wholeEvent
        })
        eventArray.forEach(ev => {
            node.removeEventListener(ev.name,ev.fn)
        })
    }
}


export const setChildren = (node,element) => {
    [...node.childNodes].filter(n => n !== element).forEach((c,index)=>{
            element.appendChild(c)
        })
}
export const setAttributes = (node,element) => {
    const attrs = node.getAttributeNames()
    attrs.forEach(a => {
        const regex = /^:/
        const regexTwo = /^e:/
        if(regex.test(a)){
            const attr = node.getAttribute(a)
            element.setAttribute(a.slice(1,a.length),attr)
        }
        if(regexTwo.test(a)){
            const attr = node.getAttribute(a)
            element.setAttribute('on:' + a.slice(2,a.length),attr)
        }
    })
    
}

export const handleAllAttributes = (mountPoint) => {
    const root = document.querySelector(mountPoint)
    const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT)
    let node
    while (node = iter.nextNode()) {
        const attrs = node.getAttributeNames()
        attrs.forEach(a => {
            const regex = /{{.*}}/gi
            const attr = node.getAttribute(a)
            if(attr){
                if(regex.test(attr)){
                    const dynamic = eval(attr)
                    node.setAttribute(a,dynamic)
                }
            }
        })
    }
}
export const handleAttributes = (target,varAttrs,targetAttrs) => {
       const regex = /{{.*}}/
       for(let i = 0; i < varAttrs.length - 1; i++){
           const attr = target.getAttribute(targetAttrs[i])
           const attrVar = varAttrs[i].attr
           const attrName = varAttrs[i].name
           if(attr !== attrVar){
               if(regex.test(attrVar)){
                   const dynamic = eval(attrVar)
                   target.setAttribute(attrName,dynamic)
                }else{
                    target.setAttribute(attrName,attrVar)
                }
            }
        
    }
}


export const handleTextVariables = (target) => {
        const regex = /{{.*}}/gi
        if(regex.test(target.nodeValue))   {
            target.nodeValue = eval(target.nodeValue)
        }
}

export const handleAllVariables = (mountPoint) => {
    const root = document.querySelector(mountPoint),
    iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT)
    let textnode;


while (textnode = iter.nextNode()) {
        const regex = /{{.*}}/gi
        const validNodes = textnode.textContent.match(regex)
        if(validNodes){
            validNodes.forEach(n => {
                textnode.textContent = eval(n)
            })
        }
    }
}
export const handleVariables = (target) => {
        const regex = /{{.*}}/gi
        const extract = (childNodes) => {
            const n = [...childNodes].filter((child) => child.nodeType === Node.TEXT_NODE)
            return n
          }
        const targetNodes = extract(target.childNodes)
        targetNodes.forEach(i => {
            const current = targetNodes.find(n => n.n_index === i.n_index)
            if(current.nodeValueVar === current.nodeValue){
                current.nodeValue = current.nodeValue
            }else{
                current.nodeValue = eval(currentSaved.nodeValueVar)
            }
        })
        
}
// export const createDOMMap = (mountPoint) =>{
//     const app = document.querySelector(mountPoint)
//     return app.outerHTML
// };

export const createDOMMap = (mountPoint) => {
    const root = document.querySelector(mountPoint)
    const iter = document.createNodeIterator(root)
    let node
    let map = []
    let id = 1
    const regex = /{{.*}}/
    while (node = iter.nextNode()) {
        let el = {}
        node.n_index = `node-${id}`
        if(node.nodeName === "#text"){
           el.parent_index = node.parentElement.n_index
           el.tag = node.nodeName.toLocaleLowerCase()
           el.attrs = []
           el.children = []
           el.className = ""
           el.isUpdated = false
           el.nodeValue = node.nodeValue
           el.nodeValueVar = node.nodeValue
           el.n_index = node.n_index
           el.id = null
           map.push(el)
        }else{
            if(node.nodeType !== 8){
                node.setAttribute('data-node_id',`node-${id}`)
            const attrs = node.getAttributeNames()
            function setAttrs(attrs,isVar){
                let allAttrs = []
                const nodeAttr = {name:'data-node_id',attr:`node-${id}`}
                allAttrs.push(nodeAttr)
                attrs.forEach((name)=>{
                    const attr = node.getAttribute(name)
                    if(isVar){
                        allAttrs.push({name,attr})
                    }else{
                        if(regex.test(attr)){
                            allAttrs.push({name,attr:eval(attr)})
                        }else{
                            allAttrs.push({name,attr})
                        }
                    }
                })
                return allAttrs
           }
            el.tag = node.nodeName.toLocaleLowerCase()
            el.attrs = setAttrs(attrs,true)
            el.attrsVar = setAttrs(attrs,true)
            el.childNodesVar = [...node.childNodes]
            el.parent_index = node.parentElement.n_index
            el.className = node.className
            el.n_index = node.n_index
            el.id = node.id
            el.isUpdated = false
            map.push(el)
        }
        }
        id++
    }
    return map
}

export const renderDOM = (DOMmap,mountPoint) =>{
    DOMmap.forEach((node,index) => {
        if(node.tag === '#text'){
            const text = document.createTextNode(node.nodeValueVar)
            const elMap = [...document.querySelectorAll(`${mountPoint} *`)]
            const parent = elMap.find(n => n.dataset.node_id === node.parent_index)
            text.n_index = node.n_index
            text.nodeValueVar = node.nodeValueVar
            text.isUpdated = node.isUpdated
            parent.appendChild(text)
        }
        else{
           const el = document.createElement(node.tag)
           el.isUpdated = node.isUpdated
           node.attrs.forEach(a => {
              el.setAttribute(a.name,a.attr)
           })
           if(el.className){
               el.className = node.className 
            }
           if(el.id){
               el.id = node.id
            }
           if(el.id === '#app'){
             const app = document.querySelector('#app')
             app.replaceWith(el)
           }else{
               const elMap = [...document.querySelectorAll(`${mountPoint} *`)]
               const parent = elMap.find(n => n.dataset.node_id === node.parent_index)
               const sameEl = elMap.find(n => n.dataset.node_id === node.n_index)
               const childrenWithoutNodeId = parent?.childNodes
               childrenWithoutNodeId?.forEach(c => {
                 if(c.dataset !== undefined){
                     if(!c.dataset.node_id){
                         c.remove()
                        }
                    }
               })
               if(index !== 0){
                if(sameEl){
                    sameEl.replaceWith(el)
                }else{
                    parent.appendChild(el)
                }
                }
           }
        }
    })
}

