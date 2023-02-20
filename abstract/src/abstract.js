window.Magic = class Magic{
    constructor (state = {}) {
        this.v = state
        return new Proxy(this.v,this);
    }
    set (target,prop,val) {
        target[prop] = val
        setTimeout(()=>{
            if(window.map){
                updateDOMNode(map,nodesMap,prop)
            }
        },1)
        return true
    }
    get (target, prop) {
        return target[prop] || '';
    }
}
window.createComponent = function({tagName,stateName,state = {}, observedProps = [],observedAttrs = [],staticProps = {} ,render = (props) =>{},methods = {},mountedCallback = () => {},changedCallback = ()=>{},unMountedCallback = () =>{}}){
    if(Object.keys(methods).length > 0 && Object.keys(state).length === 0){
        window[stateName] = {
            methods:new Magic(methods)
        }
    }
    if(Object.keys(state).length > 0 && Object.keys(methods).length === 0){
        window[stateName] = {
            state:new Magic(state)
        }
    }
    if(Object.keys(state).length > 0 && Object.keys(methods).length > 0){
        window[stateName] = {
            state:new Magic(state),
            methods:new Magic(methods)
        }
    }
    class Component extends HTMLElement {
        static componentName = tagName
        constructor(){
            super()
            this.mainChild = document.createElement('div')    

        }
        static get observedAttributes(){
            return observedAttrs.concat(observedProps.map(p => '::' + p))
        }
        connectedCallback() {
            this.getProps()
            mountedCallback()
            setAttributes(this,this.mainChild)
            this.setComponent()
        }
   
        attributeChangedCallback(name, oldValue, newValue){
            this.getProps()
            changedCallback(name,oldValue, newValue)
        }
        disconnectedCallback(){
            unMountedCallback()
        }
        getProps(){
            const propNames = this.getAttributeNames()
            const regex = /^::/gi
            const isHaveProps = propNames.filter(p => p.slice(0,2) == "::")
            if(window[stateName]?.props){
                propNames.filter(p => p !== 'data-node_id').forEach(p => {
                    if(regex.test(p)){
                        const val = this.getAttribute(p)
                        window[stateName]['props'][p.slice(2,p.length)] = val
                    }
                 
                })
            }else{
                if(Object.keys(state).length === 0 && Object.keys(methods).length === 0 && isHaveProps.length > 0){
                    window[stateName] = {
                        props:new Magic()
                    }
                } else if(Object.keys(state).length > 0 && Object.keys(methods).length === 0 && isHaveProps.length === 0){
                    window[stateName] = {
                        state:window[stateName]['state'],
                    }
                }else if(Object.keys(state).length === 0 && Object.keys(methods).length > 0 && isHaveProps.length === 0){
                    window[stateName] = {
                        methods:window[stateName]['methods']
                    }
                }
                else if(Object.keys(state).length > 0 && Object.keys(methods).length === 0 && isHaveProps.length > 0){
                    window[stateName] = {
                        state:window[stateName]['state'],
                        props:new Magic()
                    }
                }else if(Object.keys(state).length > 0 && Object.keys(methods).length > 0 && isHaveProps.length === 0){
                    window[stateName] = {
                        methods:window[stateName]['methods'],
                        state:window[stateName]['state'],
                    }
                }else if(Object.keys(state).length === 0 && Object.keys(methods).length > 0 && isHaveProps.length === 0){
                    window[stateName] = {
                        methods:window[stateName]['methods'],
                        props:new Magic(),
                    }
                }else if(Object.keys(state).length > 0 && Object.keys(methods).length > 0 && isHaveProps.length > 0){
                    window[stateName] = {
                        props:new Magic(),
                        state:window[stateName]['state'],
                        methods:window[stateName]['methods']
                    }
                }
                propNames.filter(p => p !== 'data-node_id').forEach(p => {
                    if(regex.test(p)){
                        const val = this.getAttribute(p)
                        window[stateName]['props'][p.slice(2,p.length)] = val
                    }
                })
            }
        }
        setComponent(){
                while (this.firstChild) {
                    this.removeChild(this.lastChild);
                }
                this.mainChild.innerHTML = render(staticProps)
                this.appendChild(this.mainChild)
            }
    }
    mount([Component])     
}
window.createStore = (initialValue = {}) =>{
    return new Magic(initialValue)
}
window.addStyles = (styles) => {
    const stylesTag = document.head.querySelector('style')
    stylesTag.textContent += styles
}
window.insertStyles = (styles,className) => {
    const stylesTag = document.head.querySelector('style')
    const regex = new RegExp(`${className}`)
    const index =  regex.exec(stylesTag.textContent).index
    const step = className.length + 1
    const result = stylesTag.textContent.slice(0,index + step) + styles + stylesTag.textContent.slice(index+step+styles.length,stylesTag.textContent.length);
    stylesTag.innerHTML = result
}
window.handleAllEvents = (mountPoint) =>{
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
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
                    e.stopPropagation();
                    e.preventDefault();
                    ev.fn(e)
            })
        })
    }
}
window.handleRemoveEvents = (mountPoint) =>{
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
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
                node.removeEventListener(ev.name,(e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    ev.fn(e)
            })
        })
    }
}
window.setChildren = (node,element) => {
    [...node.childNodes].filter(n => n !== element).forEach((c,index)=>{
            element.appendChild(c)
        })
}
window.setAttributes = (node,element) => {
    const attrs = node.getAttributeNames()
    attrs.forEach(a => {
        const regex = /^:/
        const isTwoRegex = /^::/
        const regexTwo = /^e:/

        function checkIfOne(string) {
            const matches = string.match(isTwoRegex)
            if(matches?.length === 0){
                return false
            }else if(matches?.length === 1){
                return true
            }
        }
        
        const isOne = checkIfOne(a)
        if(!isOne){
            if(regex.test(a)){
                const attr = node.getAttribute(a)
                element.setAttribute(a.slice(1,a.length),attr)
            }
        }
        if(regexTwo.test(a)){
            const attr = node.getAttribute(a)
            element.setAttribute('on:' + a.slice(2,a.length),attr)
        }
    })
    
}
window.handleAllAttributes = (mountPoint) => {
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
    const iter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT)
    let node
    while (node = iter.nextNode()) {
        const attrs = node.attrsVars

        if(attrs?.length > 0){
        attrs.forEach(a => {
            const regex = /{{(.*?).(.*?)}}/gi
            const matches = a.attr.match(regex)?.filter(a => a !== undefined || a !== null)
                let validValue = a.attr
                node.removeAttribute(a.name)
                    if(matches?.length > 0){
                        matches.forEach(m => {
                            const val = eval(m)
                            validValue = validValue.replaceAll(m,val)
                        })
                    }
                node.setAttribute(a.name,validValue)
        })
    }
}
}
window.handleAllVariables = (mountPoint) => {
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
    iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT)
    let textnode;
  
    while (textnode = iter.nextNode()) {
        const regex = /{{(.*?).(.*?)}}/gi
        const validNodes = textnode.textContent.match(regex)?.filter(n => n !== null)
        if(validNodes?.length > 0){
            let validString = textnode.textContent
            validNodes.forEach(n => {
                let val = eval(n)
                validString = validString.replaceAll(n,val)
            })
            textnode.textContent = validString
        }else{
            const matches = textnode.nodeValueVar?.match(regex)?.filter(n => n !== null)
            let validString = textnode.nodeValueVar
            if(matches?.length > 0){
                matches.forEach(n => {
                    let val = eval(n)
                    validString = validString.replaceAll(n,val)
                })
                textnode.nodeValue = validString
            }
        }
    }
}
window.isInMap = (target) => {
    if(window.map){
       const isInMap = window.map.filter(n => n.n_index === target.n_index)
       if(isInMap.length > 0){
         return true
       }else{
         return false
       }
    }
}
window.createMountedNodesMap = (mountPoint) => {
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
    const iter = document.createNodeIterator(root)
    let nodes =[]
    while (node = iter.nextNode()) {
        nodes.push(node)
    }
    return nodes
}
window.createDOMMap = (mountPoint) => {
    let root
    if(typeof mountPoint === 'string'){
        root = document.querySelector(mountPoint)
    }else{
        if(mountPoint.nodeType !== 3){
            root = mountPoint
        }
    }
    let map = []
    if(root !== undefined){
    const iter = document.createNodeIterator(root)
    let node
    let id 
    const createMap = (root) => {
        const regex = /{{(.*?).(.*?)}}/gi
        while (node = iter.nextNode()) {
            let el = {}
            node.n_index = `node-${id}`
            if(node.nodeName === "#text"){
               el.parent_index = node.parentElement.n_index
               el.tag = node.nodeName.toLocaleLowerCase()
               el.attrs = []
               el.children = []
               el.className = ""
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
                    if(attrs?.length > 0){
                        attrs.forEach((name)=>{
                            const attr = node.getAttribute(name)
                            if(isVar){
                                allAttrs.push({name,attr})
                            }else{
                                if(regex.test(attr)){
                                    const matches = attr.match(regex).filter(a => a !== undefined && a !== null)
                                    let validValue = attr
                                    if(matches?.length > 0){
                                        matches.forEach(m => {
                                            const val = eval(m)
                                            validValue = validValue.replaceAll(m,val)
                                        })
                                    }
                                    allAttrs.push({name,attr:validValue})
                                }else{
                                    allAttrs.push({name,attr})
                                }
                            }
                        })
                    }
                    return allAttrs
               }
                el.tag = node.nodeName.toLocaleLowerCase()
                el.attrs = setAttrs(attrs,false)
                el.attrsVars = setAttrs(attrs,true)
                el.childNodesVar = [...node.childNodes]
                el.parent_index = node.parentElement.n_index
                el.className = node.className 
                el.n_index = node.n_index
                el.id = node.id
                map.push(el)
            }
            }
            id++
        }
        return map
    }
    if(window.map){
        let isIn = isInMap(root)
        const parentElementTagName = root.parentElement.tagName.toLocaleLowerCase()
        const parentElement = root.parentElement
        const regex = /([a-z+])\-([a-z]+)/
        const isFromUI = regex.test(parentElementTagName)
       if(isIn === false && !isFromUI ){
           id = window.map.length
           return createMap(root)
       }
    }else{
        id = 1
        return createMap(root)
     }
   
    }
}
window.renderDOM = (DOMmap,mountPoint) =>{
    DOMmap.forEach((node,index) => {
        if(node.tag === '#text'){
            const text = document.createTextNode(node.nodeValueVar)
            const elMap = [...document.querySelectorAll(`${mountPoint} *`)]
            const parent = elMap.find(n => n.dataset.node_id === node.parent_index)
            text.n_index = node.n_index
            text.nodeValueVar = node.nodeValueVar
            parent.appendChild(text)
        }
        else{
           const el = document.createElement(node.tag)
           node.attrs.forEach(a => {
                el.setAttribute(a.name,a.attr)
           })
           el.attrsVars = node.attrsVars
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
window.updateDOMNode = (map,nodesMap,variable) => {
  const validName = new RegExp(`{{(.*?).${variable}}}`,'gi')
  const virtualDOMValidNodes = map.filter(n => {
    if(n.nodeValueVar){
        if(n.nodeValueVar.match(validName)?.length > 0){
          return n
      }
  }}).filter(n => n !== undefined && n !== null)
  const validTextNodes = virtualDOMValidNodes.map(v =>{
      const validTextNode = nodesMap.find(n => n.n_index === v.n_index)
      if(validTextNode){
            validTextNode.nodeValueVar = v.nodeValueVar
            return validTextNode
        }
    })
            
  const validAttrsOfDomNodes = nodesMap.filter(n => n.nodeType !== 3).map(n => {
   if(n.attrsVars){
       const isVar = n.attrsVars.map(a => {
           if(validName.test(a.attr)){
               return a
           }
        }).filter(a => a?.name !== undefined)
      if(isVar.length > 0){
        return n
      }
    }
  }).filter(n => n !== undefined)
  if(validTextNodes.length > 0){
      validTextNodes.forEach(n => {
        if(n?.nodeValue){
            n.nodeValue = ""
            const validName = new RegExp(`{{(.*?).(.*?)}}`,'gi')
            const matches = n.nodeValueVar.match(validName)
            let varString = n.nodeValueVar
            matches.forEach(m => {
                const value = eval(m)
                varString = varString.replaceAll(m,value)            
            })
            n.nodeValue = varString
        }
       })
  }

  validAttrsOfDomNodes.forEach(n => {
      n.attrsVars.forEach(a => {
        const validName = new RegExp(`{{(.*?).(.*?)}}`,'gi')
        const matches = a.attr.match(validName)
        let validString = a.attr
        let prevAttr = n.getAttribute(a.name)
        n.removeAttribute(a.name)
        const rest = prevAttr.split(' ')
        const validStringRest = validString.split(' ')
       
        let rest_attrs = []
        for(let i = 0; i < rest.length; i++){
            if(validStringRest[i] !== undefined){
            }else{
                rest_attrs.push(rest[i])
            }
        }
        let rest_attrs_valid_string = []
        for(let i = 0; i < rest.length; i++){
            if(validStringRest[i] !== undefined){
                rest_attrs_valid_string.push(validStringRest[i])
            }
        }
        if(rest_attrs_valid_string.length > 0 && rest_attrs.length === 0){
            validString = ''
            for(let i = 0; i < rest_attrs_valid_string.length;i++){   
                if(rest_attrs_valid_string[i] !== rest_attrs_valid_string[i+1]){
                    if(rest_attrs_valid_string[i+1] !== undefined){
                        validString = validString + " " + rest_attrs_valid_string[i]
                    }else{
                        if(rest_attrs_valid_string[i+1] === undefined){
                            if(validString.split(' ').filter(el => el === rest_attrs_valid_string[i]).length === 0){
                                validString = validString + " " + rest_attrs_valid_string[i]
                            }
                        }
                    }
                }
            }
        }
        if(rest_attrs.length > 0){
            rest_attrs.forEach(a =>{
                const isInRegex = new RegExp(`${a}`,'gi')
                if(!isInRegex.test(validString)){
                    validString = validString + " " + a
                }
            })
        }
        if(matches?.length > 0){
            matches.forEach(m => {
                const val = eval(m)
                validString = validString.replaceAll(m,val)
            })
        }

        n.setAttribute(a.name,validString)
      })
  })
}
window.DOMobserver = new MutationObserver((mutation)=>{
    const regex = /{{(.*?).(.*?)}}/gi
    mutation.forEach(m => {
        const addedNodes = m.addedNodes
        addedNodes.forEach(n => {
            const isIn = isInMap(n)
            if(isIn === false && n.nodeType !== 3){
                const updatedMap = createDOMMap(n)
                const updatedNodesMap = createMountedNodesMap(n)
                if(updatedMap){
                    const isMatch = window.map.filter(i => {
                        updatedMap.forEach(n =>{
                           return i.n_index === n.n_index
                        })
                    })
                    if(isMatch.length === 0){
                        window.map = [...window.map,...updatedMap]
                        window.nodesMap = [...window.nodesMap,...updatedNodesMap]
                    }
               }
            }
            if(n.nodeType !== 3){
                const attrs = n.getAttributeNames()
                const attrsVars = attrs.map(a => {
                    const val = n.getAttribute(a)
                    const attrVar = {
                        name:a,
                        attr:val
                    }
                    return attrVar
                })
                if(!n?.attrsVars){
                    n.attrVars = attrsVars
                }
                if(n.childNodes){
                    [...n.childNodes].filter(n => n.nodeType === 3).forEach(n => {
                        if(n?.nodeValueVar){ 
                            n.nodeValueVar = n.nodeValue
                        }
                        if(n?.nodeValueVar){
                            const isIn = isInMap(n)
                            if(!isIn){
                                const updatedMap = createDOMMap(n)
                            }
                            let validTextContent = n.nodeValueVar
                            const matches = n.nodeValueVar.match(regex)?.filter(a => a !== undefined || a !== null)
                            if(matches?.length > 0){
                                matches.forEach(m => {
                                    const val = eval(m)
                                    validTextContent = validTextContent.replaceAll(m,val)
                                })
                            }
                            n.nodeValue = validTextContent
                        }else{
                            let validTextContent = n.nodeValue
                            const matches = n.nodeValue.match(regex)?.filter(a => a !== undefined || a !== null)
                            n.nodeValueVar = n.nodeValue
                            if(matches?.length > 0){
                                matches.forEach(m => {
                                    const val = eval(m)
                                    validTextContent = validTextContent.replace(m,val)
                                })
                                n.nodeValue = validTextContent
                            }
                        }
                        
                    })
                  
                    // window.nodesMap = createMountedNodesMap('#root')
                }
           
                else if(n.nodeType === 3){
                    let matches
                    if(n?.nodeValueVar){
                       matches = n.nodeValueVar.match(regex)?.filter(a => a !== undefined || a !== null)
                    }else{
                        matches = n.nodeValue.match(regex)?.filter(a => a !== undefined || a !== null)
                    }
                    if(matches?.length > 0){
                        matches.forEach(m => {
                            const val = eval(m)
                            validTextContent = validTextContent.replaceAll(m,val)
                        })
                        n.nodeValue = validTextContent
                    }
                }
                if(attrs?.length > 0){
                    attrsVars.forEach(a => {
                        const matches = a.attr.match(regex)?.filter(a => a !== undefined || a !== null)
                        n.removeAttribute(a.name)
                        let validValue = a.attr
                        if(matches?.length > 0){
                            matches.forEach(m => {
                                const val = eval(m)
                                validValue = validValue.replaceAll(m,val)
                            })
                        }
                        n.setAttribute(a.name,validValue)
                    })              
                }
            }else if(n.nodeType === 3){
                const matches = n.nodeValueVar?.match(regex)?.filter(n => n !== null || n !== undefined) 
                let validString = n.nodeValueVar
                if(matches?.length > 0){
                    matches.forEach(m => {
                    let val = eval(m)
                    validString = validString.replaceAll(n,val)
                   })
                   n.nodeValue = validString
                }
            }   
        })
    })
})
window.handleObserve = (mountPoint) => {
    const root = document.querySelector(mountPoint)
    DOMobserver.observe(root, {subtree:true,childList:true})
}
window.startDynamic = (rootMountPointId,mapMountPointId) =>{
    const mapMount = document.querySelector(mapMountPointId)
    const rootMount = document.querySelector(rootMountPointId)
    if(mapMount && rootMount){
        window.map = createDOMMap(mapMountPointId)
        renderDOM(window.map,rootMountPointId)
        window.nodesMap = createMountedNodesMap(rootMountPointId)
        setTimeout(() => {
            handleObserve(rootMountPointId)
            handleAllEvents(rootMountPointId)
            handleAllVariables(rootMountPointId)
            handleAllAttributes(rootMountPointId)
        }, 100);
    }
}




