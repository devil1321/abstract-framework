CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}
class GlobalSetup {
    constructor(classes,root,animationTime,cssAnimationTime,cssShadowAnimationTime){
        this.classes = classes
        this.root = root
        this.animationTime = animationTime
        this.cssAnimationTime = cssAnimationTime
        this.cssShadowAnimationTime = cssShadowAnimationTime
    }
}
class Utils {
    constructor(){
        this.allEls = document.body.querySelectorAll('*')
        this.Matrix_Class = class Matrix {
            constructor(){
                this.rotationX = undefined
                this.rotationY = undefined
                this.rotationZ = undefined
                this.translation = undefined
                this.scale = undefined
                this.projection = undefined
                this.perspective = undefined
            }
        
            createPerspective(fieldOfViewInRadians,aspectRatio,near,far){
                const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
                const rangeInv = 1 / (near - far);
                this.perspective = [
                    f / aspectRatio,0,0,0,
                    0,f,0,0,
                    0,0,(near + far) * rangeInv,-1,
                    0,0,near * far * rangeInv * 2,0,
                  ];
                };
        
            createProjection(scaleFactor){
                this.projection = [ 
                    1,0,0,0,
                    0,1,0,0,
                    0,0,1,scaleFactor,
                    0,0,0,scaleFactor,
                ]
            }
        
            createRotationX(angle){
                this.rotationX = [
                    1, 0, 0, 0,
                    0, Math.cos(angle), -Math.sin(angle), 0,
                    0, Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 0, 1
                ]
            }
            createRotationY(angle){
                this.rotationY = [
                    Math.cos(angle), 0, Math.sin(angle), 0, 
                    0, 1, 0, 0, 
                    -Math.sin(angle), 0, Math.cos(angle), 0, 
                    0, 0, 0, 1
                ]
            }
            createRotationZ(angle){
                this.rotationZ = [
                    Math.cos(angle), -Math.sin(angle), 0, 0,
                    Math.sin(angle), Math.cos(angle), 0, 0,
                    0, 0, 1, 0, 
                    0, 0, 0, 1
                ]
            }
            createTranslation(x,y,z){
                this.translation = [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0, 
                    x, y, z, 1
                ]
            }
            createScale(w,h,d){
                this.scale = [
                    w, 0, 0, 0,
                    0, h, 0, 0,
                    0, 0, d, 0,
                    0, 0, 0, 1
                ];
            }
            multiplyMatrices(matrixA, matrixB) {
                // Slice the second matrix up into rows
                let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
                let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
                let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
                let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];
              
                // Multiply each row by matrixA
                let result0 = this.multiplyMatrixAndPoint(matrixA, row0);
                let result1 = this.multiplyMatrixAndPoint(matrixA, row1);
                let result2 = this.multiplyMatrixAndPoint(matrixA, row2);
                let result3 = this.multiplyMatrixAndPoint(matrixA, row3);
              
                // Turn the result rows back into a single matrix
                return [
                  result0[0],
                  result0[1],
                  result0[2],
                  result0[3],
                  result1[0],
                  result1[1],
                  result1[2],
                  result1[3],
                  result2[0],
                  result2[1],
                  result2[2],
                  result2[3],
                  result3[0],
                  result3[1],
                  result3[2],
                  result3[3],
                ];
              }
            multiplyMatrixAndPoint(matrix, point) {
            // Give a simple variable name to each part of the matrix, a column and row number
            let c0r0 = matrix[0],
              c1r0 = matrix[1],
              c2r0 = matrix[2],
              c3r0 = matrix[3];
            let c0r1 = matrix[4],
              c1r1 = matrix[5],
              c2r1 = matrix[6],
              c3r1 = matrix[7];
            let c0r2 = matrix[8],
              c1r2 = matrix[9],
              c2r2 = matrix[10],
              c3r2 = matrix[11];
            let c0r3 = matrix[12],
              c1r3 = matrix[13],
              c2r3 = matrix[14],
              c3r3 = matrix[15];
          
            // Now set some simple names for the point
            let x = point[0];
            let y = point[1];
            let z = point[2];
            let w = point[3];
          
            // Multiply the point against each part of the 1st column, then add together
            let resultX = x * c0r0 + y * c0r1 + z * c0r2 + w * c0r3;
          
            // Multiply the point against each part of the 2nd column, then add together
            let resultY = x * c1r0 + y * c1r1 + z * c1r2 + w * c1r3;
          
            // Multiply the point against each part of the 3rd column, then add together
            let resultZ = x * c2r0 + y * c2r1 + z * c2r2 + w * c2r3;
          
            // Multiply the point against each part of the 4th column, then add together
            let resultW = x * c3r0 + y * c3r1 + z * c3r2 + w * c3r3;
          
            return [resultX, resultY, resultZ, resultW];
          }
        
        }
        this.Circle_Class = class Circle {
            constructor(ctx, x, y, vx, vy,accX,accY,c,r){
                this.ctx = ctx
                this.x = x
                this.y = y
                this.r = r
                this.fx = x
                this.fy = y
                this.dx = 0
                this.dy = 0
                this.accX = accX
                this.accY = accY
                this.vx = vx
                this.vy = vy
                this.c = c
            }
            draw(mousePos){
                // this.r += 0.2
                // this.x = this.x + Math.cos(this.r) * 5
                // this.y = this.y + Math.sin(this.r) * 5
                // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
                // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
                this.ctx.fillStyle =`rgba(0,0,255,1)`
                this.ctx.beginPath()
                this.ctx.arc(mousePos.x,mousePos.y, 20, 0, 2 * Math.PI);
                this.ctx.closePath()
                this.ctx.fill()
            }
            update(){
                this.accX = (this.fx - this.x) / 300;
                this.accY = (this.fy - this.y) / 300;
                this.vx += this.accX * 10;
                this.vy += this.accY * 10;
                // this.x += this.vx;
                // this.y += this.vy;
                // this.x += Math.floor(Math.random() * (this.vx + this.vx)) - this.vx 
                // this.y += Math.floor(Math.random() * (this.vy + this.vy)) - this.vy 
            }
        }
       
    }
    cancelAllAnimationFrames(){
        var id = window.requestAnimationFrame(function(){});
        while(id--){
          window.cancelAnimationFrame(id);
        }
    }
    setPixel(imageData, x, y, r, g, b, a) {
        var index = 4 * (x + y * imageData.width);
        imageData.data[index+0] = r;
        imageData.data[index+1] = g
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }
    splitArrayIntoChunksOfLen(arr, len) {
        var chunks = [], i = 0, n = arr.length;
        while (i < n) {
          chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    } 
    rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
    hexToRgbArr(hex){
        if(hex.slice(1,hex.length).length !== 6){
            throw new Error("Only six-digit hex colors are allowed.");
        }
    
        const aRgbHex = hex.slice(1,hex.length).match(/.{1,2}/g);
        const rgb = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ];
        return rgb;
    }
    colorToRgbArray(c){
        let colors
       const isHex = /^#/
       const rgb = /(.*?)rgb\((\d+), (\d+), (\d+)\)/
        const rgba = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/
        if(rgb.test(c) && !isHex.test(c)){
            colors = rgb.exec(c)
        }else if(rgba.test(c) && !isHex.test(c)){
            colors = rgba.exec(c)
        }else{
            return framework.utils.hexToRgbArr(c)
        }
        const red = parseInt(colors[2])
        const green = parseInt(colors[3])
        const blue = parseInt(colors[4])
        const opacity = parseInt(colors[5])
        return [red,green,blue,opacity]
    }
    handleColorLuma(c){
        const rgb = /(.*?)rgb\((\d+), (\d+), (\d+)\)/
        const rgba = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/
        let colors
        if(rgb.test(c)){
            colors = rgb.exec(c)
        }else if(rgba.test(c)){
            colors = rgba.exec(c)
        }
        const red = parseInt(colors[2])
        const green = parseInt(colors[3])
        const blue = parseInt(colors[4])
        let color = framework.utils.rgbToHex(red,green,blue)
        color = color.substring(1);    
        const rgbColor = parseInt(color, 16);
        const r = (rgbColor >> 16) & 0xff;  
        const g = (rgbColor >>  8) & 0xff;
        const b = (rgbColor >>  0) & 0xff; 
        return {
            luma:0.2126 * r + 0.7152 * g + 0.0722 * b, // per ITU-R BT.709
            color:color
        }
    }
    handleTransitionIn(target){
        if(target.dataset.transition_in){
            return `${target.dataset.transition_in} ${framework.globalSetup.cssAnimationTime}s ease-in-out forwards`
       }else{
           return `fadeIn ${framework.globalSetup.cssAnimationTime}s ease-in-out forwards`
       }
    }
    handleTransitionOut(target){
        if(target.dataset.transition_out){
            return `${target.dataset.transition_out} ${framework.globalSetup.cssAnimationTime}s ease-in-out forwards`
       }else{
           return `fadeOut ${framework.globalSetup.cssAnimationTime}s ease-in-out forwards`
       }
    }
    getStyle(className){
        var cssText = "";
        var classes = document.styleSheets[0].cssRules;
        for (var x = 0; x < classes.length; x++) {        
            if (classes[x].selectorText === className) {
                cssText += classes[x].cssText || classes[x].style.cssText;
            }
        }
        return cssText;
    }
    handleTransforms(){
        this.allEls.forEach(el =>{
            const classes = el.classList
            const transforms = [...classes].map(c =>{
                const regex = /transform:(.*?)\)/gi
                const transform = framework.utils.getStyle(`.${c}`)
                if(regex.test(transform)){
                    return transform.match(regex)
                }else{
                    return
                }
            }).filter(t => t !== undefined && t !== null).flat()
            const correctTransform = transforms.join().replaceAll('transform:','').replaceAll(',','')
            if(transforms.length > 0){
                el.style.transform = correctTransform
            }
        })
    }
    handlePositionRules(){
        this.allEls.forEach(el =>{
            const classRule = [...el.classList].find(c => c === 'top-left' || c === 'top-right' || c === 'bottom-left' || c === 'bottom-right')
            let parent = el
    
            while(parent?.classList?.contains('relative') && parent.id !== '#root' && parent !== document.querySelector('body')){
                parent = parent.parentElement
            }
    
            switch(classRule){
                case 'top-left':
                    el.style.top = -parent.clientHeight * 0.5 + 'px'
                    el.style.left = -parent.clientWidth * 0.5 + 'px'
                    break
                case 'bottom-left':
                    el.style.bottom = -parent.clientHeight * 0.5 + 'px'
                    el.style.left = -parent.clientWidth * 0.5 + 'px'
                    break
                case 'top-right':
                    el.style.top = -parent.clientHeight * 0.5 + 'px'
                    el.style.right = -parent.clientWidth * 0.5 + 'px'
                    break
                case 'bottom-right':
                    el.style.bottom = -parent.clientHeight * 0.5 + 'px'
                    el.style.right = -parent.clientWidth * 0.5 + 'px'
                    break
                default:
                    return
            }
        })
    }
    getTextLines(ctx,text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}
class Props {
    constructor(selector,card,item){
        if(this.card){
            this.el = card.parentElement.querySelector(`${selector}`)
        }else{
            this.el = item
        }
        if(this.el){
            this.child = this.el.querySelector(':scope *')
            if(this.el.children.length > 1){
                this.children = this.el.querySelectorAll(':scope *')
            }
        }
    }

    parseMarginPadding(el,property){
            let  valueTop
            let valueRight
            let valueBottom
            let valueLeft
            if(property === 'margin'){
                valueTop = getComputedStyle(el).marginTop.replace('px','')
                valueRight = getComputedStyle(el).marginRight.replace('px','')
                valueBottom = getComputedStyle(el).marginBottom.replace('px','')
                valueLeft = getComputedStyle(el).marginLeft.replace('px','')
            }else if(property === 'padding'){
                valueTop = getComputedStyle(el).paddingTop.replace('px','')
                valueRight = getComputedStyle(el).paddingRight.replace('px','')
                valueBottom = getComputedStyle(el).paddingBottom.replace('px','')
                valueLeft = getComputedStyle(el).paddingLeft.replace('px','')
            }
           
            const m = {
                top:Number(valueTop),
                right:Number(valueRight),
                bottom:Number(valueBottom),
                left:Number(valueLeft),
            }
            return m
    }

    getY(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.offsetTop
        }else{
            return this.child.offsetTop
        }
    }
    getX(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.offsetLeft
        }else{
            return this.child.offsetLeft
        }
    }
    getRect(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.getBoundingClientRect()
        }else{
            return this.child.getBoundingClientRect()
        }
        
    }
    getWidth(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.offsetWidth
        }else{
            return this.child.offsetWidth
        }
    }
    getHeight(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.offsetHeight
        }else{
            return this.child.offsetHeight
        }
        
    }
    getText(isChild){
        if(!isChild && isChild !== 'child'){
            return this.el.textContent.trim()
        }else{
            return this.child.textContent.trim()
        }
    }
    getFont(isChild){
        if(!isChild && isChild !== 'child'){
            return getComputedStyle(this.el).font
        }else{
            return getComputedStyle(this.child).font
        }
    }
    getFontSize(isChild){
        if(!isChild && isChild !== 'child'){
            return Number(getComputedStyle(this.el).fontSize.replace('px',''))
        }else{
            return Number(getComputedStyle(this.child).fontSize.replace('px',''))
        }
    }
    getTextAlign(isChild){
        if(!isChild && isChild !== 'child'){
            return getComputedStyle(this.el).textAlign
        }else{
            return getComputedStyle(this.child).textAlign
        }
    }
    getLineHeight(isChild){
        const regex = /px/gi
        if(!isChild && isChild !== 'child'){
            const lineHeight = getComputedStyle(this.el).lineHeight
            if(regex.test(lineHeight)){
                return Number(lineHeight.replace('px','')) 
            }else{
                return 24 / 1.3
            }
        }else{
            const lineHeight = getComputedStyle(this.child).lineHeight
            if(regex.test(lineHeight)){
                return Number(lineHeight.replace('px','')) 
            }else{
                return 24 / 1.3
            }
        }
    }
    getTextPos(isChild){
        const range = document.createRange();
        if(!isChild && isChild !== 'child'){
            range.selectNode(this.el.firstChild);
            return range.getBoundingClientRect()

        }else{
            range.selectNode(this.child.firstChild);
            return range.getBoundingClientRect()
        }
    }
   
    getBorderRadius(isChild){
        if(!isChild && isChild !== 'child'){
            return {
                upperLeft:Number(getComputedStyle(this.el).borderTopLeftRadius.replace('px','')),
                upperRight:Number(getComputedStyle(this.el).borderTopRightRadius.replace('px','')),
                lowerLeft:Number(getComputedStyle(this.el).borderBottomLeftRadius.replace('px','')),
                lowerRight:Number(getComputedStyle(this.el).borderBottomRightRadius.replace('px',''))
            }
        }else{
             return {
                upperLeft:Number(getComputedStyle(this.child).borderTopLeftRadius.replace('px','')),
                upperRight:Number(getComputedStyle(this.child).borderTopRightRadius.replace('px','')),
                lowerLeft:Number(getComputedStyle(this.child).borderBottomLeftRadius.replace('px','')),
                lowerRight:Number(getComputedStyle(this.child).borderBottomRightRadius.replace('px',''))
            }
        }
    }
    getBackground(isChild){
        if(!isChild && isChild !== 'child'){
            const arr = framework.utils.colorToRgbArray(getComputedStyle(this.el).background)
            if(arr[5]){
                return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
            }else{
                return `rgb(${arr[0]},${arr[1]},${arr[2]})`
            }
        }else{
            const arr = framework.utils.colorToRgbArray(getComputedStyle(this.child).background)
            if(arr[5]){
                return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
            }else{
                return `rgb(${arr[0]},${arr[1]},${arr[2]})`
            }
        }
    }
    getColor(isChild){
        if(!isChild && isChild !== 'child'){
            const arr = framework.utils.colorToRgbArray(getComputedStyle(this.el).color)
            if(arr[5]){
                return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
            }else{
                return `rgb(${arr[0]},${arr[1]},${arr[2]})`
            }
        }else{
            const arr = framework.utils.colorToRgbArray(getComputedStyle(this.child).color)
            if(arr[5]){
                return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`
            }else{
                return `rgb(${arr[0]},${arr[1]},${arr[2]})`
            }
        }
    }
    getMargin(isChild){
        if(!isChild && isChild !== 'child'){
            return this.parseMarginPadding(this.el,'margin')
        }else{
            return this.parseMarginPadding(this.child,'margin')
        }
    }
    getPadding(isChild){
        if(!isChild && isChild !== 'child'){
            return this.parseMarginPadding(this.el,'padding')
        }else{
            return this.parseMarginPadding(this.child,'padding')
        }
    }
  
}
class Bubble {
    constructor (isText,ctx, x, y, vx, vy,accX,accY,c,red,green,blue,alpha,size){
        this.isText = isText
        this.ctx = ctx
        this.x = x
        this.y = y
        this.r = Math.random() * 100
        this.r_plus = 0
        this.fx = x
        this.fy = y
        this.dx = 0
        this.dy = 0
        this.friction = 0.98
        this.accX = accX
        this.accY = accY
        this.vx = vx
        this.vy = vy
        this.size = size
        this.c = c
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
        this.matrices = new framework.utils.Matrix_Class()
    }
    draw(){
        this.r += 0.2
        this.ctx.fillStyle = this.c
        this.ctx.beginPath()
        if(this.isText){
            this.ctx.fillRect(this.x,this.y,1,1);
        }else{
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
        // this.ctx.fillRect(this.x,this.y,1,1)
        this.ctx.closePath()
        this.ctx.fill()
    }
    updatePush(circle){
        this.dx = circle.x - this.x
        this.dy = circle.y - this.y
        const distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
        const force = (circle.r - distance) / circle.r

        if(distance < circle.r){
            this.x -= this.dx / distance * force
            this.y -= this.dy / distance * force
        }else{
            if(this.x !== this.fx){
                this.dx = this.x - this.fx
                this.x -= this.dx / 10
            }
            if(this.y !== this.fy){
                this.dy = this.y - this.fy
                this.y -= this.dy / 10
            } 
        }
    }
    updateLean(circle){
        this.dx = circle.x - this.x
        this.dy = circle.y - this.y
        const distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
        const force = (circle.r - distance) / circle.r

        if(distance < circle.r){
            this.x += this.dx / distance * force
            this.y += this.dy / distance * force
        }else{
            if(this.x !== this.fx){
                this.dx = this.x - this.fx
                this.x -= this.dx / 10
            }
            if(this.y !== this.fy){
                this.dy = this.y - this.fy
                this.y -= this.dy / 10
            } 
        }
    }
    updateRotateX(circle){
        this.matrices.createRotationX(circle.y * Math.PI / 180)
        this.matrices.createTranslation(0,-this.ctx.canvas.height / 2,0)
        const withTranslation = this.matrices.multiplyMatrices(this.matrices.rotationX, this.matrices.translation)
        this.matrices.createTranslation(0,this.ctx.canvas.height / 2,0)
        const final = this.matrices.multiplyMatrices(this.matrices.translation, withTranslation)
        const point = this.matrices.multiplyMatrixAndPoint(final,[this.fx,this.fy,0,1])
        this.x = point[0] 
        this.y = point[1] 
    }
    updateRotateY(circle){
        this.matrices.createRotationY(circle.x * Math.PI / 180)
        this.matrices.createTranslation(-this.ctx.canvas.width / 2,0,1)
        const withTranslation = this.matrices.multiplyMatrices(this.matrices.rotationY, this.matrices.translation)
        this.matrices.createTranslation(this.ctx.canvas.width / 2,0,1)
        const final = this.matrices.multiplyMatrices(this.matrices.translation, withTranslation)
        const point = this.matrices.multiplyMatrixAndPoint(final,[this.fx,this.fy,1,1])
        this.x = point[0]
        this.y = point[1]
    }
    updateXY(circle){
        this.matrices.createRotationY(circle.x * Math.PI / 180)
        this.matrices.createRotationX(circle.y * Math.PI / 180)
        const rotation = this.matrices.multiplyMatrices(this.matrices.rotationY,this.matrices.rotationX)
        this.matrices.createTranslation(-this.ctx.canvas.width / 2,-this.ctx.canvas.height / 2,1)
        const withTranslation = this.matrices.multiplyMatrices(rotation, this.matrices.translation)
        this.matrices.createTranslation(this.ctx.canvas.width / 2,this.ctx.canvas.height / 2,1)
        const final = this.matrices.multiplyMatrices(this.matrices.translation, withTranslation)
        const point = this.matrices.multiplyMatrixAndPoint(final,[this.fx,this.fy,1,1])
        this.x = point[0] 
        this.y = point[1]
    }
    updateRotateZ(circle){
        this.matrices.createRotationZ(circle.x * Math.PI / 180)
        this.matrices.createTranslation(-this.ctx.canvas.width / 2,-this.ctx.canvas.height / 2,1)
        const withTranslation = this.matrices.multiplyMatrices(this.matrices.rotationZ, this.matrices.translation)
        this.matrices.createTranslation(this.ctx.canvas.width / 2,this.ctx.canvas.height / 2,1)
        const final = this.matrices.multiplyMatrices(this.matrices.translation, withTranslation)
        const point = this.matrices.multiplyMatrixAndPoint(final,[this.fx,this.fy,1,1])
        this.x = point[0]
        this.y = point[1]
    }
    drawCollectParticles(){
        this.x = this.r * Math.sin(this.r * (Math.PI * 180)) + this.fx
        this.y = this.r * Math.cos(this.r * (Math.PI * 180)) + this.fy
        this.ctx.fillStyle = this.c
        this.ctx.beginPath()
        if(this.isText){
            this.ctx.fillRect(this.x,this.y,1,1);
        }else{
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
        this.ctx.closePath()
        this.ctx.fill()
    }
    updateCollectParticles(){
        if(this.r > 0){
            this.r = this.r - 1
        }else{
            this.r = 0

        }
    }
    drawCollectCircle(){
        this.x = this.r * Math.sin(this.r * (Math.PI * 2 / 180)) + this.fx
        this.y = this.r * Math.cos(this.r * (Math.PI * 2 / 180)) + this.fy
        this.ctx.fillStyle = this.c
        this.ctx.beginPath()
        if(this.isText){
            this.ctx.fillRect(this.x,this.y,1,1);
        }else{
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
        this.ctx.closePath()
        this.ctx.fill()
    }
    updateCollectCircle(){
        if(this.r > 0){
            this.r = this.r - 1
        }else{
            this.r = 0

        }
    }
    drawFromParticles(){
        this.x = (Math.sin(this.r * (Math.PI * 2) / 360)) + this.fx
        this.y = (Math.cos(this.r * (Math.PI * 2) / 360)) + this.fy
        this.ctx.fillStyle = this.c
        this.ctx.beginPath()
        if(this.isText){
            this.ctx.fillRect(this.x,this.y,1,1);
        }else{
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
        this.ctx.closePath()
        this.ctx.fill()
    }
    updateFromParticles(){
        if(this.r > 0){
            this.r = this.r - 10
        }
    }
    drawCircleSpread(){
        this.x = this.r_plus * Math.sin(this.r_plus * (Math.PI * 2 / 180)) + this.fx
        this.y = this.r_plus * Math.cos(this.r_plus * (Math.PI * 2 / 180)) + this.fy
        this.ctx.fillStyle = this.c
        this.ctx.beginPath()
        if(this.isText){
            this.ctx.fillRect(this.x,this.y,1,1);
        }else{
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
        this.ctx.closePath()
        this.ctx.fill()
    }
    updateCircleSpread(){
       this.r_plus += Math.random() * 10
    }
}
class Effects {
    handlePulseAnimations(){
        framework.globalSetup.classes.forEach(c => {
            const elsActive = document.querySelectorAll(`.pulse-outside-${c}--active`)
            const elsActiveDouble = document.querySelectorAll(`.pulse-outside-${c}--active-double`)
            const elsActiveInverted = document.querySelectorAll(`.pulse-outside-${c}--active-inverted`)
            const animation = (e,transition) =>{
                e.target.style.animation = 'none'
                let anim 
                clearTimeout(anim)    
                anim = setTimeout(function(){
                    e.target.style.animation = transition
                },10)
                let timeout
                timeout = setTimeout(()=>{
                    e.target.style.animation = 'none'
                },framework.globalSetup.animationTime)
                clearTimeout(timeout)    
            }
    
            elsActive.forEach(el => {
                el.addEventListener('click',(e)=>{
                    animation(e,`pulseOutlineActive${c} 0.7s ease`)
                })
            })
            elsActiveDouble.forEach(el => {
                el.addEventListener('click',(e)=>{
                    animation(e,`pulseOueActiveDouble${c} 0.7s ease`)
                })  
            })
            elsActiveInverted.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`pulseOutlineActiveInverted${c} 0.7s ease`)
              })  
            })
        })
    }
    handleShadowAnimations(){
        framework.globalSetup.classes.forEach(c => {
            const elsActive = document.querySelectorAll(`.shadow__${c}--click`)
            const elsActiveOff = document.querySelectorAll(`.shadow__${c}--click-off`)
            const elsActiveLightOff = document.querySelectorAll(`.shadow__${c}-light--click-off`)
            const elsActiveLightInsideOff = document.querySelectorAll(`.shadow__${c}-light-inside--click-off`)
            const elsActiveOffInside = document.querySelectorAll(`.shadow__${c}-inside-click-off`)
            const elsActiveLight = document.querySelectorAll(`.shadow__${c}-light--click`)
            const elsActiveInside = document.querySelectorAll(`.shadow__${c}-inside--click`)
            const elsActiveLightInside = document.querySelectorAll(`.shadow__${c}-inside-light--click`)
            const animation = (e,transition) =>{
                e.target.style.animation = 'none'
                let anim 
                clearTimeout(anim)    
                anim = setTimeout(function(){
                    e.target.style.animation = transition
                },10)
                let timeout
                timeout = setTimeout(()=>{
                    e.target.style.animation = 'none'
                },framework.globalSetup.animationTime)
                clearTimeout(timeout)    
            }
    
            elsActive.forEach(el => {
                el.addEventListener('click',(e)=>{
                    animation(e,`shadowClick${c} ${framework.globalSetup.cssShadowAnimationTime}s ease`)
                })
            })
            elsActiveInside.forEach(el => {
                el.addEventListener('click',(e)=>{
                    animation(e,`shadowClickInside${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
                })  
            })
            elsActiveLight.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickLight${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
            elsActiveLightInside.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickLightInside${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
            elsActiveOff.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickOff${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
            elsActiveOffInside.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickOffInside${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
            elsActiveLightOff.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickOffLight${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
            elsActiveLightInsideOff.forEach(el => {
                el.addEventListener('click',(e)=>{
                   animation(e,`shadowClickOffLightInside${c} ${framework.globalSetup.cssShadowAnimationTime}s  ease`)
              })  
            })
        })
    }
    handleButtonFocuses(){
        const buttons = document.querySelectorAll('button')
        buttons.forEach(btn =>{
            btn.addEventListener("click", (e) => {  
                e.target.blur()
                e.target.focus()
            }, true);
        })
    }
    handlePulses(){
        const targets = document.querySelectorAll(`*`)
        if(targets){
            targets.forEach(t => {
                if(t.parentElement?.classList.contains('pulse') || t.classList.contains('pulse')){
                const pulse = t.querySelector('span')
                    let c = getComputedStyle(t).backgroundColor
                    const luma = framework.utils.handleColorLuma(c)
                    if (luma.color === "ffffff") {
                        pulse.style.backgroundColor = 'var(--black)'
                    }else if(luma.color === "000000"){
                        pulse.style.backgroundColor = 'var(--white)'
                    }else if(luma.luma < 35){
                        pulse.style.backgroundColor = 'var(--black)'
                    }else if(luma.luma > 180){
                        pulse.style.backgroundColor = 'var(--black)'
                    }else{
                        pulse.style.backgroundColor = 'var(--white)'
                    }
                    if(pulse){
                        const handlePulse = (e) =>{
                            e.stopPropagation();
                            const x = e.clientX - e.target.offsetLeft 
                            const y = e.clientY - e.target.offsetTop 
                            pulse.style.left = x + 'px'
                            pulse.style.top = y + 'px'
                            t.appendChild(pulse)
                            if(pulse.classList.contains('pulse-inside')){
                                pulse.classList.add('pulse-inside--active')
                            }else if(pulse.classList.contains('pulse-inside-big')){
                                pulse.classList.add('pulse-inside--active-big')
                            }
                        }
                        t.addEventListener('click',(e)=>handlePulse(e))
                    }
                }
            })
        }
    }
    handleClose(){
        const closeBtns = document.querySelectorAll('.close-button')
        closeBtns.forEach(btn => {
            const target = btn.parentElement
            const animatioOut = framework.utils.handleTransitionOut(target)
            btn.addEventListener('click',()=>{
                const trOutAttr = target.getAttribute('data-transition_out')
                target.style.animation = animatioOut
                if(trOutAttr === 'slideOutYCenter'){
                    target.style.top = '-30px'
                }
                let stopTimer
                clearTimeout(stopTimer)
                stopTimer = setTimeout(function(){
                    target.style.display ='none'
                },framework.globalSetup.animationTime)
            })
        })
    }
    handleScrollSpy(){
        framework.globalSetup.classes.forEach(c =>{
            const scrollspys = document.querySelectorAll(`.scrollspy-${c}`)
            const scrollspys_light = document.querySelectorAll(`.scrollspy-${c}-light`)

            const handleSpy = (el) =>{
                const scrollspy_target_attr = el.getAttribute('data-target-id')
                const scrollspy_target = document.querySelector(`#${scrollspy_target_attr}`)
                const scrollspy_target_el_attr = el.getAttribute('data-target-id')
                const scrollspy_rect = scrollspy_target.getBoundingClientRect()
                if(scrollspy_rect.y < window.screen.height / 2){
                    if(scrollspy_target_attr === scrollspy_target_el_attr){
                        el.classList.add('scrollspy--active')
                    }
                }else{
                    if(scrollspy_target_attr === scrollspy_target_el_attr){
                        el.classList.remove('scrollspy--active')
                    }
                }
            }
            window.addEventListener('scroll',()=>{
                if(scrollspys){
                    scrollspys.forEach(el => handleSpy(el))
                }
                if(scrollspys_light){
                    scrollspys_light.forEach(el => handleSpy(el))
                }
            })
        })
        
    }
}
class CanvasCard {
    constructor(card,c_instance){
        this.place = card.parentElement
        this.canvas = document.createElement('canvas')
        this.canvas_2 = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.ctx_2 = this.canvas_2.getContext('2d')
        this.x = 0
        this.y = 0
        this.step = 0
        this.instance = c_instance
        this.cardPixels = []
        this.textPixels = []
        this.index = 0
        this.w = this.canvas.width
        this.h = this.canvas.height
        this.cards = document.querySelectorAll('.card')
    }
    setCanvas(){      
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = this.instance.getY() + 400 + 'px'
        this.canvas.style.left = this.instance.getX() - 90 + 'px'
        this.canvas.setAttribute('width',this.instance.getWidth() + 200) 
        this.canvas.setAttribute('height',this.instance.getHeight() + 200) 
        this.canvas_2.style.position = 'absolute'
        this.canvas_2.style.top = this.instance.getY() + 400 + 'px'
        this.canvas_2.style.left = this.instance.getX() - 90 + 'px'
        this.canvas_2.setAttribute('width',this.instance.getWidth() + 200) 
        this.canvas_2.setAttribute('height',this.instance.getHeight() + 200) 
        this.place.appendChild(this.canvas)
    }
    
    getCardPixels(){
        let card = []
        const imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)
        const data = imageData.data       
        for(let i = 0; i < data.length; i+=4){
            var x = (i / 4) % this.canvas.width;
            var y = Math.floor((i / 4) / this.canvas.width);

            const r = data[i]
            const g = data[i+1]
            const b = data[i+2]
            const a = data[i+3]
            if(a !== 0){
                card.push({x,y,r,g,b,a,c:`rgba(${r},${g},${b},${a})`,green:g,blue:b,alpha:a,red:r})
            }
        }
        this.cardPixels = card
    }
    getTextPixels(){
        let text = []
        const imageData = this.ctx_2.getImageData(0,0,this.canvas.width,this.canvas.height)
        const data = imageData.data       
        for(let i = 0; i < data.length; i+=4){
            var x = (i / 4) % this.canvas.width;
            var y = Math.floor((i / 4) / this.canvas.width);

            const r = data[i]
            const g = data[i+1]
            const b = data[i+2]
            const a = data[i+3]
            if(a !== 0){
                text.push({x,y,r,g,b,a,c:`rgba(${r},${g},${b},${a})`,green:g,blue:b,alpha:a,red:r})
            }
        }
        this.textPixels = text
    }
}
class CardUtils{
    constructor(){
        this.canva = undefined
    }
    drawCard(canva,c,h,b,f){
        canva.setCanvas()
        const xTr = canva.canvas.width / 5.5 
        const yTr = canva.canvas.height / 5
        canva.ctx.clearRect(0,0,canva.canvas.width,canva.canvas.height)
        canva.ctx_2.clearRect(0,0,canva.canvas.width,canva.canvas.height)
        canva.ctx.strokeStyle = 'rgba(0,0,0,0)'
        canva.ctx.beginPath();    
        canva.ctx.fillStyle = c.getBackground()
        // canva.ctx.roundRect(0,0, c.getWidth(), c.getHeight(),c.getBorderRadius(),true)
        canva.ctx.font = h.getFont('child')
        const marginsAndPaddingsHeaderX = c.getPadding().left +  h.getMargin().left + h.getPadding().left + h.getMargin('child').left + h.getPadding('child').left
        const marginsAndPaddingsHeaderY = c.getPadding().top + h.getMargin().top  + h.getPadding().top  + h.getMargin('child').top  + h.getPadding('child').top  + h.getFontSize('child')
        canva.ctx.fillStyle = h.getBackground()
        canva.ctx.roundRect(xTr +c.getPadding().left,yTr+c.getPadding().top, h.getWidth() - c.getPadding().left, h.getHeight() - c.getPadding().top,h.getBorderRadius(),true)
        // heading text
        canva.ctx_2.fillStyle = h.getColor('child')
        canva.ctx_2.font = h.getFont('child')
        canva.ctx_2.fillText(h.getText('child'),xTr+marginsAndPaddingsHeaderX,yTr+marginsAndPaddingsHeaderY);
        // end heading text
        const marginsAndPaddingsBodyX = c.getPadding().left +  b.getMargin().left + b.getPadding().left
        const marginsAndPaddingsBodyY = c.getPadding().top + b.getMargin().top + b.getPadding().top + b.getFontSize()
        canva.ctx.fillStyle = b.getBackground()
        canva.ctx.roundRect(xTr+marginsAndPaddingsBodyX - b.getPadding().left,yTr+ marginsAndPaddingsHeaderY + marginsAndPaddingsBodyY - h.getFontSize('child') / 1.5, h.getWidth(), b.getHeight(),b.getBorderRadius(),true)
        // text
        canva.ctx_2.fillStyle = b.getColor()
        const bodyLines = framework.utils.getTextLines(canva.ctx,b.getText(),canva.canvas.width * 1.5 - 200)
        canva.ctx_2.font = b.getFont()
        let step = marginsAndPaddingsBodyY + marginsAndPaddingsHeaderY + b.getPadding().top / 2 + yTr
        const lineHeight = b.getLineHeight()
        bodyLines.forEach(l =>{
            canva.ctx_2.fillText(l,xTr+marginsAndPaddingsBodyX,step);
            step += lineHeight 
        })
        // end text
        const marginsAndPaddingsFooterX = c.getPadding().left +  f.getMargin().left + f.getPadding().left +  f.getMargin('child').left + f.getPadding('child').left
    
        canva.ctx.fillStyle = f.getBackground()
        canva.ctx.roundRect(xTr, yTr+b.getHeight() + marginsAndPaddingsHeaderY + marginsAndPaddingsBodyY -  h.getFontSize('child') / 1.3, h.getWidth() - c.getPadding().left, f.getHeight() + 5,f.getBorderRadius(),true)
        canva.getCardPixels()
        // footer text
        canva.ctx_2.fillStyle = f.getColor()
        canva.ctx_2.font = f.getFont('child')
        canva.ctx_2.fillText(f.getText('child'),xTr+marginsAndPaddingsFooterX,step);
        canva.ctx.closePath();   
        // end footer text
        canva.getTextPixels()
        
    }
    setTransforms(selector,fns,event,transformDraw,transformUpdate){
        document.querySelectorAll(selector).forEach(card =>{
            const c = new Props('.card',card)
            const h = new Props('.card__header',card)
            const b = new Props('.card__body',card)
            const f = new Props('.card__footer',card)
            const canva = new CanvasCard(card,c)
            this.canva = canva
            const circle = new framework.utils.Circle_Class(this.ctx,0,0,0,0,0,0,0)
            this.drawCard(canva,c,h,b,f)
            let bubbles = []
            let textBubbles = []
            
            canva.cardPixels.forEach(p =>{
                if(p.x % 4 === 0 && p.y % 4 === 0){
                    const bubble = new Bubble(false,canva.ctx,p.x,p.y,1,1,10,10,p.c,p.red,p.green,p.blue,p.alpha)
                    bubbles.push(bubble)
                }
            })

            canva.textPixels.forEach(p =>{
                const bubble = new Bubble(true,canva.ctx,p.x,p.y,1,1,10,10,p.c,p.red,p.green,p.blue,p.alpha)
                textBubbles.push(bubble)
            })

            textBubbles.forEach(b => b.draw())
            const canvas = card.parentElement.querySelector('canvas')
            if(fns?.length > 0){
                fns.forEach(({ev,fn})=>{
                    canvas.addEventListener(ev,(e)=>fn(e,canva,circle,bubbles,textBubbles))
                })
            }
            if(transformDraw && transformUpdate && event){
            canvas.addEventListener(event,(e)=>{
                    this.transform(e,canva,circle,bubbles,textBubbles,transformDraw,transformUpdate)
                })
            }
            canvas.addEventListener('mousemove',(e)=>{
                var rect = canva.canvas.getBoundingClientRect();
                const mousePos = {
                    x:e.clientX - rect.left,
                    y:e.clientY - rect.top
                }
                circle.r = 40
                circle.x = mousePos.x
                circle.y = mousePos.y
            })
        })
    }
    transform(e,canva,circle,bubbles,textBubbles,transformDraw,transformUpdate){
            framework.utils.cancelAllAnimationFrames()
            canva.ctx.fillStyle = `rgba(0,0,0,0)`
            canva.ctx.fillRect(0,0,canva.canvas.width,canva.canvas.height)
            bubbles.forEach(b => b[transformDraw]())
            bubbles.forEach(b => b[transformUpdate](circle))
            textBubbles.forEach(b => b[transformDraw]())
            textBubbles.forEach(b => b[transformUpdate](circle))
            requestAnimationFrame((e)=>this.transform(e,canva,circle,bubbles,textBubbles,transformDraw,transformUpdate)) 
    }
}
class Framework{
    constructor(){
        this.globalSetup = new GlobalSetup(
            ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black','white','light-white','medium-white'],
            document.documentElement,
            700,
            0.7,
            0.5
        )
        if(typeof Utils === 'function'){
            this.utils = new Utils()
        }
        if(typeof Effects === 'function'){
            this.effects = new Effects()
        }
        if(typeof ButtonCollapse === 'function'){
            this.collapse = new ButtonCollapse()
        }
        if(typeof Accordion === 'function'){
            this.accordion = new Accordion()
        }
        if(typeof Breadcrumb === 'function'){
            this.breadcrumb = new Breadcrumb()
        }
        if(typeof Dropdown === 'function'){
            this.dropdown = new Dropdown()
        }
        if(typeof Carousel === 'function'){
            this.carousel = new Carousel()
        }
        if(typeof Divider === 'function'){
            this.divider = new Divider()
        }
        if(typeof Tooltip === 'function'){
            this.tooltip = new Tooltip()
        }
        if(typeof Tabs === 'function'){
            this.tabs = new Tabs()
        }
        if(typeof Input === 'function'){
            this.input = new Input()
        }
        if(typeof Modal === 'function'){
            this.modal = new Modal()
        }
        if(typeof Parallax === 'function'){
            this.parallax = new Parallax()
        }
        if(typeof Progress === 'function'){
            this.progress = new Progress()
        }
        if(typeof Rating === 'function'){
            this.rating = new Rating()
        }
        if(typeof Sidebar === 'function'){
            this.sidebar = new Sidebar()
        }
        if(typeof Nav === 'function'){
            this.nav = new Nav()
        }
        if(typeof Loader === 'function'){
            this.loader = new Loader()
        }
        if(typeof Step === 'function'){
            this.step = new Step()
        }
        if(typeof Toast === 'function'){
            this.toast = new Toast()
        }
    }
    handleMakeCustomSetup(classes,root,animationTime,cssAnimationTime,cssShadowAnimationTime){
        this.globalSetup = new GlobalSetup(classes,root,animationTime,cssAnimationTime,cssShadowAnimationTime)
    }
    handleCardWithShadow(){
        const ThreeD100degRightCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-100deg-right-with-shadow')]
        const ThreeD65degRightCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-65deg-right-with-shadow')]
        const ThreeD100degLeftCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-100deg-left-with-shadow')]
        const ThreeD65degLeftCardsWithShadow = [...document.querySelectorAll('.card__hover--3d-65deg-left-with-shadow')]
       
        const ThreeD100degRightCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-100deg-right-with-shadow-paint')]
        const ThreeD65degRightCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-65deg-right-with-shadow-paint')]
        const ThreeD100degLeftCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-100deg-left-with-shadow-paint')]
        const ThreeD65degLeftCardsWithShadowPaint = [...document.querySelectorAll('.card__hover--3d-65deg-left-with-shadow-paint')]
        // need to move to controller
        if(ThreeD100degRightCardsWithShadow){
            ThreeD100degRightCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,65,15,65,15,100,100)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadow){
            ThreeD65degRightCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadow){
            ThreeD100degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,65,15,65,15,100,100)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadow){
            ThreeD65degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degRightCardsWithShadowPaint){
            ThreeD100degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,65,15,65,15,100,100)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadowPaint){
            ThreeD65degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,25,10,25,10,65,65)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadowPaint){
            ThreeD100degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,65,15,65,15,100,100)
                instance.setup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadowPaint){
            ThreeD65degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,25,10,25,10,65,65)
                instance.setup('mouseover','mouseleave')
            })
        }
    
    }
    handleSetupFunctions(){
        this.utils.handleTransforms()
        this.utils.handlePositionRules()
    }
    handleSetupEffects(){
        this.effects.handlePulseAnimations()
        this.effects.handleShadowAnimations()
        this.effects.handleButtonFocuses()
        this.effects.handleClose()
        this.effects.handleScrollSpy()
        this.effects.handlePulses()
        
    }
    handleSetupComponents(){
        this.collapse?.handleSetup()
        this.accordion?.handleSetup()
        this.breadcrumb?.handleSetup()
        this.dropdown?.handleSetup()
        this.handleCardWithShadow()
        this.carousel?.handleSetup()
        this.divider?.handleSetup()
        this.tooltip?.handleSetup()
        this.tabs?.handleSetup()
        this.input?.handleSetup()
        this.modal?.handleSetup()
        this.parallax?.handleSetup()
        this.progress?.handleSetup()
        this.rating?.handleSetup()
        this.sidebar?.handleSetup()
        this.nav?.handleSetup()
        this.loader?.handleSetup()
        this.step?.handleSetup()
        this.toast?.handleSetup()
    }
    handleSetupAll(){
        this.handleSetupComponents()
        this.handleSetupFunctions()
        this.handleSetupEffects()
    }
}