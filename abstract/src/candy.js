
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
class ButtonCollapse{
    constructor(){
        this.buttons = document.querySelectorAll('.button__collapse')
    }
    handleCollapses(btn){
        const target = document.querySelector(`${btn.dataset.target}`)
        const animationIn = framework.utils.handleTransitionIn(target)
        const animationOut = framework.utils.handleTransitionOut(target)
        target.style.borderWidth = '0px'
        btn.addEventListener('click',(e)=>{
            target.style.removeProperty('border-width')
            if(!target.classList.contains('collapse__open')){
                target.classList.add('collapse__open')
                    target.style.padding = '20px 10px'
                    target.style.animation = 'none'
                    target.style.animation = animationIn
            }else{
                target.classList.remove('collapse__open')
                    let stopTimer
                    clearTimeout(stopTimer)
                    if(target.classList.contains('slide-y') || target.classList.contains('slide-x')){
                        stopTimer = setTimeout(function(){
                            target.style.padding = '0px 0px'
                            target.style.borderWidth = '0px'
                        },framework.globalSetup.animationTime);
                    }
                    target.style.animation = 'none'
                    target.style.animation = animationOut
            }
        })
    }
    handleSetup(){
        this.buttons.forEach(btn => this.handleCollapses(btn))
    }
}
class Accordion{
    constructor(){
        this.headings = document.querySelectorAll('.accordion__heading')
    }
    handleAccordions(h){
        const handleAccordion = () =>{
            const animationIn = framework.utils.handleTransitionIn(h)
            const animationOut = framework.utils.handleTransitionOut(h)
            const chevron = document.querySelector('.chevron')
            const chevronLight = document.querySelector('.chevron-liht')
            let body
            if(!h.getAttribute('data-number')){
                body = h.nextSibling.nextSibling
                if(body.getAttribute('data-number')){ 
                    body = null
                }
            }else{
                const allBodies = document.querySelectorAll('.accordion__body')
                const correctBody = [...allBodies].find(b => b.dataset.number === h.dataset.number)
                body = correctBody
            }
            if(!h.classList.contains('accordion__open')){
                h.classList.add('accordion__open')
                if(body){
                    if(chevron){
                        chevron.classList.add('chevron-up')
                    }else if(chevronLight){
                        chevronLight.classList.add('chevron-up')
                    }
                        body.style.padding = '5px 10px'
                        body.style.animation = 'none'
                        body.style.animation = animationIn   
                        if(h.dataset.number){
                            body.previousElementSibling.style.borderBottom = '1px solid var(--medium-white)'
                        }else{
                            h.style.borderBottom = '1px solid var(--medium-white)'
                        }               
                        if(body.classList.contains('hidden')){
                            body.style.display = 'block'
                        }
                    }
            }else{
                    h.classList.remove('accordion__open')
                    if(body){
                        if(chevron){
                            chevron.classList.remove('chevron-up')
                        }else if(chevronLight){
                            chevronLight.classList.remove('chevron-up')
                        }
                        let stopTimer
                        clearTimeout(stopTimer)
                        stopTimer = setTimeout(function(){
                            body.style.padding = '0px 10px'
                            if(h.dataset.number){
                                body.previousSibling.previousSibling.style.borderBottom = '0px'
                            }else{
                                h.style.borderBottom = '0px'
                            }  
                            if(body.classList.contains('hidden')){
                                body.style.display = 'none'
                            }
                        },framework.globalSetup.animationTime);
                        body.style.animation = 'none'
                        body.style.animation = animationOut                    
                    }
            }
        }
        h.addEventListener('click',handleAccordion)
    }
    handleSetup(){
        this.headings.forEach(h => this.handleAccordions(h))
    }
}
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
class Dropdown{
    constructor(){
        this.allMenus = document.querySelectorAll('.dropdown__menu')
        this.allDropdownItem = document.querySelectorAll('.dropdown__item')
        this.allSubMenusItems = document.querySelectorAll('.dropdown__menu-item')
        this.allMenusInner = document.querySelectorAll('.dropdown__menu-inner')
        this.allSubMenus = document.querySelectorAll('.dropdown__submenu')
    }
    handleSetGraphic(){
        this.allMenus.forEach(m => {
            const items = [...m.querySelectorAll(':scope > .dropdown__menu-item')]
            const isHaveInnerMenu = [...m.querySelectorAll(':scope > .dropdown__menu-inner')]
            
            if(isHaveInnerMenu.length > 0){
                m.style.boxShadow = 'none'
                m.style.background = 'transparent'
            }
    
            if(items.length > 0){
                items[0].style.borderTopLeftRadius = '5px'
                items[0].style.borderTopRightRadius = '5px'
                items[items.length - 1].style.borderBottomLeftRadius = '5px'
                items[items.length - 1].style.borderBottomRightRadius = '5px'
            }
        })
    }
    handleDropdownItemInit(){
        this.allDropdownItem.forEach(i => {
            const button = i.firstElementChild
            const menu = button.nextElementSibling.firstElementChild
            if(button && menu){
                if(button.classList.contains('event--click')){
                    button.addEventListener('click',(e)=>{
                        e.stopImmediatePropagation()
                        if(menu){
                            if(!menu.classList.contains('menu__open')){
                                // const mainSubMenu = e.target.parentElement.querySelector('.dropdown__submenu')
                                // const allInnerMenus = mainSubMenu.querySelectorAll('.dropdown__menu')
                                const mainMenus = e.target.parentElement.parentElement.querySelectorAll('.dropdown__menu-wrapper > .dropdown__menu')
                                mainMenus.forEach(m=>{
                                    if(m){
                                        m.classList.remove('menu__open')
                                        m.style.animation = 'none'
                                    }
                                })
                                this.handleMenusInit(e)
                                this.handleMenuOpen(e,menu)
     
    
                            }else{
                                this.handleMenuClose(e,menu)
                                const mainSubMenu = e.target.parentElement.querySelector('.dropdown__submenu')
                                const allInnerMenus = mainSubMenu.querySelectorAll('.dropdown__menu')
                                allInnerMenus.forEach(m=>{
                                    if(m){
                                        m.classList.remove('menu__open')
                                        m.style.animation = 'none'
                                    }
                                })
                            }
                        }
                    })
                    
                }
                if(button.classList.contains('event--hover')){
                    button.addEventListener('mouseenter',(e) => {
                        e.stopImmediatePropagation()
                        e.stopImmediatePropagation()
                        if(menu){
                            if(!menu.classList.contains('menu__open')){
                                this.handleMenusInit(e)
                                this.handleMenuOpen(e,menu)
    
                            }else{
                                this.handleMenuClose(e,menu)
                            }
                        }
                    })
                }
            }
        })
    }
    handleDropdownSubMenusInit(){
        this.allSubMenusItems.forEach(mi => {
            const subMenu = mi.nextElementSibling
            let menu
            if(subMenu?.querySelector('.dropdown__menu')){
                menu = subMenu.querySelector('.dropdown__menu')
            }
            if(menu?.classList.contains('dropdown__menu')){
                if(mi && menu){
                    if(mi.classList.contains('event--click')){
                        mi.addEventListener('click',(e)=>{
                            e.stopImmediatePropagation()
                            if(menu){
                                if(!menu.classList.contains('menu__open')){
                                    this.handleMenusInit(e)
                                    this.handleMenuOpen(e,menu,subMenu)
        
                                }else{
                                    this.handleMenuClose(e,menu,subMenu)
        
                                }
                            }
                        })
                    }
                    if(mi.classList.contains('event--hover')){
                        mi.addEventListener('mouseover',(e)=>{
                            e.stopImmediatePropagation()
                            if(menu){
                                if(!menu.classList.contains('menu__open')){
                                    this.handleMenusInit(e)
                                    this.handleMenuOpen(e,menu,subMenu)
        
                                }else{
                                    this.handleMenuClose(e,menu,subMenu)
        
                                }
                            }
                        })
                    }
                }
            }
    
        })
    }
    handleClose(menus){
        menus.forEach(menu => {
            menu.style.opacity = '0'
            if(menu.parentElement.classList.contains('dropdown__menu-wrapper')){
                menu.parentElement.style.opacity = '0'
            }
            let stopTimer
            clearTimeout(stopTimer)
            stopTimer = setTimeout(()=>{
                menu.style.animation = 'none'
                menu.classList.remove('menu__open')
                menu.style.removeProperty("opacity")
                if(menu.parentElement.classList.contains('dropdown__menu-wrapper')){
                    menu.parentElement.style.removeProperty("opacity")
                }
            },500)
        })

    }
    handleCloseAll(condition){
        if(condition){
            this.allMenus = document.querySelectorAll('.dropdown__menu')
            this.allMenusInner = document.querySelectorAll('.dropdown__menu-inner')
            this.allSubMenus = document.querySelectorAll('.dropdown__submenu')
            this.handleClose(this.allMenus);
            this.handleClose(this.allMenusInner);
            this.handleClose(this.allSubMenus);
        }
    }
    transitionControlOpen(fixOffset,offset,menu,subMenu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trInAttr = menu.getAttribute('tr_')
        if(trInAttr === 'slideInYBottom'){
            if(children.length > 2){
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length - 1)}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length)}px)`       
            }
        }
        else if(trInAttr === 'slideInYCenter'){
            if(children.length > 2){

                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight  * (children.length / 2) / 2}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${0}px)`  

            }      
        }
        else if(trInAttr === 'slideInXCenter'){
            subMenu.style.transform = `translate(${fixOffset}px, ${-children[0].clientHeight}px)`         
        }
        else if(trInAttr === 'fadeIn' || trInAttr === null){
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`                  
        }else{
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`    
        }
    }
    transitionControlMenuInOpen(menu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trInAttr = menu.getAttribute('data-transition_in')
        if(trInAttr === 'slideInYBottom'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight  * (children.length * 1.075)}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length)}px)`       
            }
        }
        else if(trInAttr === 'slideInYCenter'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children.length * children[0].clientHeight - 30}px)`
            }else{
                menu.parentElement.style.transform = `translateY(${65}px)`       

            }      
        }
        else if(trInAttr === 'slideInXCenter'){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.15}px)`         
        }
        else if(trInAttr === 'fadeIn' || trInAttr === null){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.2 }px)`                  
        }
        else if(trInAttr === 'scaleIn'){
            menu.parentElement.style.transform = `translateY(${children[0].clientHeight + 30 / 3}px)`                  
        }
        else{
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.20}px)`    
        }
    }
    handleMenuOpen(e,menu,subMenu){
        menu.classList.remove('menu__open')
        const items = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const animationIn = framework.utils.handleTransitionIn(menu)
            items.forEach(i => {
                i.style.padding = '5px 10px'
            })
            menu.classList.add('menu__open')
            const trInAttr = menu.getAttribute('data-transition_in')
            if(!subMenu){
                this.transitionControlMenuInOpen(menu)
            }
            if(subMenu){
                if(subMenu.classList.contains('left')){
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginLeft = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginLeft = correctOffset + 'px'
                        }
                    }
                    this.transitionControlOpen(-e.target.clientWidth - 40 ,-e.target.clientWidth - 5,menu,subMenu)
                }else if(subMenu.classList.contains('right')){         
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginRight = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginRight = correctOffset + 'px'
                        }
                    }
                    this.transitionControlOpen(e.target.clientWidth+5,e.target.clientWidth + 5,menu,subMenu)

                }else{
                    const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
                    subMenu.style.height = children.length * children[0].clientHeight + 'px'
                    if(trInAttr === 'slideInYCenter'){
                        subMenu.style.transform = `translateY(-200%)`
                    }
                }
                if(trInAttr !== 'slideInYCenter' && trInAttr !== 'slideInYBottom'){
                    menu.classList.add('dropdown__menu-fix-top')
                }
            }
           
            menu.style.animation = animationIn
    }
    transitionControlClose(fixOffset,offset,menu,subMenu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trOutAttr = menu.getAttribute('data-transition_out')
        if(trOutAttr === 'slideOutYBottom'){
            if(menu.children.length > 2){
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length - 1)}px)`       
            }else{
                subMenu.style.transform = `translate(${offset}px, ${children[0].clientHeight * (children.length )}px)`       

            }
        }
        else if(trOutAttr === 'slideOutYCenter'){
            if(children.length > 2){
                subMenu.style.transform = `translate(${offset}px, null)`  
            }else{
                subMenu.style.transform = `translate(${offset}px, ${30}px)`       

            }      
        }
        else if(trOutAttr === 'slideOutXCenter'){
            subMenu.style.transform = `translate(${fixOffset}px, ${-children[0].clientHeight}px)`         
        }
        else if(trOutAttr === 'fadeOut' || trOutAttr === null){
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`                  
        }else{
            subMenu.style.transform = `translate(${offset}px, ${-children[0].clientHeight}px)`    
        }
    }
    transitionControlMenuOutClose(menu){
        const children = menu.querySelectorAll(':scope > .dropdown__menu-item')
        const trOutAttr = menu.getAttribute('data-transition_out')
        if(trOutAttr === 'slideOutYBottom'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length * 1.07)}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight * (children.length - 1)}px)`       
            }
        }
        else if(trOutAttr === 'slideOutYCenter'){
            if(children.length > 2){
                menu.parentElement.style.transform = `translateY(${children[0].clientHeight  * children.length / 1.55}px)`       
            }else{
                menu.parentElement.style.transform = `translateY(${65}px)`       

            }      
        }
        else if(trOutAttr === 'slideOutXCenter'){
            menu.parentElement.style.transform = `translateY(${-children[0].clientHeight + 30 * 1.15}px)`        
        }
        else if(trOutAttr === 'fadeOut' || trOutAttr === null){
            menu.parentElement.style.transform = `translateY(${children[0].clientHeight + 8 - children[0].clientHeight}px)`                  
        }else{
            menu.parentElement.style.transform = `translate(Y(${-children[0].clientHeight + 8}px)`    
        }
    }
    handleMenuClose(e,menu,subMenu){
        const animationOut = framework.utils.handleTransitionOut(menu)
            const trOutAttr = menu.getAttribute('data-transition_out')
            const trInAttr = menu.getAttribute('data-transition_in')
            menu.style.animation = animationOut
            if(!subMenu){
                menu.classList.remove('dropdown__menu-fix')
                this.transitionControlMenuOutClose(menu)
            }
            if(subMenu){
                if(subMenu.classList.contains('left')){
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginLeft = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginLeft = correctOffset + 'px'
                        }
                    }
                    this.transitionControlClose(-e.target.clientWidth - 5,-e.target.clientWidth - 5,menu,subMenu)
                }else if(subMenu.classList.contains('right')){         
                    const subMenuWidth = subMenu.offsetWidth
                    if(e.target.clientWidth !== subMenuWidth){
                        if(e.target.clientWidth < subMenuWidth){
                            const correctOffset = subMenuWidth - e.target.clientWidth 
                            subMenu.style.marginRight = -correctOffset + 'px'
                        }else{
                            const correctOffset =  e.target.clientWidth - subMenuWidth
                            subMenu.style.marginRight = correctOffset + 'px'
                        }
                    }
                    this.transitionControlClose(e.target.clientWidth + 5,e.target.clientWidth + 5,menu,subMenu)
                }else{
                    if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && trInAttr === 'slideInYCenter'){
                        subMenu.style.transform = `translateY(0%)`
                    }
                    if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && trOutAttr === 'slideOutYCenter'){
                        subMenu.style.transform = `translateY(-200%)`
                    }
                }
                  
                if(trOutAttr !== 'slideOutYCenter' && trOutAttr !== 'slideOutYBottom'){
                    menu.classList.remove('dropdown__menu-fix-top')
                }
            }
            let timeout
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
                menu.classList.remove('menu__open')
                if(!subMenu?.classList.contains('left') && !subMenu?.classList.contains('left') && subMenu){
                    subMenu.style.height = '0px'
                }
            },framework.globalSetup.animationTime)

           
    }
    handleMenusInit(e){
        const subMenus = e.target.parentElement.querySelectorAll('.dropdown__submenu')
        subMenus.forEach(sm => {
            const menu = sm.querySelector('.dropdown__menu')
            if(menu.classList.contains('menu__open')){
                this.handleMenuClose(e,menu,sm)
            }
        })
    }
    handleSetup(){
        this.handleSetGraphic()
        this.handleDropdownItemInit()
        this.handleDropdownSubMenusInit()
        document.addEventListener('click',(e) => this.handleCloseAll((!e.target.classList.contains('dropdown__menu-item') && !e.target.classList.contains('dropdown__button') && !e.target.classList.contains('dropdown__link'))))
    }
}
class Card{
    constructor(selector,card,normalOrPaint,isLeft,isBottom,initX,initY,moveX,moveY,angle,fangle){
        this.cards = document.querySelectorAll(selector);
        this.card = card;
        this.normalOrPaint = normalOrPaint
        this.isClicked = false
        this.isLeft = isLeft
        this.isBottom = isBottom
        this.initX = initX
        this.initY = initY
        this.moveX = moveX
        this.moveY = moveY
        this.angle = angle
        this.fangle = fangle
        this.previousAngle = 0
        this.cardIndex = 0
        this.header = card.querySelector('.card__header')
        this.body = card.querySelector('.card__body')
        this.button = card.querySelector('.card__button')
        this.footer = card.querySelector('.card__footer')
        this.headerColor = this.getColors(this.header)
        this.bodyColor = this.getColors(this.body)
        this.buttonColor = this.getColors(this.button)
        this.footerColor = this.getColors(this.footer)
        this.cardColor = this.getColors(this.card)
        this.shadowCardZIndex = -8000
        this.nthType = 4
        this.isBack = false
        this.styles = document.querySelector('style')
        this.translateX = this.initX
        this.translateY = this.initY
    }
    getColors(el){
        if(el){

        let colorsRegex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
        let rgb = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
        let rgba = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3}), (\d{1,3})\)/gi
        let gradient = getComputedStyle(el,":before").background
        const gradientExpression = /linear-gradient\((.*)\)/gi
        const validExpression = gradient.match(gradientExpression)
        let colors
        if(validExpression !== null && validExpression !== undefined){
            if(typeof validExpression.join('') === 'string'){
                colors = validExpression.join('').match(colorsRegex)
            }
        }
        let gradientFirstColor
        let gradientSecondColor
        if(colors?.length > 0){
            if(colors[0]){
                if(rgb.test(colors[0])){
                    gradientFirstColor = colors[0].match(rgb).slice(1,4).join(', ')
                }else{
                    gradientFirstColor = colors[0].match(rgba).slice(1,4).join(', ')
                }
            }
        }
        if(colors?.length > 1){
            if(colors[1]){
                
                if(rgb.test(colors[1])){
                    gradientSecondColor = colors[1].match(rgb).slice(1,4).join(', ')
                }else{
                    gradientSecondColor = colors[1].match(rgba).slice(1,4).join(', ')
            }
        }  
        if(this.card.classList.contains('shadow-left-black')){
            gradientFirstColor = '0,0,0'
        }  
        if(this.card.classList.contains('shadow-right-black')){
            gradientSecondColor = '0,0,0'
        }  
        if(this.card.classList.contains('shadow-left-white')){
            gradientFirstColor = '255,255,255'
        }  
        if(this.card.classList.contains('shadow-right-white')){
            gradientSecondColor = '255,255,255'
        }  
    }
        return {
            background:framework.utils.hexToRgbArr(framework.utils.rgbToHex(...framework.utils.colorToRgbArray(getComputedStyle(el).backgroundColor))),
            borderColor:framework.utils.hexToRgbArr(framework.utils.rgbToHex(...framework.utils.colorToRgbArray(getComputedStyle(el).borderColor))),
            borderGradient:{
                first:gradientFirstColor,
                second:gradientSecondColor,
            } ,
            isExists:getComputedStyle(el,":before").content === 'none' ? false : true
        }
    }

    } 
    removeBg(el){
        for (let i = el.classList.length - 1; i >= 0; i--) {
            const className = el.classList[i];
            if (className.startsWith('bg-')) {
                el.classList.remove(className);
            }
        }
    }
    isHaveBg(el){
        var matches = [el.classList].filter(function(pattern) {
            return new RegExp('bg-','gi').test(pattern);
          })
        if (matches.length > 0) {
            return true
        }else{
            return false
        }
    }  
    createShadowCard(opacity){
        const shadowCard = document.createElement('div')
        const cardGradientClass = [...this.card.classList].filter(c =>{
            if(/gradient/gi.test(c)){
                return c
            }else{
                return
            }
        })
        shadowCard.classList = 'card'
        cardGradientClass.forEach(c =>{
            shadowCard.classList.add(c)
        })
        const shadowHeader = document.createElement('div')
        if(this.header){
            shadowHeader.classList = this.header.classList
            this.removeBg(shadowHeader)
        }
        const shadowBody = document.createElement('div')
        if(this.body){
            shadowBody.classList = this.body.classList
            this.removeBg(shadowBody)
        }
        const shadowButton = document.createElement('button')
        if(this.button){
            shadowButton.classList = this.button.classList
            this.removeBg(shadowButton)
        }
        const shadowFooter = document.createElement('div')
        if(this.button){
            shadowFooter.classList = this.footer.classList
            this.removeBg(shadowFooter)
        }
        shadowCard.style.position = 'absolute'
        shadowCard.style.borderColor = `rgba(${this.cardColor.borderColor[0]},${this.cardColor.borderColor[1]},${this.cardColor.borderColor[2]},${opacity})`
        shadowCard.style.backgroundColor = `rgba(${this.cardColor.background[0]},${this.cardColor.background[1]},${this.cardColor.background[2]},${opacity})`
        if(!this.isLeft){
            shadowCard.style.transform = `translate(${this.translateX}px,${this.translateY}px)`
        }else{
            shadowCard.style.transform = `translate(-${this.translateX}px,${this.translateY}px)`
        }
        shadowCard.style.width = this.card.clientWidth + 'px'
        shadowCard.style.zIndex = this.shadowCardZIndex
        if(this.header){
            if(this.isHaveBg(this.header)){
                shadowHeader.style.backgroundColor = `rgba(${this.headerColor.background[0]},${this.headerColor.background[1]},${this.headerColor.background[2]},${opacity})`
                shadowHeader.style.borderColor = `rgba(${this.headerColor.borderColor[0]},${this.headerColor.borderColor[1]},${this.headerColor.borderColor[2]},${opacity})`
            }else{
                this.header.style.background = getComputedStyle(this.card).background
            }
            if(this.headerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}));\n}`
            }
            shadowHeader.innerHTML = this.header.innerHTML
            shadowCard.appendChild(shadowHeader)
            
        }
        if(this.button){
            if(this.isHaveBg(this.button)){
                shadowButton.style.backgroundColor = `rgba(${this.buttonColor.background[0]},${this.buttonColor.background[1]},${this.buttonColor.background[2]},${opacity})`
                shadowButton.style.borderColor = `rgba(${this.buttonColor.borderColor[0]},${this.buttonColor.borderColor[1]},${this.buttonColor.borderColor[2]},${opacity})`
            }else{
                this.button.style.background = getComputedStyle(this.card).background
            }
            if(this.footerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            shadowButton.innerHTML = this.button.innerHTML
            shadowBody.innerHTML = this.body.innerHTML 
            const shadowButtonToRemove = shadowBody.querySelector('button')
            shadowButtonToRemove.remove()
            shadowBody.appendChild(shadowButton)
        }
        if(this.body){
            if(this.isHaveBg(this.body)){
                shadowBody.style.backgroundColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderTopColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
                shadowBody.style.borderBottomColor = `rgba(${this.bodyColor.background[0]},${this.bodyColor.background[1]},${this.bodyColor.background[2]},${opacity})`
            }else{
                this.body.style.background = getComputedStyle(this.card).background
            }
            if(this.bodyColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            // shadowBody.innerHTML = this.body.innerHTML
            shadowCard.appendChild(shadowBody)
        }
       
        if(this.footer){
            if(this.isHaveBg(this.footer)){
                shadowFooter.style.backgroundColor = `rgba(${this.footerColor.background[0]},${this.footerColor.background[1]},${this.footerColor.background[2]},${opacity})`
                shadowFooter.style.borderColor = `rgba(${this.footerColor.borderColor[0]},${this.footerColor.borderColor[1]},${this.footerColor.borderColor[2]},${opacity})`
            }else{
                this.footer.style.background = getComputedStyle(this.card).background
            }
            if(this.footerColor.isExists){
                this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex})  .card > .card__header:before{ background:linear-gradient(to right, rgba(${this.headerColor.borderGradient.first}, ${opacity}), rgba(${this.headerColor.borderGradient.second}, ${opacity}))\n;}`
            }
            shadowFooter.innerHTML = this.footer.innerHTML
            shadowCard.appendChild(shadowFooter)
        }
        const isOneExists = [this.headerColor.isExists,this.bodyColor.isExists,this.footerColor.isExists,this.buttonColor.isExists]
        if(this.cardColor.isExists && !isOneExists.includes(true)){
            this.styles.innerHTML += `.card:nth-of-type(${this.cardIndex}) .card:nth-of-type(${this.nthType})::before{ 
                background:linear-gradient(to right, rgba(${this.cardColor.borderGradient.first}, ${opacity}), rgba(${this.cardColor.borderGradient.second}, ${opacity}));
                max-height:99.5%;
                
            }\n`
        }
        return shadowCard
    }
    // anim
    handleAnimation = () =>{
        framework.utils.cancelAllAnimationFrames()
        this.card.style.transition = 'all 0s ease'
        this.card.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
        const shadowCard = this.createShadowCard(1)
        shadowCard.style.position = 'absolute'
        shadowCard.style.left = this.card.offsetLeft + 'px'
        shadowCard.style.top = this.card.offsetTop + 'px'
        shadowCard.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
        shadowCard.style.color = 'transparent'
        shadowCard.previousAngle = this.angle
        this.card.parentElement.insertBefore(shadowCard,this.card)
        this.angle -=  2
        this.previousAngle = this.angle
        if(this.angle >= 0 && !this.isBack){
            window.requestAnimationFrame(this.handleAnimation)
        }
    }
    handleCardShadow(){
        if(Array.isArray(this.cards)){
            this.cardIndex = this.cards.indexOf(this.card) + 1
        }
        if(!this.normalOrPaint){
            for(let opacity = 0.6; opacity > 0.1; opacity -= 0.1){
                const shadowCard = this.createShadowCard(opacity)
                this.card.appendChild(shadowCard)
                this.translateX += this.moveX
                this.translateY += this.moveY
                this.shadowCardZIndex -= 1
                this.nthType += 1
            }
        }else{
           if(!this.isBack){
              if(this.previousAngle > 0){
                this.angle = this.previousAngle
              }else{
                this.angle = 0
              }
              if(this.isLeft){
                this.handleAnimation()
              }else{
            
                }
            }
        }
    }
    handleRotateBackClearAnimation = () =>{
        framework.utils.cancelAllAnimationFrames()
        if(this.angle < 100){
            if(this.card){
                this.card.style.transform = `rotate3d(1,-1,1,${this.angle}deg)`
                this.card.style.transition = 'all 0s ease-in-out'
                
                const children = [...this.card.parentElement.querySelectorAll('.card')].filter(c => this.card !== c)
                if(children[children.length - 1]){
                    this.card.parentElement.removeChild(children[children.length - 1])
                }
                this.angle += 1.85
                this.previousAngle = this.angle 
            }
            requestAnimationFrame(this.handleRotateBackClearAnimation)
        }
        else if(this.angle >= 95){
            if(this.card){
                const children = [...this.card.parentElement.querySelectorAll('.card')].filter(c=> this.card !== c)
                children.forEach(c => c.remove())
            }
        }
    }
    handleRotateBackClear(){
        if(this.previousAngle > 0){
            this.angle = this.previousAngle 
        }else{
            this.angle = 0
        }
        if(this.isBack){
            this.handleRotateBackClearAnimation()
        }   
    }
    handleRotateBack = () =>{
        let card = this.card
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        let stepX = this.initX
        let stepY = this.initY
        if(this.isLeft){
            if(card){
                card.style.transform  = `rotate3d(-1,-1,-1,${this.fangle}deg)`
            }
        }else{
            if(card){
                card.style.transform  = `rotate3d(1,-1,1,${this.fangle}deg)`
            }
        }
        const innerCards = [...card.querySelectorAll('.card')]
        innerCards.forEach(c => {
            if(this.isLeft){
                c.style.transform = `translate(-${stepX}px,${stepY}px)`
            }
            else{
                c.style.transform = `translate(${stepX}px,${stepY}px)`
            }
            stepX += this.moveX
            stepY += this.moveY
        })
    }
    handleDirection(initX,initY,moveX,moveY){
        let stepX = initX
        let stepY = initY
        let index = 0
        const innerCards = [...this.card.querySelectorAll('.card')]
        if(this.card){
            this.card.style.transform = `rotate3d(1,-1,1,0deg)`
        }
        for(let i = 0.6; i > 0.1; i-= 0.1){
            innerCards[index].style.transform = `translate(${stepX}px,${stepY}px)`
            if(this.isLeft){
                stepX -= moveX
            }
            else{
                stepX += moveX
            }
            if(this.isBottom){  
                stepY += moveY
            }else{
                stepY -= moveY
            }
            index++
        }
 
    }
    handleMainAnimation(){
        let card = this.card
        while(card.parentElement.classList.contains('card')){
            card = card.parentElement
        }
        const innerCards = card.querySelectorAll('.card')
       
        if(card.classList.contains('card__hover--3d-65deg-right-with-shadow')){
            card.style.transform = `rotate3d(1,-1,1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow')){
            card.style.transform = `rotate3d(-1,-1,-1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        if(card.classList.contains('card__hover--3d-100deg-right-with-shadow')){
            card.style.transform = `rotate3d(1,-1,1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow')){
            card.style.transform = `rotate3d(-1,-1,-1,0deg)`
            innerCards.forEach(c => {
                c.style.transform = `translate(0px ,0px)`
            })
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-left-top') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-left-top')){
            this.handleDirection(-65,-15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-left-bottom')){
            this.handleDirection(-65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-bottom')){
            this.handleDirection(65,15,65,15)
        }
        else if(card.classList.contains('card__hover--3d-100deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-100deg-right-with-shadow-right-top')){
            this.handleDirection(65,-15,65,15) 
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-top')){
            this.handleDirection(-25,-10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-left-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-left-bottom')){
            this.handleDirection(-25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-bottom') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-bottom')){
            this.handleDirection(25,10,25,10)
        }
        else if(card.classList.contains('card__hover--3d-65deg-left-with-shadow-right-top') || card.classList.contains('card__hover--3d-65deg-right-with-shadow-right-top')){
            this.handleDirection(25,-10,25,10) 
        }
    }
    setupWithShadow(event_in,event_out){
        this.handleCardShadow()
        if(event_in !== 'click'){
            this.card.addEventListener(event_in,()=>{
                this.handleMainAnimation()
            })
            this.card.addEventListener(event_out,(e)=>{
                this.handleRotateBack()
            })
        }else{
                this.card.addEventListener(event_in,(e)=>{
                    if(!this.isClicked){
                        this.handleMainAnimation()
                        setTimeout(() => {
                            this.isClicked = true
                        }, 100);
                    }
                })
                this.card.addEventListener(event_out,(e)=>{
                    if(this.isClicked){
                        this.isClicked = false
                        this.handleRotateBack()
                    }
                })
          
        }
    }
    setupWithPaint(event_in,event_out){
        if(event_in !== 'click'){
            this.card.parentElement.addEventListener(event_in,(e)=>{
                this.handleAnimation()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.handleCardShadow()
                this.isBack = false
            })
            this.card.parentElement.addEventListener(event_out,(e)=>{
                this.isBack = true
                this.handleRotateBackClear()
            })
        }else{
            this.card.parentElement.addEventListener(event_in,(e)=>{
                    if(!this.isClicked){
                        this.isClicked = true
                        this.handleMainAnimation()
                        e.stopPropagation()
                        e.stopImmediatePropagation()
                        this.isBack = false
                        this.handleCardShadow()
                    }
                })
                this.card.parentElement.addEventListener(event_out,(e)=>{
                    if(this.isClicked){
                        this.isBack = true
                        this.isClicked = false
                        this.handleRotateBackClear()
                    }
                })
        }
    }
    handleSetup(event_in,event_out){
        const isShadow  = [...this.card.classList].filter(c => /with-shadow-paint/gi.test(c))
        if(isShadow?.length === 0){
            this.setupWithShadow(event_in,event_out)
        }else{
            this.setupWithPaint(event_in,event_out)
        }
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
class Carousel{
    constructor(){
        this.moveX = 0 
        this.moveY = 0
        this.count = 1
        this.prevCount = 1
        this.isPlay = false
        this.elements = document.querySelectorAll('.carousel')
        this.items = []
        this.headings = [[],[],[]]
        this.texts = [[],[],[]]
        this.footers = [[],[],[]]
        this.srcs = []
    }
    handleSetButtons(){
        this.elements.forEach(el =>{
            const isButtons  = [...el.classList].filter(c => /carousel__buttons/gi.test(c))
            if(isButtons.length > 0){
                const wrapper = document.createElement('div')
                wrapper.classList.add('carousel__controls')
                const chevron_prev = document.createElement('div')
                chevron_prev.classList.add('carousel__chevron')
                const chevron_next = document.createElement('div')
                chevron_next.classList.add('carousel__chevron')
                const prev = document.createElement('div')
                prev.classList.add('carousel__prev')
                prev.appendChild(chevron_prev)
                wrapper.appendChild(prev)
                const next = document.createElement('div')
                next.classList.add('carousel__next')
                next.appendChild(chevron_next)
                wrapper.appendChild(next)
                el.appendChild(wrapper)
            }
        })
    }
    handleSetPins(){
        this.elements.forEach(el =>{
            const isPins  = [...el.classList].filter(c => /carousel__pins/gi.test(c))
            if(isPins.length > 0){
                const view  = el.querySelector('.carousel__view')
                let items = [...view.querySelectorAll('.carousel__item')]
                const last = items[0].cloneNode(true)
                const first = items[items.length - 1].cloneNode(true)
                items.push(last)
                items.unshift(first)
                view.innerHTML = ''
                items.forEach(i => {
                    view.append(i)
                })
                const wrapper = document.createElement('div')
                wrapper.classList.add('carousel__dots')
                items.forEach(i => {
                    const dot = document.createElement('div')
                    dot.classList.add('carousel__dot')
                    wrapper.appendChild(dot)
                })
                el.appendChild(wrapper)
                const dots = [...document.querySelectorAll('.carousel__dot')]
                if(dots.length > 0){
                    dots[1].classList.add('carousel__dot--active')
                }
                dots.forEach((d,i) => d.addEventListener('click',()=>{this.handlePinEffect(el,i)}))
            }
        })
    }
    handleActivePin(){
        const dots = document.querySelectorAll('.carousel__dot')
        dots.forEach(d => d.classList.remove('carousel__dot--active'))
        dots[this.count].classList.add('carousel__dot--active')

    }
    handlePinEffect(el,index){
        const view = el.querySelector('.carousel__view')
        const items = view.querySelectorAll('.carousel__item')
        const isMerge = [el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
        const isFade = [el.classList].filter(c => /carousel__fade/.test(c)).length > 0 ? true : false
        const isTextEffect = [el.classList].filter(c => /carousel__with-text-effect/.test(c)).length > 0 ? true : false
        let direction = 'prev'
        this.count = index 
        if(this.count > this.prevCount){
            direction = 'next'
        }else{
            direction = 'prev'
        }
        this.prevCount = index 
        if(isMerge){
            if(items[2]){
                items[2].style.transition = 'all 1s ease-in-out'
                items[2].style.backgroundSize = 'cover'
                items[2].style.backgroundImage = `url(${this.srcs[index+1]})`
            }
            const nextHeadings = items[this.count+1].querySelectorAll('.carousel__item-heading > *')
            const nextTexts = items[this.count+1].querySelectorAll('.carousel__item-text > *')
            const nextFooters = items[this.count+1].querySelectorAll('.carousel__item-footer > *')
            if(this.count !== 1){
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[this.count - 1] = [...tempHeadings]
                this.texts[this.count - 1] = [...tempTexts]
                this.footers[this.count - 1] = [...tempFooters]
            }
            const heading = items[2].querySelector('.carousel__item-heading')
            const text = items[2].querySelector('.carousel__item-text')
            const footer = items[2].querySelector('.carousel__item-footer')
            if(heading){
                heading.innerHTML = ''
            }
            if(text){
                text.innerHTML = ''
            }
            if(footer){
                footer.innerHTML = ''
            }
                this.headings[index-1].forEach(h =>{
                    const el = document.createElement(`${h.tag}`)
                    el.textContent = h.text
                    heading.appendChild(el)
                })
                this.texts[index-1].forEach(t =>{
                    const el = document.createElement(`${t.tag}`)
                    el.textContent = t.text
                    text.appendChild(el)
                })
                this.footers[index-1].forEach(f =>{
                    const el = document.createElement(`${f.tag}`)
                    el.textContent = f.text
                    footer.appendChild(el)
                })
        } else {
            this.moveX = items[index + 1].offsetLeft 
            if(view){
                view.style.transition = 'all 1s ease-in-out'
            }
            if(!isFade){
                if(view){
                    view.style.transform = `translateX(-${this.moveX}px)`
                }
            }else{
                if(view){
                    view.style.opacity = 0
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        view.style.transform = `translateX(-${this.moveX}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            },200);
                        }
                    }, 1000);
                }
            }
        }
        if(isTextEffect && isMerge | isFade){
            this.handleCarouselTextEffectIn(direction,isMerge,isFade)
        }else if(isMerge){
           const body = items[2].querySelector('.carousel__item-body')
           if(body){
               body.style.opacity = 0
               body.style.transition = 'all 0s ease-in-out'
               setTimeout(() => {
                   body.style.transition = 'all 1s ease-in-out'
                   body.style.opacity = 1
                }, 1000);
            }
        }else if(isFade){
            const body = items[this.count+1].querySelector('.carousel__item-body')
            if(body){
                body.style.opacity = 0
                body.style.transition = 'all 0s ease-in-out'
                setTimeout(() => {
                    body.style.transition = 'all 1s ease-in-out'
                    body.style.opacity = 1
                }, 2000);
            }
        }
    }
    handleCarouselTextEffectIn(direction,isMerge,isFade){
        let nextHeading =  this.items[2].querySelector('.carousel__item-heading')
        let nextText = this.items[2].querySelector('.carousel__item-text')
        let nextFooter = this.items[2].querySelector('.carousel__item-footer')
        let prevHeading = this.items[2].querySelector('.carousel__item-heading')
        let prevText = this.items[2].querySelector('.carousel__item-text')
        let prevFooter = this.items[2].querySelector('.carousel__item-footer')

        if(!isMerge){
            if(this.count === 1 && direction === 'prev'){
                if(!isMerge){
                    nextHeading = this.items[2].querySelector('.carousel__item-heading')
                    nextText = this.items[2].querySelector('.carousel__item-text')
                    nextFooter = this.items[2].querySelector('.carousel__item-footer')
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                }
            
                if(prevHeading){
                    prevHeading.style.transition = 'all 1s ease-in-out'
                    prevHeading.style.transform = 'translateX(1200px)'
                }
                if(prevText){

                    prevText.style.transition = 'all 1s ease-in-out'
                    prevText.style.transform = 'translateX(-500px)'
                }
                if(prevFooter){

                    prevFooter.style.transition = 'all 1s ease-in-out'
                    setTimeout(() => {
                        prevFooter.style.transform = 'translateX(-500px)'
                    }, 200);
                }
                const handleEffectOnePrev = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        nextFooter.style.transform =  'translateY(0px)'
                    }
                }
                if(!isFade){
                    setTimeout(() => {
                        handleEffectOnePrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectOnePrev()
                    }, 1000);
                }
            }
            if(this.count === 1 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[2].querySelector('.carousel__item-heading')
                    nextText = this.items[2].querySelector('.carousel__item-text')
                    nextFooter = this.items[2].querySelector('.carousel__item-footer')
                    prevHeading = this.items[4].querySelector('.carousel__item-heading')
                    prevText = this.items[4].querySelector('.carousel__item-text')
                    prevFooter = this.items[4].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.opacity = 0
                    nextHeading.style.transform = 'translateY(-100px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.opacity = 0
                    nextText.style.transform = 'translateX(400px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.opacity = 0
                    nextFooter.style.transform = 'translateY(200px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-400px)'
                    prevFooter.style.opacity = 0
                }

                const handleEffectOneNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1.5s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform  = 'translateY(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1.8s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1.8s ease-in-out'
                        setTimeout(() => {
                            nextFooter.style.opacity = 1
                            nextFooter.style.transform =  'translateY(0px)'
                        }, 200);
                    }
                }
                if(!isFade){
                    setTimeout(() => {
                        handleEffectOneNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectOneNext()
                    }, 1000);
                }
            }
            if(this.count % 2 === 0 && direction === 'prev'){
                if(!isMerge){
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                }

                if(prevHeading){
                    prevHeading.style.transition = 'all 0s ease-in-out'
                    prevHeading.style.transform = 'translateY(200px)'
                }
                if(prevText){
                    prevText.style.transition = 'all 0s ease-in-out'
                    prevText.style.transform = 'translateX(500px)'
                }
                if(prevFooter){
                    prevFooter.style.transition = 'all 0s ease-in-out'
                    prevFooter.style.transform = 'translateY(-500px)'
                }

                if(nextHeading){
                    nextHeading.style.transform = 'translateX(200px)'
                    nextHeading.style.opacity = 0
                }
                if(nextText){
                    nextText.style.transform = 'translateX(-400px)'
                    nextText.style.opacity = 0
                }
                if(nextFooter){
                    nextFooter.style.transform = 'translateX(400px)'
                    nextFooter.style.opacity = 0
                }

                const handleEffectTwoPrev = () =>{
                    if(prevHeading){
                        prevHeading.style.transition = 'all 1s ease-in-out'
                        prevHeading.style.opacity = 1
                        prevHeading.style.transform = 'translateY(0px)'
                    }
                    if(prevText){
                        prevText.style.transition = 'all 1s ease-in-out'
                        prevText.style.opacity = 1
                        prevText.style.transform = 'translateX(0px)'
                    }
                    if(prevFooter){
                        prevFooter.style.transition = 'all 1s ease-in-out'
                        prevFooter.style.opacity = 1
                        prevFooter.style.transform =  'translateY(0px)'
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectTwoPrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectTwoPrev()
                    }, 1000);
                }
            }
            if(this.count % 2 === 0 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[3].querySelector('.carousel__item-heading')
                    nextText = this.items[3].querySelector('.carousel__item-text')
                    nextFooter = this.items[3].querySelector('.carousel__item-footer')
                    prevHeading = this.items[2].querySelector('.carousel__item-heading')
                    prevText = this.items[2].querySelector('.carousel__item-text')
                    prevFooter = this.items[2].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateX(1200px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(-500px)'
                }
                if(nextFooter){    
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateY(500px)'
                }
                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(-400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateY(400px)'
                    prevFooter.style.opacity = 0
                }
                const handleEffectTwoNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        nextFooter.style.transform =  'translateY(0px)'
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectTwoNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectTwoNext()
                    }, 1000);
                }
            }
            if(this.count % 3 === 0 && direction === 'prev'){
                if(!isMerge){
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                    prevHeading = this.items[2].querySelector('.carousel__item-heading')
                    prevText = this.items[2].querySelector('.carousel__item-text')
                    prevFooter = this.items[2].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateX(-500px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(500px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(-500px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(-200px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-400px)'
                    prevFooter.style.opacity = 0
                }


                const handleEffectThreePrev = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1.5s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateX(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1.5s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1.5s ease-in-out'
                        nextFooter.style.opacity = 1
                        setTimeout(() => {
                            nextFooter.style.transform =  'translateX(0px)'
                        }, 200);
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectThreePrev()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectThreePrev()
                    }, 1000);
                }
            }
            if(this.count % 3 === 0 && direction === 'next'){
                if(!isMerge){
                    nextHeading = this.items[4].querySelector('.carousel__item-heading')
                    nextText = this.items[4].querySelector('.carousel__item-text')
                    nextFooter = this.items[4].querySelector('.carousel__item-footer')
                    prevHeading = this.items[3].querySelector('.carousel__item-heading')
                    prevText = this.items[3].querySelector('.carousel__item-text')
                    prevFooter = this.items[3].querySelector('.carousel__item-footer')
                }
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(-400px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(500px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(500px)'
                }

                if(prevHeading){
                    prevHeading.style.transform = 'translateY(800px)'
                    prevHeading.style.opacity = 0
                }
                if(prevText){
                    prevText.style.transform = 'translateX(-400px)'
                    prevText.style.opacity = 0
                }
                if(prevFooter){
                    prevFooter.style.transform = 'translateX(-800px)'
                    prevFooter.style.opacity = 0
                }

                const handleEffectThreeNext = () =>{
                    if(nextHeading){
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.opacity = 1
                        nextHeading.style.transform = 'translateY(0px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.opacity = 1
                        nextText.style.transform = 'translateX(0px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.opacity = 1
                        setTimeout(() => {
                            nextFooter.style.transform =  'translateX(0px)'
                        }, 200);
                    }
                }

                if(!isFade){
                    setTimeout(() => {
                        handleEffectThreeNext()
                    }, 100);
                }else{
                    setTimeout(() => {
                        handleEffectThreeNext()
                    }, 1000);
                }
            }
        }else{
            if(this.count === 1 && direction==='prev'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateY(-500px)'
                    }
                    if(nextText){

                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.opacity = 0
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.transform = 'translateX(500px)'
                    }
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(-500px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        if(nextFooter){

                            nextFooter.style.opacity = 1
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(0px)'
                        }
                    }, 100);
                }, 1000);
            }
            if(this.count === 1 && direction==='next'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextText){

                            nextText.style.opacity = 0
                            nextText.style.transition = 'all 1s ease-in-out'
                            nextText.style.transform = 'translateX(500px)'
                        }
                    }, 200);
                    setTimeout(() => {
                        if(nextFooter){

                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(500px)'
                        }
                    }, 400);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(800px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(800px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(-800px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                        setTimeout(() => {
                            if(nextFooter){

                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1600);
            }
            if(this.count % 2 === 0 && direction==='prev'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'    
                        nextHeading.style.transform = 'translateX(800px)'
                    }
                    if(nextText){
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(-500px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateX(800px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(400px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(800px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){

                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){

                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
            if(this.count % 2 === 0 && direction==='next'){
                if(nextHeading){

                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){

                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){

                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translatY(800px)'
                    }
                    if(nextText){

                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateX(-500px)'
                    }
                    if(nextFooter){

                        nextFooter.style.opacity = 0
                        nextFooter.style.transition = 'all 1s ease-in-out'
                        nextFooter.style.transform = 'translateY(-800px)'
                    }
                }, 100);
                setTimeout(() => {
                    if(nextHeading){

                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateX(-400px)'
                    }
                    if(nextText){

                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(-400px)'
                    }
                    if(nextFooter){

                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateX(-400px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){

                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateX(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateX(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1400);
            }
            if(this.count % 3 === 0 && direction==='prev'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateX(800px)'
                    }
                    if(nextText){
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateY(-500px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateY(800px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(400px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateY(800px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){
                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateY(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
            if(this.count % 3 === 0 && direction==='next'){
                if(nextHeading){
                    nextHeading.style.transition = 'all 0s ease-in-out'
                    nextHeading.style.transform = 'translateY(0px)'
                }
                if(nextText){
                    nextText.style.transition = 'all 0s ease-in-out'
                    nextText.style.transform = 'translateX(0px)'
                }
                if(nextFooter){
                    nextFooter.style.transition = 'all 0s ease-in-out'
                    nextFooter.style.transform = 'translateX(0px)'
                }
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.opacity = 0
                        nextHeading.style.transition = 'all 1s ease-in-out'
                        nextHeading.style.transform = 'translateY(-400px)'
                    }
                    if(nextText){    
                        nextText.style.opacity = 0
                        nextText.style.transition = 'all 1s ease-in-out'
                        nextText.style.transform = 'translateY(-800px)'
                    }
                    setTimeout(() => {
                        if(nextFooter){
                            nextFooter.style.opacity = 0
                            nextFooter.style.transition = 'all 1s ease-in-out'
                            nextFooter.style.transform = 'translateY(-1200px)'
                        }
                    }, 200);
                }, 100);
                setTimeout(() => {
                    if(nextHeading){
                        nextHeading.style.transition = 'all 0s ease-in-out'
                        nextHeading.style.transform = 'translateY(400px)'
                    }
                    if(nextText){
                        nextText.style.transition = 'all 0s ease-in-out'
                        nextText.style.transform = 'translateX(-800px)'
                    }
                    if(nextFooter){
                        nextFooter.style.transition = 'all 0s ease-in-out'
                        nextFooter.style.transform = 'translateY(900px)'
                    }
                    setTimeout(() => {
                        if(nextHeading){
                            nextHeading.style.opacity = 1
                            nextHeading.style.transition = 'all 1s ease-in-out'
                            nextHeading.style.transform = 'translateY(0px)'
                        }
                        setTimeout(() => {
                            if(nextText){
                                nextText.style.opacity = 1
                                nextText.style.transition = 'all 1s ease-in-out'
                                nextText.style.transform = 'translateX(0px)'
                            }
                        }, 200);
                        setTimeout(() => {
                            if(nextFooter){
                                nextFooter.style.opacity = 1
                                nextFooter.style.transition = 'all 1s ease-in-out'
                                nextFooter.style.transform = 'translateY(0px)'
                            }
                        }, 400);
                    }, 100);
                }, 1000);
            }
        }
    }
    handleCarouselEffect(el,direction,isVertical){
        const view  = el.querySelector('.carousel__view')
        const isFade = [...el.classList].filter(c => /carousel__fade/.test(c)).length > 0 ? true : false
        const isMerge = [...el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
        const isSlide = [...el.classList].filter(c => /carousel__slide/.test(c)).length > 0 ? true : false
        const isTextEffect = [...el.classList].filter(c => /carousel__with-text-effect/.test(c)).length > 0 ? true : false
        let items = [...view.querySelectorAll('.carousel__item')]

        let maxLengthX = 0
        let maxLengthY = 0
        let stepX = 0
        let stepY = 0

        items.forEach(el => maxLengthX += el.clientWidth)
        items.forEach(el => maxLengthY += el.clientHeight)
        if(items.length > 0){
            stepX = items[0].clientWidth
            stepY = items[0].clientHeight
        }
        if(!isMerge){
            if(direction ==='prev' && !isVertical){
                this.moveX += stepX
                if(this.moveX >= -stepX){
                    this.count = items.length - 4
                    if(view){
                        view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                        }
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            this.moveX = -maxLengthX + stepX * 3 
                            view.style.transform = `translateX(${this.moveX}px)`
                            if(isFade){
                                setTimeout(() => {
                                    view.style.transition = 'all 1s ease-in-out'
                                    view.style.opacity = 1
                                },200);
                            }
                        }, 1000);
                    }
                }else{
                    this.count -= 1
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                            setTimeout(() => {
                                view.style.transition = 'all 0s ease-in-out'
                                view.style.transform = `translateX(${this.moveX}px)`
                                if(isFade){
                                    setTimeout(() => {
                                        view.style.transition = 'all 1s ease-in-out'
                                        view.style.opacity = 1
                                    },200);
                                }
                            }, 1000);
                        }
                    }
                }
            }
            if(direction ==='next' && !isVertical){
                this.moveX -= stepX
                if(this.moveX < -maxLengthX + stepX * 3){
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                        }
                        this.count = 1
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            this.moveX = -stepX * 2
                            view.style.transform = `translateX(${this.moveX}px)`
                            if(isFade){
                                setTimeout(() => {
                                    view.style.transition = 'all 1s ease-in-out'
                                    view.style.opacity = 1
                                },200);
                            }
                        }, 1000);
                    }
                }else{
                    this.count += 1
                    if(view){
                    view.style.transition = 'all 1s ease-in-out'
                        if(!isFade){
                            view.style.transform = `translateX(${this.moveX}px)`
                        }else{
                            view.style.opacity = 0
                            setTimeout(() => {
                                view.style.transition = 'all 0s ease-in-out'
                                view.style.transform = `translateX(${this.moveX}px)`
                                if(isFade){
                                    setTimeout(() => {
                                        view.style.transition = 'all 1s ease-in-out'
                                        view.style.opacity = 1
                                    },200);
                                }
                            }, 1000);
                        }
                    }
                }
            }
            if(direction ==='prev' && isVertical){
            this.moveY += stepY
            if(this.moveY >= -stepY){
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    this.count = items.length - 4
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                    }
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        this.moveY = -maxLengthY + stepY * 3
                        view.style.transform = `translateY(${this.moveY}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }
                    }, 1000);
                }
            }else{
                this.count -= 1
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            view.style.transform = `translateY(${this.moveY}px)`
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }, 1000);
                    }
                }
            }
            }
            if(direction ==='next' && isVertical){
            this.moveY -= stepY
            if(this.moveY < -maxLengthY + stepY * 3){
                if(view){

                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                    }
                    this.count = 1
                    setTimeout(() => {
                        view.style.transition = 'all 0s ease-in-out'
                        this.moveY = -stepY * 2
                        view.style.transform = `translateY(${this.moveY}px)`
                        if(isFade){
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }else{
                            
                        }
                    }, 1000);
                }
            }else{
                this.count += 1
                if(view){
                    view.style.transition = 'all 1s ease-in-out'
                    if(!isFade){
                        view.style.transform = `translateY(${this.moveY}px)`
                    }else{
                        view.style.opacity = 0
                        setTimeout(() => {
                            view.style.transition = 'all 0s ease-in-out'
                            view.style.transform = `translateY(${this.moveY}px)`
                            setTimeout(() => {
                                view.style.transition = 'all 1s ease-in-out'
                                view.style.opacity = 1
                            }, 200);
                        }, 1000);
                    }
                }
            }
            }
        }else{
            const item = items[2]
            item.style.transition = 'all 1s ease-in-out'
            item.style.backgroundSize = 'cover'
            if(direction ==='prev' && !isVertical){
                this.moveX += stepX
                if(item){
                    if(this.moveX >= -stepX){
                        this.count = items.length - 4
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                        setTimeout(() => {
                            this.moveX = -maxLengthX + stepX * 3 
                        },1000)
                    }else{
                        this.count -= 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }    
                }
            }
            if(direction ==='next' && !isVertical){
                this.moveX -= stepX
                if(item){
                    if(this.moveX < -maxLengthX + stepX * 3){
                        item.style.backgroundImage = `url(${this.srcs[this.count-1]})`
                        this.count = 1
                        setTimeout(() => {
                            this.moveX = -stepX * 2
                        }, 1000);
                    }else{
                        this.count += 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            if(direction ==='prev' && isVertical){
                this.moveY += stepY
                if(item){
                    if(this.moveY >= -stepY){
                        this.count = items.length - 4
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    setTimeout(() => {
                        this.moveY = -maxLengthY + stepY * 3
                    }, 1000);
                }else{
                        this.count -= 1
                        item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            if(direction ==='next' && isVertical){
                this.moveY -= stepY
                if(item){
                    if(this.moveY < -maxLengthY + stepY * 3){
                        this.count = 1
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    setTimeout(() => {
                        this.moveY = -stepY * 2
                    }, 1000);
                }else{
                    this.count += 1
                    item.style.backgroundImage = `url(${this.srcs[this.count+1]})`
                    }
                }
            }
            let body = item.querySelector('.carousel__item-body')
            let heading = item.querySelector('.carousel__item-heading')
            let text = item.querySelector('.carousel__item-text')
            let footer = item.querySelector('.carousel__item-footer')
            if(!body){
                body = document.createElement('div')
                body.classList.add('carousel__item-body')
                item.appendChild(body)
            }
            if(!heading){
                heading = document.createElement('div')
                heading.classList.add('carousel__item-heading')
                body.appendChild(heading)
            }
            if(!text){
                text = document.createElement('div')
                text.classList.add('carousel__item-text')
                body.appendChild(text)
            }
            if(!footer){
                footer = document.createElement('div')
                footer.classList.add('carousel__item-footer')
                body.appendChild(footer)
            }
            const nextHeadings = items[this.count+1].querySelectorAll('.carousel__item-heading > *')
            const nextTexts = items[this.count+1].querySelectorAll('.carousel__item-text > *')
            const nextFooters = items[this.count+1].querySelectorAll('.carousel__item-footer > *')
            if(this.count !== 1){
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[this.count - 1] = [...tempHeadings]
                this.texts[this.count - 1] = [...tempTexts]
                this.footers[this.count - 1] = [...tempFooters]
            }
            if(heading){
                heading.innerHTML = ''
                this.headings[this.count-1].forEach(h =>{
                    const el = document.createElement(`${h.tag}`)
                    el.textContent = h.text
                    heading.appendChild(el)
                })
            }
            if(text){
                text.innerHTML = ''
                this.texts[this.count-1].forEach(t =>{
                    const el = document.createElement(`${t.tag}`)
                    el.textContent = t.text
                    text.appendChild(el)
                })
            }
            if(footer){
                footer.innerHTML = ''
                this.footers[this.count-1].forEach(f =>{
                    const el = document.createElement(`${f.tag}`)
                    el.textContent = f.text
                    footer.appendChild(el)
                })
            }
        }

        const setTimeoutTime = (isFade) =>{
            if(isFade){
                return 2000
            }else{
                return 1000
            }
        }

        if(isTextEffect && isMerge | isFade | isSlide){
            this.handleCarouselTextEffectIn(direction,isMerge,isFade)
        }else if(isMerge){
           const body = items[2].querySelector('.carousel__item-body')
           if(body){
               body.style.opacity = 0
               body.style.transition = 'all 0s ease-in-out'
               setTimeout(() => {
                   body.style.transition = 'all 1s ease-in-out'
                   body.style.opacity = 1
                }, 1000);
            }
        }else if(isFade | isSlide){
            const body = items[this.count+1].querySelector('.carousel__item-body')
            if(body){
                body.style.opacity = 0
                body.style.transition = 'all 0s ease-in-out'
                setTimeout(() => {
                    const heading = body.querySelector('.carousel__item-heading')
                    const text = body.querySelector('.carousel__item-text')
                    const footer = body.querySelector('.carousel__item-footer')
                    if(heading){
                        heading.style.opacity = 1
                    }
                    if(text){
                        text.style.opacity = 1
                    }
                    if(footer){
                        footer.style.opacity = 1
                    }
                    body.style.transition = 'all 1s ease-in-out'
                    body.style.opacity = 1
                }, setTimeoutTime(isFade));
            }
        }
        this.handleActivePin()
    }
    handleCarousel(){
        this.elements.forEach(el =>{
            const prev = el.querySelector('.carousel__prev')
            const next = el.querySelector('.carousel__next')
            const view  = el.querySelector('.carousel__view')
            const isMerge = [...el.classList].filter(c => /carousel__merge/.test(c)).length > 0 ? true : false
            const first_heading = view.querySelectorAll('.carousel__item-heading')
            const first_text = view.querySelectorAll('.carousel__item-text')
            const first_footer = view.querySelectorAll('.carousel__item-footer')
            if(first_heading){
                first_heading[1].style.opacity = 1
            }
            if(first_text){
                first_text[1].style.opacity = 1
            }
            if(first_footer){
                first_footer[1].style.opacity = 1
            }
            let items = [...view.querySelectorAll('.carousel__item')]
            const last = items[0].cloneNode(true)
            const first = items[items.length - 1].cloneNode(true)
            let stepX
            let stepY
            items.push(last)
            items.unshift(first)
            view.innerHTML = ''
            items.forEach(i => {
                if(view){
                    view.append(i)
                }
            })
            this.items = items
            const isVertical  = [...el.classList].filter(c => /carousel__vertical/gi.test(c))
            if(items.length > 0 && isVertical.length === 0){
                stepX = items[0].clientWidth
                this.moveX -= stepX * 2
                if(view){
                    view.style.transition = 'all 0s ease-in-out'
                    view.style.transform = `translateX(${this.moveX}px)`
                }
            }else if(items.length > 0 && isVertical.length > 0){
                stepY = items[0].clientHeight
                this.moveY -= stepY * 2
                if(view){
                    view.style.transition = 'all 0s ease-in-out'
                    view.style.transform = `translateY(${this.moveY}px)`
                }
            }
            if(isMerge){
                const first_heading = view.querySelectorAll('.carousel__item-heading')
                const first_text = view.querySelectorAll('.carousel__item-text')
                const first_footer = view.querySelectorAll('.carousel__item-footer')
                if(first_heading){
                    first_heading[2].style.opacity = 1
                }
                if(first_text){
                    first_text[2].style.opacity = 1
                }
                if(first_footer){
                    first_footer[2].style.opacity = 1
                }
                this.srcs = items.map(i =>{
                    const img = i.querySelector('img')
                    img.style.visibility = 'hidden'
                    const src = img.src
                    return src
                })
                items.forEach(i => {
                    const img = i.querySelector('img')
                    img.style.visibility = 'hidden'
                })
                const image = items[2].querySelector('img')
                items[2].style.backgroundImage = `url(${image.src})`
                items[2].style.backgroundSize = 'cover'
                const nextHeadings = items[2].querySelectorAll('.carousel__item-heading > *')
                const nextTexts = items[2].querySelectorAll('.carousel__item-text > *')
                const nextFooters = items[2].querySelectorAll('.carousel__item-footer > *')
                let tempHeadings = []
                let tempTexts = []
                let tempFooters = []
                nextHeadings.forEach(h => {
                    tempHeadings.push({tag:h.tagName.toLowerCase(),text:h.textContent})
                })
                nextTexts.forEach(t => {
                    tempTexts.push({tag:t.tagName.toLowerCase(),text:t.textContent})
                })
                nextFooters.forEach(f => {
                    tempFooters.push({tag:f.tagName.toLowerCase(),text:f.textContent})
                })
                this.headings[0] = [...tempHeadings]
                this.texts[0] = [...tempTexts]
                this.footers[0] = [...tempFooters]
            }
            if(isVertical.length > 0){
                if(prev){

                    prev.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'prev',true)
                        this.isPlay = true
                        setTimeout(() => {
                            this.isPlay = false
                        }, 1000);
                    }
                })
            }
            if(next){

                next.addEventListener('click',(e) => {
                    if(!this.isPlay){
                        this.handleCarouselEffect(el,'next',true)
                        this.isPlay = true
                        setTimeout(() => {
                            this.isPlay = false
                        }, 1000);
                    }
                })
            }
            }else{
                if(prev){

                    prev.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'prev',false)
                            this.isPlay = true
                            setTimeout(() => {
                                this.isPlay = false
                            }, 1000);
                        }
                    })
                }
                if(next){
                    next.addEventListener('click',(e) => {
                        if(!this.isPlay){
                            this.handleCarouselEffect(el,'next',false)
                            this.isPlay = true
                            setTimeout(() => {
                                this.isPlay = false
                            }, 1000);
                        }
                    })
                }
            }
        }) 
    }
    handleSetup(){
        this.handleSetButtons()
        this.handleSetPins()
        this.handleCarousel()
    }
}
class Divider{
    constructor(){
        this.elements = document.querySelectorAll('.divider')
    }
    handleSetup(){
        this.elements.forEach(el => {
            const content = el.querySelector(':nth-child(2)')
            const dividersHorizontal = el.querySelectorAll(`[class^="divider__horizontal"]`)
            const dividersVertical = el.querySelectorAll(`[class^="divider__vertical"]`)
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const percentageX = ( screenWidth - content.clientWidth ) / screenWidth;
            const percentageY = ( screenHeight - content.clientHeight ) / screenHeight;
            const pxY = (content.clientHeight / 2);  
            const pxX = (content.clientWidth / 2);  
            if(!content.classList.contains('divider__text-vertical')){
                dividersHorizontal.forEach(d => {
                    el.style.width = '100%'
                    d.style.width = percentageX * 100 / 2 - 3 + '%'
                    d.style.top = pxY + 'px'
                })
            }else{
                dividersVertical.forEach(d => {
                    el.style.height = '100%'
                    d.style.height = percentageY * 100 / 2 - 3 + '%'
                    d.style.left = pxX + 'px'
                })
            }
            const isAnimation = [...el.classList].filter(c => /divider__with-animation/.test(c)).length > 0 ? true : false
            if(isAnimation){
                content.addEventListener('mouseenter',(e) => {
                    if(dividersHorizontal[0] || dividersVertical[0] ){
                        if(dividersHorizontal[0]){
                            dividersHorizontal[0].style.transform = 'translateX(-10px)'
                        }
                        if(dividersVertical[0]){
                            dividersVertical[0].style.transform = 'translateY(-10px)'
                        }
                    }
                    if(dividersHorizontal[1] || dividersVertical[1] ){
                        if(dividersHorizontal[1]){
                            dividersHorizontal[1].style.transform = 'translateX(10px)'
                        }
                        if(dividersVertical[1]){
                            dividersVertical[1].style.transform = 'translateY(10px)'
                        }
                    }
                })
                content.addEventListener('mouseout',(e) => {
                    if(dividersHorizontal[0] || dividersVertical[0] ){
                        if(dividersHorizontal[0]){
                            dividersHorizontal[0].style.transform = 'translateX(0px)'
                        }
                        if(dividersVertical[0]){
                            dividersVertical[0].style.transform = 'translateY(0px)'
                        }
                    }
                    if(dividersHorizontal[1] || dividersVertical[1] ){
                        if(dividersHorizontal[1]){
                            dividersHorizontal[1].style.transform = 'translateX(0px)'
                        }
                        if(dividersVertical[1]){
                            dividersVertical[1].style.transform = 'translateY(0px)'
                        }
                    }
                })
            }
        })
    }
}
class Tooltip{
    constructor(){
        this.elements = document.querySelectorAll('.tooltip')
    }
    handleSetup(){
        this.elements.forEach(el =>{
            const child = document.querySelector('[class^="tooltip__content"]')
            // const header = document.querySelector('[class^="tooltip__header"]')
            if(child.classList.contains('tooltip__content-left')){
                child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                child.style.left = el.offsetLeft - child.clientWidth - 100 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                        child.style.left = el.offsetLeft - child.clientWidth - 10 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.left = el.offsetLeft - child.clientWidth - 100 + 'px'
                    }
                })
            }
            if(child.classList.contains('tooltip__content-right')){
                child.style.left = el.offsetLeft + el.clientWidth + 100 + 'px'
                child.style.top = el.offsetTop + el.clientHeight / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.left = el.offsetLeft + el.clientWidth  + 10 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.left = el.offsetLeft + el.clientWidth + 100 + 'px'
                    }
                })
            }
            if(child.classList.contains('tooltip__content-top')){
                child.style.top = el.offsetTop - 200 + 'px'
                child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop - child.clientHeight - 10 + 'px'

                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.top = el.offsetTop - 200 + 'px'

                    }
                })
            }
            if(child.classList.contains('tooltip__content-bottom')){
                child.style.top = el.offsetTop + el.clientHeight + 100 + 'px'
                child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                el.addEventListener('mouseenter',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight + 10 + 'px'
                        child.style.left = el.offsetLeft + el.clientWidth / 2 + 'px'
                    }
                })
                el.addEventListener('mouseleave',()=>{
                    if(child){
                        child.style.top = el.offsetTop + el.clientHeight + 100 + 'px'
                    }
                })
            }
        })
    }
}
class Tabs{
    constructor() {
        this.elements = document.querySelectorAll('.tabs')
    }
    handleTab(e,dataTab){
        this.elements.forEach(el =>{
            const links = el.querySelectorAll('.tabs__nav-item')
            const tabs = el.querySelectorAll('.tabs__tab')
            const view = el.querySelector('.tabs__view')
       
            const wrapper = view.parentElement
            const tab = [...tabs].find(t => t.getAttribute('data-tab') === dataTab)
            links.forEach(l => l.classList.remove('active'))
            e.target.classList.add('active')
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')
            const isFade = [el.classList].filter(c => /tabs__fade/.test(c)).length > 0 ? true : false
            const isSlideX = [el.classList].filter(c => /tabs__slide-x/.test(c)).length > 0 ? true : false
            const isSlideY = [el.classList].filter(c => /tabs__slide-y/.test(c)).length > 0 ? true : false
            const handleTabIn = () =>{
                tabs.forEach(t => t.style.display = 'none');
                if(tab){
                    tab.style.display = 'block'
                    tab.style.opacity = 0
                }
                setTimeout(()=>{
                    if(tab){
                        tab.style.opacity = 1
                    }
                },100)
            }
            if(isFade){
                handleTabIn()
            }else if(isSlideX){
                if(view){
                    view.style.transform = `translateX(-${tab.offsetLeft}px)`
                }
            }else if(isSlideY){
                if(wrapper){
                    wrapper.style.height = tab.clientHeight + 2 + 'px'
                }
                if(view){
                    view.style.transform = `translateY(-${tab.offsetTop}px)`
                }
            }else{
                tabs.forEach(t => t.style.transition = 'all 0s ease-in-out')
                handleTabIn()
            }
        })
        
    }
    handleTabs(){
        this.elements.forEach(el => {
            const tabs = el.querySelectorAll('.tabs__tab')
            const wrapper = el.querySelector('.tabs__tabs-wrapper')
            const links = el.querySelectorAll('.tabs__nav-item')
            const isSlideY = [el.classList].filter(c => /tabs__slide-y/.test(c)).length > 0 ? true : false
            links.forEach((link,index) =>{
                const data_tab = link.getAttribute('data-tab')
                if(!data_tab){
                    link.setAttribute('data-tab',index + 1)
                }
                const data_tab_tab = tabs[index].getAttribute('data-tab')
                if(!data_tab_tab){
                    tabs[index].setAttribute('data-tab',index + 1)
                }
            })
            if(isSlideY){
                if(wrapper){
                    wrapper.style.height = tabs[0].clientHeight + 2 + 'px'
                }
            }
            links.forEach(link => {
                const dataTab = link.getAttribute('data-tab')
                link.addEventListener('click',(e)=>this.handleTab(e,dataTab))
            })
        })
    }
    handleSetup(){
        this.handleTabs()
    }
}
class Input {
    constructor(){
        this.elements = document.querySelectorAll('[class*="input__field"]')
    }
    handleResetLabel(){
        this.elements.forEach(el => {
            const label = el.querySelector('label')
            const input = el.querySelector('input')
            if(label && input){
                label.style.top = input.clientHeight / 2 - 8  + 'px'
                label.style.left = input.offsetLeft / 2 + 5 + 'px'
            }
        })
    }
    handleLabel(label){
        if(label){
            label.style.top = -15 + 'px'
            label.style.transform = 'scale(0.7)'
            label.style.fontStyle = 'normal'
        }
    }
    handleInput(el,label){
        this.handleResetLabel()
        const isLine = [el.classList].find(c => /input__field-line/.test(c))
        const isNormal = [el.classList].find(c => /input__field-normal/.test(c))
        const isUndersoce = [el.classList].find(c => /input__field-underscore/.test(c))
        if(isNormal){
            this.handleLabel(label)
        }
        if(isLine){
            this.handleLabel(label)
            el.style.borderBottom = `1px solid var(--light-olive)`
        }
        if(isUndersoce){
            this.handleLabel(label)
            const underscores = document.querySelectorAll('.input__underscore-line-effect')
            underscores.forEach(el => el.style.width = '0px')
            const current = el.querySelector('.input__underscore-line-effect')
            if(current){
                current.style.width = '100%'
            }
        }
    }
    handleSetup(){
        this.elements.forEach(el =>{
            const label = el.querySelector('label')
            const input = el.querySelector('input')
            if(label && input){
                label.style.top = input.clientHeight / 2 - 8  + 'px'
                label.style.left = input.offsetLeft / 2 + 5 + 'px'
                input.addEventListener('click',(e)=>this.handleInput(el,label))
            }
        })
    }
}
class Modal{
    constructor(){
        this.elements = document.querySelectorAll('.modal-wrapper')
        this.open_modal_btns = document.querySelectorAll('.modal__open-modal')
        this.close_modal_btns = document.querySelectorAll('.modal__close-modal')
    }
    handleModal(btn){
        this.elements.forEach(el => {
            const modal = el.querySelector('.modal')
            const btn_id = btn.getAttribute('data-target')
            const el_id = btn.getAttribute('data-target')
            if(btn_id === el_id){
                
                const isCombine = [...modal.classList].filter(c => /modal__combine/.test(c)).length > 0 ? true : false
                const modal_wrapper = el
                const modal_overlay = modal_wrapper.querySelector('.modal__overlay')
                const modal_img = el.querySelector('.modal__img')
                const modal_header = el.querySelector('.modal__header')
                const modal_text = el.querySelector('.modal__text')
                const modal_footer = el.querySelector('.modal__footer')
                const modal_controls = el.querySelector('.modal__controls')

                if(isCombine){
                    if(modal_wrapper){
                        modal_wrapper.style.transition = 'all 0s ease-in-out'
                        modal_wrapper.style.display = 'block'
                        modal_wrapper.style.opacity = '1'
                    }

                    if(modal_overlay){
                        modal_overlay.style.opacity = 0
                    }
                    
                    if(modal){
                        modal.style.opacity = 0;
                    }

                    if(modal_img){
                        modal_img.style.transform = 'translateY(-2000px)'
                    }

                    if(modal_header){
                        modal_header.style.opacity = 0
                        modal_header.style.transform = 'translateX(2500px)'
                    }
                    
                    if(modal_text){
                        modal_text.style.opacity = 0
                        modal_text.style.transform = 'translateX(-2500px)'
                    }
                    
                    if(modal_footer){
                        modal_footer.style.opacity = 0
                        modal_footer.style.transform = 'translateY(2500px)'
                    }
                    
                    if(modal_controls){
                        modal_controls.style.opacity = 0
                    }
                    
                    setTimeout(() => {

                        if(modal){
                            modal.style.transition = 'all 1s ease-in-out'
                            modal.style.opacity =  1
                        }
                        
                        if(modal_overlay){
                            modal_overlay.style.transition = 'all 1s ease-in-out'
                            modal_overlay.style.opacity = 1
                        }
                        if(modal_img){
                            modal_img.style.transition = 'all 2s ease-in-out'
                            modal_img.style.transform = 'translateY(0px)'
                        }
                        
                        if(modal_header){
                            modal_header.style.transition = 'all 2s ease-in-out'
                            modal_header.style.opacity = 1
                            modal_header.style.transform = 'translateX(0px)'
                        }
                        
                        if(modal_text){
                            modal_text.style.transition = 'all 2s ease-in-out'
                            modal_text.style.opacity = 1
                            modal_text.style.transform = 'translateX(0px)'
                        }
                        
                        if(modal_footer){
                            modal_footer.style.transition = 'all 2s ease-in-out'
                            modal_footer.style.opacity = 1
                            modal_footer.style.transform = 'translateY(0px)'
                        }
                        
                        if(modal_controls){
                            modal_controls.style.transition = 'all 3s ease-in-out'
                            modal_controls.style.opacity = 1
                        }
                    }, 100);       
                }
                else{
                    if(modal_wrapper){
                        modal_wrapper.style.display = 'block'
                        modal_wrapper.style.opacity = 0
                        setTimeout(() => {
                            modal_wrapper.style.transition = 'all 1s ease-in-out'
                            modal_wrapper.style.opacity = 1
                        }, 100);
                    }
                }
            }
        })
    }
    handleCloseModal(btn){
        this.elements.forEach(el => {
            const btn_id = -btn.getAttribute('data-target')
            const el_id = -btn.getAttribute('data-target')
            if(btn_id === el_id){
                el.style.transition = 'all 1s ease-in-out'
                el.style.opacity = 0
                setTimeout(() => {
                    el.style.display = 'none'
                }, 1000);
            }
        })
    }
    handleSetup(){
        this.open_modal_btns.forEach(button => {
            button.addEventListener('click',()=>this.handleModal(button))
        })
        this.close_modal_btns.forEach(button => {
            button.addEventListener('click',() => this.handleCloseModal(button))
        })
    }
}
class Parallax {
    constructor(){
        this.elements = document.querySelectorAll('.parallax')
    }
    handleParrallax(e,el){
        var viewportOffset = el.getBoundingClientRect();
        const scrollY = -viewportOffset.top / 1.5
        const offesetBottom = viewportOffset.bottom 
        const parallax_imgs = el.querySelectorAll('.parallax__img')
        const parallax_content = el.querySelector('.parallax__content')
        const parallax_content_header = parallax_content.querySelector('.parallax__content-header')
        const parallax_content_text = parallax_content.querySelector('.parallax__content-text')
        const isSlide = [...el.classList].filter(c => /parallax__slide/.test(c)).length > 0 ? true : false
        const isFade = [...el.classList].filter(c => /parallax__fade/.test(c)).length > 0 ? true : false
        if(isSlide){
            if(parallax_content_header){
                parallax_content_header.style.transform = `translateX(${parallax_content_header.getBoundingClientRect().top * 2.15}px)`
            }
            if(parallax_content_text){
                parallax_content_text.style.transform = `translateX(-${parallax_content_text.getBoundingClientRect().top * 2.4}px)`
            }
        }
        if(isFade){
            const r = parallax_content.getBoundingClientRect()
            if(r.top < 270){
                if(parallax_content_header){
                    parallax_content_header.style.opacity = 1
                }
                if(parallax_content_text){
                    parallax_content_text.style.opacity = 1
                }
            }
        }
        
        parallax_imgs.forEach(img =>{
            if(img.offsetTop + img.clientHeight + el.clientHeight / 3.5 > offesetBottom){
                img.style.transform = `translateY(${scrollY}px)`
            }     
        })
    }
    handleSetup(){
        this.elements.forEach(el => {
            const parallax_imgs = el.querySelectorAll('.parallax__img')
            const parallax_content = el.querySelector('.parallax__content')
           
                const parallax_content_header = parallax_content?.querySelector('.parallax__content-header')
                const parallax_content_text = parallax_content?.querySelector('.parallax__content-text')
                const isSlide = [...el.classList].filter(c => /parallax__slide/.test(c)).length > 0 ? true : false
                const isFade = [...el.classList].filter(c => /parallax__fade/.test(c)).length > 0 ? true : false
            if(isSlide){
                if(parallax_content_header){
                    parallax_content_header.style.transition = 'all 0s ease-in-out'
                    parallax_content_header.style.left = '-460px'
                }
                if(parallax_content_text){
                    parallax_content_text.style.transition = 'all 0s ease-in-out'
                    parallax_content_text.style.left = '750px'
                }
            }
            if(isFade){
                if(parallax_content_header){
                    parallax_content_header.style.opacity = 0
                    parallax_content_text.style.transition = 'all 1s ease-in-out'
                    parallax_content_header.style.left = '0px'

                }
                if(parallax_content_text){
                    parallax_content_text.style.opacity = 0
                    parallax_content_text.style.transition = 'all 1s ease-in-out'
                    parallax_content_text.style.left = '0px'

                }
            }
            setTimeout(() => {
                parallax_imgs.forEach(el => {
                    const img = el.querySelector('img')
                    el.style.height = img.clientHeight + 'px'
                })
            }, 200);
            window.addEventListener('scroll',(e) => this.handleParrallax(e,el))
        })
    }
}
class Progress{
    constructor(){
        this.elements = document.querySelectorAll('.progress')
        this.round_elements = document.querySelectorAll('.progress-round')
    }
    handleMixedProgess(){
        this.elements.forEach(el =>{
            const isMixed = [...el.classList].filter(c => /progress__mixed/.test(c)).length > 0 ? true : false
            const progress_bar = el.querySelector('.progress__bar')
            const progress_mixed_wrapper = document.createElement('div')
            progress_mixed_wrapper.classList.add('progress__mixed-wrapper')
            progress_bar.appendChild(progress_mixed_wrapper)
            if(isMixed){
                for(let i = progress_bar.clientWidth + 500; i > 0; i -= 20){
                    const progress_mixed_item = document.createElement('div')
                    if(progress_mixed_item){
                        progress_mixed_item.style.backgroundColor = 'var(--medium-white)'
                        progress_mixed_item.style.minWidth = '20px'
                        progress_mixed_item.style.height = '20px'
                        progress_mixed_item.classList.add('progress__mixed-item')
                    }
                    progress_mixed_wrapper.appendChild(progress_mixed_item)
                }
            }
        })
    }
    handleProgress(id_or_progress_el,progress_percentage){
        let el
        if(typeof id_or_progress_el === 'string'){
            el = document.querySelector(`#${id_or_progress_el}`)
        }else{
            el = id_or_progress_el
        }
        if(el){
            const width = el.clientWidth
            const step = width / 100
            const progress_bar = el.querySelector('.progress__bar')
            const position = el.querySelector('.progress__position')
            const position_round = el.querySelector('.progress-round__position')
            if(progress_percentage <= 100){
                if(position_round){
                    position_round.textContent = progress_percentage + '%'
                }
                if(position){
                    position.textContent = progress_percentage + '%'
                }
            }
            if(progress_bar){
                progress_bar.style.width = progress_percentage * step + 'px'
            }
        }
    }
    handleRoundProgress(){
        this.round_elements.forEach(el =>{
            const progress_position = el.querySelector('.progress-round__position')
            const position_background = getComputedStyle(progress_position).backgroundColor
            progress_position.style.boxShadow = `0px 0px 10px ${position_background}`
            for(let i = 360; i > 0; i -= 20){
                const progress_dot_wrapper = document.createElement('div')
                progress_dot_wrapper.classList.add('progress-round__dot-wrapper')
                progress_dot_wrapper.style.height = el.clientHeight / 3 + 'px'
                progress_dot_wrapper.style.top = '18%'
                progress_dot_wrapper.style.left = '44%'
                const progress_dot = document.createElement('div')
                progress_dot.classList.add('progress-round__dot')
                const classRegex = /progress-round__dot-[a-zA-Z]+/gi
                const el_background = [...el.classList].find(c => classRegex.test(c))
                progress_dot.classList.add(el_background)
                progress_dot_wrapper.style.transform = `rotate(${i}deg)`
                progress_dot_wrapper.appendChild(progress_dot)
                const items_odd = [
                    { transform: `rotate(${i}) scale(1.5)` },
                    { transform: `rotate(${360 + i}deg) scale(2)` },
                    { transform: `rotate(${i}) scale(1.5)` },
                  ];
                  const items_odd_timing = {
                    duration: 2000,
                    iterations: 100000,
                  }
                const items_even = [
                    { transform: `rotate(${i}) scale(1.5)` },
                    { transform: `rotate(${360 + i}deg) scale(2)` },
                    { transform: `rotate(${i}) scale(1.5)` },
                  ];
                  const items_even_timing = {
                    duration: 4000,
                    iterations: 100000,
                  }
                  if(i % 40 === 0){
                    progress_dot_wrapper.animate(items_odd,items_odd_timing)
                  }else{
                      progress_dot_wrapper.animate(items_even,items_even_timing)
                  }
                el.appendChild(progress_dot_wrapper)
            }
        })
    }
    handleSetup(){
        this.handleMixedProgess()
        this.handleRoundProgress()
        let p = 0
        setInterval(
            () => {
                p+=1
                this.handleProgress('progess',p)
            },100
        )
    }
}
class Rating{
    constructor() {
        this.elements = document.querySelectorAll('[class^="rating"]')
    }
    handleSetup(){
        this.elements.forEach(el => {
            const ratingRegex = /\d+\.?\d{0,1}$/gi
            const ratingClass = [...el.classList].find(c => ratingRegex.test(c))
            const ratingArray = ratingClass.match(ratingRegex)
            if(ratingArray[0]){
                const rating = ratingArray[0]
                console.log(rating)
                for(let i = 1; i <= rating ; i += 0.5){
                    const rating_star = document.createElement('div')
                    rating_star.classList.add('rating__star')
                    rating_star.style.backgroundColor = getComputedStyle(el).backgroundColor
                    const rating_icon = document.createElement('i')
                    rating_icon.classList.add('rating__icon')
                    rating_icon.classList.add('fa')
                    rating_icon.classList.add('fa-star')
                    const rating_regex = /rating__icon-[0-9]x/gi
                    const rating_size_regex = /[0-9]/gi
                    const rating_icon_size = [...el.classList].find(c =>rating_regex.test(c))
                    const rating_icon_size_number = rating_icon_size.match(rating_size_regex)
                    rating_icon.classList.add(`fa-${rating_icon_size_number}x`)
                    if(i % rating === 0){
                        rating_star.classList.add('rating__star-half')
                        rating_star.appendChild(rating_icon) 
                        el.appendChild(rating_star)
                    }
                    else if(i % 1 === 0){
                        rating_star.appendChild(rating_icon) 
                        el.appendChild(rating_star)
                    }
                }
            }
        })
    }
}
class Sidebar{
    constructor(){
        this.elements = document.querySelectorAll('.sidebar')
        this.open_buttons = document.querySelectorAll('.sidebar__open-sidebar')
        this.html = document.querySelector('html')
    }
    handleSidebarOpen(btn){
        const sidebar_target = btn.getAttribute('data-target-id')
        const sidebar = document.querySelector(`#${sidebar_target}`)
        const isCircle = [...sidebar.classList].filter(c => /sidebar__circle/.test(c)).length > 0 ? true : false
        if(!sidebar.classList.contains('sidebar--open')){
            sidebar.style.transition = 'all 1s ease-in-out'
            if(isCircle){
                sidebar.style.borderTopRightRadius = '0px'
                sidebar.style.borderBottomRightRadius = '0px'
                sidebar.style.borderTopLeftRadius = '0px'
                sidebar.style.borderBottomLeftRadius = '0px'
            }
            if(sidebar.classList.contains('sidebar__top')){
                sidebar.style.transform = 'translateY(0px)'
            }
            if(sidebar.classList.contains('sidebar__right')){
                sidebar.style.transform = 'translateX(0px)'
            }
            if(sidebar.classList.contains('sidebar__bottom')){
                sidebar.style.transform = 'translateY(0px)'
            }
            if(sidebar.classList.contains('sidebar__left')){
                sidebar.style.transform = 'translateX(0px)'
            }
            if(sidebar.classList.contains('sidebar__slide-top-left') | sidebar.classList.contains('sidebar__slide-top-right') | sidebar.classList.contains('sidebar__slide-bottom-right') | sidebar.classList.contains('sidebar__slide-bottom-left')){
                sidebar.style.height = '100%'
            }
            sidebar.classList.add('sidebar--open')
        }else{
            if(sidebar.classList.contains('sidebar__top')){
                sidebar.style.transform = 'translateY(-100%)'
            }
            if(sidebar.classList.contains('sidebar__right')){
                sidebar.style.transform = 'translateX(100%)'
            }
            if(sidebar.classList.contains('sidebar__bottom')){
                sidebar.style.transform = 'translateY(100%)'
            }
            if(sidebar.classList.contains('sidebar__left')){
                sidebar.style.transform = 'translateX(-100%)'
            }
            if(sidebar.classList.contains('sidebar__slide-top-left') | sidebar.classList.contains('sidebar__slide-top-right') | sidebar.classList.contains('sidebar__slide-bottom-right') | sidebar.classList.contains('sidebar__slide-bottom-left')){
                sidebar.style.height = '0%'
            }
            if(sidebar.classList.contains('sidebar__circle-left')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopRightRadius = '100%'
                    sidebar.style.borderBottomRightRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-right')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopLeftRadius = '100%'
                    sidebar.style.borderBottomLeftRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-top')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderBottomLeftRadius = '100%'
                    sidebar.style.borderBottomRightRadius = '100%'
                }, 1000);
            }
            if(sidebar.classList.contains('sidebar__circle-bottom')){
                setTimeout(() => {
                    sidebar.style.transition = 'all 0s ease-in-out'
                    sidebar.style.borderTopLeftRadius = '100%'
                    sidebar.style.borderTopRightRadius = '100%'
                }, 1000);
            }
            sidebar.classList.remove('sidebar--open')
            
        }
    }
    handlePreventClose(){
        this.elements.forEach(el =>{
            el.addEventListener('click',(e)=> e.stopImmediatePropagation())
        })
    }
    handleSetup(){
        this.open_buttons.forEach(btn => btn.addEventListener('click',(e) => {
            e.stopImmediatePropagation()
            this.handleSidebarOpen(btn)
        }))
        this.html.addEventListener('click',(e)=>{
            e.stopImmediatePropagation()
            this.open_buttons.forEach(btn => this.handleSidebarOpen(btn))
        })
    }
}
class Nav{
    constructor(){
        this.hamburgers = document.querySelectorAll('.nav__hamburger')
        this.elements = document.querySelectorAll('.nav')
    }
    handleMenuSetup(){
        if(typeof window !== 'undefined'){
            if(window.innerWidth <= 1024){
                this.elements.forEach(el => {
                    const nav_menu = el.querySelector('.nav__menu')
                    nav_menu.style.transition = 'all 0s ease-in-out'
                    nav_menu.style.top = el.clientHeight + 'px'
                })
            }
        }
    }
    handleMenu(e){
        this.elements.forEach(el => {
            const nav_target = e.target.getAttribute('data-target-id')
            const nav_menu = el.querySelector('.nav__menu')
            const nav_menu_items = [...el.querySelectorAll('[class*="nav__menu-item"]')]
            const nav_overlay = document.querySelector('.nav__overlay')
            if(nav_target === nav_menu.id){
                nav_menu.style.transition = 'all 1s ease-in-out'
                const isFade = [...nav_menu.classList].filter(c => /nav__menu-fade/.test(c)).length > 0 ? true : false
                const isSlide = [...nav_menu.classList].filter(c => /nav__menu-slide/.test(c)).length > 0 ? true : false
                const isSlideLeft = [...nav_menu.classList].filter(c => /nav__menu-slide-left/.test(c)).length > 0 ? true : false
                const isSlideRight = [...nav_menu.classList].filter(c => /nav__menu-slide-right/.test(c)).length > 0 ? true : false
                const isSlideTop = [...nav_menu.classList].filter(c => /nav__menu-slide-top/.test(c)).length > 0 ? true : false
                if(!el.classList.contains('nav--open')){
                    nav_overlay.style.display = 'block'
                    setTimeout(() => {
                        nav_overlay.style.opacity = 1
                    }, 10);
                    if(typeof window !== 'undefined'){
                        if(isFade){
                            nav_menu.style.opacity = 1
                        }else if(isSlideLeft | isSlideRight){
                            nav_menu.style.transform = 'translateX(0px)'
                        }else if(isSlideTop){
                            nav_menu.style.maxHeight = window.innerHeight + 'px'
                        }else if(isSlide){
                            nav_menu.style.transition = 'all 2s ease-in-out'
                            nav_menu.style.maxHeight = window.innerHeight + 'px'
                        }
                    }
                    e.target.classList.add('active')
                    el.classList.add('nav--open')
                    let timeout = 0
                    setTimeout(() => {
                        nav_menu.style.transition = 'all 1s ease-in-out'
                        nav_menu_items.forEach(i => {
                            setTimeout(() => {
                                i.style.opacity = 1
                            }, timeout += 200);
                        })
                    }, 300);
                }else{
                    e.target.classList.remove('active')
                    el.classList.remove('nav--open')
                    let timeout = 0
                    nav_menu_items.reverse().forEach(i => {
                        setTimeout(() => {
                            i.style.opacity = 0
                        }, timeout += 100);
                    })
                    setTimeout(() => {
                        nav_overlay.style.opacity = 0
                        setTimeout(() => {
                            nav_overlay.style.display = 'none'
                        }, 1000);
                        if(isFade){
                            nav_menu.style.opacity = 0
                        }else if(isSlideLeft){
                            nav_menu.style.transform = 'translateX(-100%)'
                        }
                        else if(isSlideRight){
                            nav_menu.style.transform = 'translateX(100%)'
                        }else if(isSlideTop){
                            nav_menu.style.maxHeight = '0%'
                        }else if(isSlide){
                            nav_menu.style.maxHeight = '0px'
                        }
                    }, timeout)
                        
                }
            }
        })
    }
    handleSetup(){
        this.handleMenuSetup()
        this.hamburgers.forEach(h => h.addEventListener('click',(e)=>this.handleMenu(e)))
    }
}
class Loader{
    constructor(){
        this.elements = document.querySelectorAll('.loader')
    }
    handleMakeLoader(){
        this.elements.forEach(el =>{
            const isLine = [...el.classList].filter(c => /loader__line/.test(c)).length > 0 ? true : false
            const isCircle = [...el.classList].filter(c => /loader__circle/.test(c)).length > 0 ? true : false
            if(isLine){
                const loader_canvas = document.createElement('canvas')
                const loader_ctx = loader_canvas.getContext('2d')
                loader_canvas.width = el.clientWidth
                loader_canvas.height = el.clientHeight
                
                let rotate = 0 
                const loader_animation = () =>{
                    loader_ctx.clearRect(0,0,loader_canvas.width,loader_canvas.height)
                    loader_ctx.lineWidth = 5
                    const colorRegex = /([a-zA-Z]+)?$/gi
                    const colorClass = [...el.classList].find(c => /loader__line-/gi.test(c))
                    const loader_line_background_color_filtered = colorClass.match(colorRegex)
                    if(loader_line_background_color_filtered[0]){
                        const loader_line_background_color = loader_line_background_color_filtered[0]
                        loader_ctx.strokeStyle = loader_line_background_color
                        loader_ctx.shadowColor = loader_line_background_color
                        loader_ctx.shadowBlur = 10
                    }
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 3,Math.PI * 0,Math.PI * 2)
                    loader_ctx.closePath()
                    loader_ctx.stroke()
                    loader_ctx.strokeStyle = getComputedStyle(el).color
                    loader_ctx.shadowColor = getComputedStyle(el).color
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 3,Math.PI * rotate+5.5,Math.PI * rotate)
                    loader_ctx.stroke()
                    rotate += 0.05
                    requestAnimationFrame(loader_animation)
                }
                loader_animation()
                el.appendChild(loader_canvas)
            }
            if(isCircle){
                const loader_canvas = document.createElement('canvas')
                const loader_ctx = loader_canvas.getContext('2d')
                loader_canvas.width = el.clientWidth
                loader_canvas.height = el.clientHeight
                let radius = 0
                let rotate = 0 
                let direction = false
                const loader_animation = () =>{
                    loader_ctx.clearRect(0,0,loader_canvas.width,loader_canvas.height)
                    loader_ctx.lineWidth = 5
                    const colorRegex = /([a-zA-Z]+)?$/gi
                    const colorClass = [...el.classList].find(c => /loader__circle-color-/gi.test(c))
                    const isDark = [...el.classList].filter(c => /loader__circle-dark/gi.test(c)).length > 0 ? true : false
                    const loader_line_background_color_filtered = colorClass.match(colorRegex)
                    const loader_line_background_color = loader_line_background_color_filtered[0]
                    loader_ctx.fillStyle = loader_line_background_color
                    loader_ctx.shadowColor = loader_line_background_color
                    loader_ctx.shadowBlur = 10
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 5 + radius,Math.PI * 0,Math.PI * 2)
                    loader_ctx.closePath()
                    loader_ctx.fill()
                    if(isDark){
                        loader_ctx.fillStyle = 'black'
                    }else{
                        loader_ctx.fillStyle = 'white'
                    }
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 5 + radius -5,Math.PI * 0,Math.PI * 2)
                    loader_ctx.closePath()
                    loader_ctx.fill()
                    loader_ctx.fillStyle = 'white'
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 5 + radius -15,Math.PI * 0,Math.PI * 2)
                    loader_ctx.closePath()
                    loader_ctx.fill()
                    loader_ctx.fillStyle = loader_line_background_color
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 5 + radius - 20,Math.PI * 0,Math.PI * 2)
                    loader_ctx.closePath()
                    loader_ctx.fill()
                    loader_ctx.strokeStyle = getComputedStyle(el).color
                    loader_ctx.shadowColor = getComputedStyle(el).color
                    loader_ctx.beginPath()
                    loader_ctx.arc(loader_canvas.width / 2,loader_canvas.height / 2,loader_canvas.width / 5 + radius,Math.PI * rotate+5.5,Math.PI * rotate)
                    loader_ctx.stroke()
                    rotate += 0.05
                    if(radius >= 25){
                        direction = true
                    }else if(radius < 1){
                        direction = false
                    }
                    if(!direction){
                        radius += 2
                    }else{
                        radius -= 0.5
                    }
                    requestAnimationFrame(loader_animation)
                }
                loader_animation()
                el.appendChild(loader_canvas)
            }
        })
    }
    handleSetup(){
        this.handleMakeLoader()
    }
}
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
class Toast{
    constructor(){
        this.elements = document.querySelectorAll('.toast')
    }
    handleSetup(){
        this.elements.forEach(el => {
            const toast_close = el.querySelector('.toast__close')
            toast_close.addEventListener('click', (e)=>{
                const toast = e.target.parentElement.parentElement
                toast.style.opacity = 0
                toast.style.transform = 'translateY(-20px)'
                setTimeout(() => {
                    toast.style.display = 'none'
                }, 1000);
            })
        })
    }
}
class Candy_Utils {
    handleSetAttributes(el,target){

            
        
            const column = el.getAttribute('column')
            if(column){
                target.classList.add(`column-${column}`)
            }
            const column_lg = el.getAttribute('column-lg')
            if(column_lg){
                target.classList.add(`column-${column_lg}-lg`)
            }
            const column_md = el.getAttribute('column-md')
            if(column_md){
                target.classList.add(`column-${column_md}-md`)
            }
            const column_sm_md = el.getAttribute('column-sm-md')
            if(column_sm_md){
                target.classList.add(`column-${column_sm_md}-sm-md`)
            }
            const column_sm = el.getAttribute('column-sm')
            if(column_sm){
                target.classList.add(`column-${column_sm}-sm`)
            }

            const position = el.getAttribute('position')
            if(position === 'relative'){
                target.classList.add('relative')
            }
            if(position === 'fixed'){
                target.classList.add('fixed')
            }
            if(position === 'absolute'){
                target.classList.add('absolute')
            }
        
            const margin = el.getAttribute('mr')
            if(margin){
                if(margin === 'auto'){
                    target.classList.add('mr-auto')
                }else{
                    target.classList.add(`mr-${margin}`)
                }
            }
            const margin_x = el.getAttribute('mr-x')
            if(margin_x){
                if(margin_x === 'auto'){
                    target.classList.add('mr-x-auto')
                }else{
                    target.classList.add(`mr-x-${margin_x}`)
                }
            }
            const margin_y = el.getAttribute('mr-y')
            if(margin_y){
                if(margin_y === 'auto'){
                    target.classList.add('mr-y-auto')
                }else{
                    target.classList.add(`mr-y-${margin_y}`)
                }
            }
            const margin_l = el.getAttribute('mr-l')
            if(margin_l){
                if(margin_l === 'auto'){
                    target.classList.add('mr-l-auto')
                }else{
                    target.classList.add(`mr-l-${margin_l}`)
                }
            }
            const margin_t = el.getAttribute('mr-t')
            if(margin_t){
                if(margin_t === 'auto'){
                    target.classList.add('mr-t-auto')
                }else{
                    target.classList.add(`mr-t-${margin_t}`)
                }
            }
            const margin_r = el.getAttribute('mr-r')
            if(margin_r){
                if(margin_r === 'auto'){
                    target.classList.add('mr-r-auto')
                }else{
                    target.classList.add(`mr-r-${margin_r}`)
                }
            }
            const margin_b = el.getAttribute('mr-b')
            if(margin_b){
                if(margin_b === 'auto'){
                    target.classList.add('mr-b-auto')
                }else{
                    target.classList.add(`mr-b-${margin_b}`)
                }
            }
            const padding = el.getAttribute('pd')
            if(padding){
                if(padding === 'auto'){
                    target.classList.add('pd-auto')
                }else{
                    target.classList.add(`pd-${padding}`)
                }
            }
            const padding_x = el.getAttribute('pd-x')
            if(padding_x){
                if(padding_x === 'auto'){
                    target.classList.add('pd-x-auto')
                }else{
                    target.classList.add(`pd-x-${padding_x}`)
                }
            }
            const padding_y = el.getAttribute('pd-y')
            if(padding_y){
                if(padding_y === 'auto'){
                    target.classList.add('pd-y-auto')
                }else{
                    target.classList.add(`pd-y-${padding_y}`)
                }
            }
            const padding_l = el.getAttribute('pd-l')
            if(padding_l){
                if(padding_l === 'auto'){
                    target.classList.add('pd-l-auto')
                }else{
                    target.classList.add(`pd-l-${padding_l}`)
                }
            }
            const padding_r = el.getAttribute('pd-r')
            if(padding_r){
                if(padding_r === 'auto'){
                    target.classList.add('pd-r-auto')
                }else{
                    target.classList.add(`pd-r-${padding_r}`)
                }
            }
            const padding_b = el.getAttribute('pd-b')
            if(padding_b){
                if(padding_b === 'auto'){
                    target.classList.add('pd-b-auto')
                }else{
                    target.classList.add(`pd-b-${padding_b}`)
                }
            }
            const padding_t = el.getAttribute('pd-t')
            if(padding_t){
                if(padding_b === 'auto'){
                    target.classList.add('pd-t-auto')
                }else{
                    target.classList.add(`pd-t-${padding_t}`)
                }
            }
            const isPercentRegex = /%/gi
            const numberRegex = /[0-9]+/gi
            const width = el.getAttribute('width')
            if(width){
                if(width.test(isPercentRegex)){
                    target.classList.add(`w-${width.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`w-${width}`)
                }
            }
            const height = el.getAttribute('height')
            if(height){

                if(height.test(isPercentRegex)){
                    target.classList.add(`h-${height.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`h-${height}`)
                }
            }
            const min_w = el.getAttribute('min-width')
            if(min_w){
                if(min_w.test(isPercentRegex)){
                    target.classList.add(`min-w-${min_w.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`min-w-${min_w}`)
                }
            }
            const min_h = el.getAttribute('min-height')
            if(min_h){

                if(min_h.test(isPercentRegex)){
                    target.classList.add(`min-h-${min_h.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`min-h-${min_h}`)
                }
            }
            const max_w = el.getAttribute('max-width')
            if(max_w){
                if(max_w.test(isPercentRegex)){
                    target.classList.add(`max-w-${max_w.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`max-w-${max_w}`)
                }
            }
            const max_h = el.getAttribute('max-height')
            if(max_h){
                if(max_h.test(isPercentRegex)){
                    target.classList.add(`max-h-${max_h.match(numberRegex)[0]}`)
                }else{
                    target.classList.add(`max-h-${max_h}`)
                }
            }
            const font = el.getAttribute('font')
            if(font === 'italic'){
                target.classList.add('font-italic')
            }
            if(font === 'normal'){
                target.classList.add('font-normal')
            }
            if(font === 'bold'){
                target.classList.add('font-bold')
            }
            const background = el.getAttribute('background')
            if(background){
                target.classList.add(`bg-${background}`)
            }
            const gradient = el.getAttribute('gradient')
            if(gradient){
                target.classList.add(`gradient-${gradient}`)
            }
            const border_color = el.getAttribute('border-color')
            if(border_color){
                target.classList.add(`border-${border_color}`)
            }
            const border = el.getAttribute('border-width')
            if(border && border_color){
                target.classList.add(`border-${border}`)
            }else if(border){
                alert('You need specify border-color')
            }
            const border_top = el.getAttribute('border-top')
            if(border_top && border_color){
                target.classList.add(`border-top-${border_top}-${border_color}`)
            }else if(border_top){
                alert('You need specify border-color')
            }
            const border_left = el.getAttribute('border-left')
            if(border_left && border_color){
                target.classList.add(`border-top-${border_left}-${border_color}`)
            }else if(border_left){
                alert('You need specify border-color')
            }
            const border_right = el.getAttribute('border-right')
            if(border_right && border_color){
                target.classList.add(`border-top-${border_right}-${border_color}`)
            }else if(border_right){
                alert('You need specify border-color')
            }
            const border_bottom = el.getAttribute('border-bottom')
            if(border_bottom && border_color){
                target.classList.add(`border-top-${border_bottom}-${border_color}`)
            }else if(border_bottom){
                alert('You need specify border-color')
            }
            const border_gradient_to_left = el.getAttribute('border-gradient-to-left')
            if(border_gradient_to_left && border_color){
                target.classList.add(`border-${border_gradient_to_left}-gradient-to-left-${border_color}`)
            }else if(border_gradient_to_left){
                alert('You need specify border-color')
            }
            const border_gradient_45deg = el.getAttribute('border-gradient-45deg')
            if(border_gradient_45deg && border_color){
                target.classList.add(`border-${border_gradient_45deg}-gradient-45deg-${border_color}`)
            }else if(border_gradient_45deg){
                alert('You need specify border-color')
            }
            const border_gradient_135deg = el.getAttribute('border-gradient-135deg')
            if(border_gradient_135deg && border_color){
                target.classList.add(`border-${border_gradient_135deg}-gradient-135deg-${border_color}`)
            }else if(border_gradient_135deg){
                alert('You need specify border-color')
            }
            const border_gradient_225deg = el.getAttribute('border-gradient-225deg')
            if(border_gradient_225deg && border_color){
                target.classList.add(`border-${border_gradient_225deg}-gradient-225deg-${border_gradient_225deg}`)
            }else if(border_gradient_225deg){
                alert('You need specify border-color')
            }
            const border_gradient_to_top = el.getAttribute('border-gradient-to-top')
            if(border_gradient_to_top && border_color){
                target.classList.add(`border-${border_gradient_to_left}-gradient-to-top-${border_color}`)
            }else if(border_gradient_to_top){
                alert('You need specify border-color')
            }
            const border_gradient_to_bottom = el.getAttribute('border-gradient-to-bottom')
            if(border_gradient_to_bottom && border_color){
                target.classList.add(`border-${border_gradient_to_bottom}-gradient-to-bottom-${border_color}`)
            }else if(border_gradient_to_bottom){
                alert('You need specify border-color')
            }
            const border_gradient_to_right = el.getAttribute('border-gradient-to-right')
            if(border_gradient_to_right && border_color){
                target.classList.add(`border-${border_gradient_to_right}-gradient-to-right-${border_color}`)
            }else if(border_gradient_to_right){
                alert('You need specify border-color')
            }
            const border_left_gradient_to_top = el.getAttribute('border-left-gradient-to-top')
            if(border_left_gradient_to_top && border_color){
                target.classList.add(`border-left-${border_left_gradient_to_top}-gradient-to-top-${border_color}`)
            }else if(border_left_gradient_to_top){
                alert('You need specify border-color')
            }
            const border_top_gradient_to_right = el.getAttribute('border-top-gradient-to-right')
            if(border_top_gradient_to_right && border_color){
                target.classList.add(`border-top-${border_top_gradient_to_right}-gradient-to-right-${border_color}`)
            }else if(border_top_gradient_to_right){
                alert('You need specify border-color')
            }
            const border_bottom_gradient_to_right = el.getAttribute('border-bottom-gradient-to-right')
            if(border_bottom_gradient_to_right && border_color){
                target.classList.add(`border-bottom-${border_bottom_gradient_to_right}-gradient-to-right-${border_color}`)
            }else if(border_bottom_gradient_to_right){
                alert('You need specify border-color')
            }
            const border_top_gradient_to_left = el.getAttribute('border-top-gradient-to-left')
            if(border_top_gradient_to_left && border_color){
                target.classList.add(`border-top-${border_top_gradient_to_left}-gradient-to-left-${border_color}`)
            }else if(border_top_gradient_to_left){
                alert('You need specify border-color')
            }
            const border_bottom_gradient_to_left = el.getAttribute('border-bottom-gradient-to-left')
            if(border_bottom_gradient_to_left && border_color){
                target.classList.add(`border-bottom-${border_bottom_gradient_to_left}-gradient-to-left-${border_color}`)
            }else if(border_bottom_gradient_to_left){
                alert('You need specify border-color')
            }
            const border_left_gradient_to_bottom = el.getAttribute('border-left-gradient-to-bottom')
            if(border_left_gradient_to_bottom && border_color){
                target.classList.add(`border-left-${border_left_gradient_to_bottom}-gradient-to-bottom-${border_color}`)
            }else if(border_left_gradient_to_bottom){
                alert('You need specify border-color')
            }
            const border_right_gradient_to_top = el.getAttribute('border-right-gradient-to-top')
            if(border_left_gradient_to_top && border_color){
                target.classList.add(`border-right-${border_right_gradient_to_top}-gradient-to-top-${border_color}`)
            }else if(border_right_gradient_to_top){
                alert('You need specify border-color')
            }
            const border_right_gradient_to_bottom = el.getAttribute('border-right-gradient-to-bottom')
            if(border_left_gradient_to_bottom && border_color){
                target.classList.add(`border-right-${border_right_gradient_to_bottom}-gradient-to-bottom-${border_color}`)
            }else if(border_left_gradient_to_bottom){
                alert('You need specify border-color')
            }
            const hover_bg = el.getAttribute('hover-background')
            if(hover_bg){
                target.classList.add(`hover-bg-${hover_bg}`)
            }
            const hover_c = el.getAttribute('hover-color')
            if(hover_c){
                target.classList.add(`hover-color-${hover_c}`)
            }
            const outline = el.getAttribute('outline')
            if(outline){
                target.classList.add(`outline-${outline}`)
            }
            const border_width = el.getAttribute('border-width')
            if(border_width){
                target.classList.add(`border-${border_width}`)
            }
            const border_style = el.getAttribute('border-style')
            if(border_style){
                target.classList.add(`border-${border_style}`)
            }
            const color = el.getAttribute('color')
            if(color){
                target.classList.add(`color-${color}`)
            }
            const text_align = el.getAttribute('text-align')
            if(text_align){
                target.classList.add(`text-${text_align}`)
            }
            const display = el.getAttribute('display')
            if(display){
                target.classList.add(display)
            }
            const rounded = el.getAttribute('rounded')
            if(rounded){
                target.classList.add(`rounded-${rounded}`)
            }
            const rounded_top = el.getAttribute('rounded-top')
            if(rounded_top){
                target.classList.add(`rounded-top-${rounded_top}`)
            }
            const rounded_left = el.getAttribute('rounded-left')
            if(rounded_left){
                target.classList.add(`rounded-left-${rounded_left}`)
            }
            const rounded_right = el.getAttribute('rounded-right')
            if(rounded_right){
                target.classList.add(`rounded-right-${rounded_right}`)
            }
            const rounded_bottom = el.getAttribute('rounded-bottom')
            if(rounded_bottom){
                target.classList.add(`rounded-bottom-${rounded_bottom}`)
            }
            const heading = el.getAttribute('heading')
            if(heading){
                target.classList.add(`heading-${heading}`)
            }
            const row_height = el.getAttribute('row-height')
            if(row_height){
                target.classList.add(`row-${row_height}`)
            }
            const x_plus = el.getAttribute('x-plus')
            if(x_plus){
                target.classList.add(`pos-x-plus-${x_plus}`)
            }
            
            const x_minus = el.getAttribute('x-minus')
            if(x_minus){
                target.classList.add(`pos-x-minus-${x_plus}`)
            }
            const y_plus = el.getAttribute('y-plus')
            if(y_plus){
                target.classList.add(`pos-y-plus-${y_plus}`)
            }
            
            const y_minus = el.getAttribute('y-minus')
            if(y_minus){
                target.classList.add(`pos-y-minus-${y_minus}`)
            }
            const row = el.getAttribute('row')
            if(row){
                target.classList.add('row')
                target.classList.add(`row-${row}`)
            }
            const top_plus = el.getAttribute('top-plus')
            if(top_plus){
                target.classList.add(`top-plus-${top_plus}`)
            }
            const top_minus = el.getAttribute('top-minus')
            if(top_minus){
                target.classList.add(`top-minus-${top_minus}`)
            }
            const left_plus = el.getAttribute('left-plus')
            if(left_plus){
                target.classList.add(`left-plus-${left_plus}`)
            }
            const left_minus = el.getAttribute('left-minus')
            if(left_minus){
                target.classList.add(`left-minus-${left_minus}`)
            }
            
            const right_plus = el.getAttribute('right-plus')
            if(left_plus){
                target.classList.add(`right-plus-${right_plus}`)
            }
            const right_minus = el.getAttribute('right-minus')
            if(right_minus){
                target.classList.add(`right-minus-${right_minus}`)
            }
            const bottom_plus = el.getAttribute('bottom-plus')
            if(bottom_plus){
                target.classList.add(`bottom-plus-${bottom_plus}`)
            }
            const bottom_minus = el.getAttribute('bottom-minus')
            if(bottom_minus){
                target.classList.add(`bottom-minus-${bottom_minus}`)
            }
            const translate_y_minus = el.getAttribute('translate-y-minus')
            if(translate_y_minus){
                target.classList.add(`translate-y-minus-${translate_y_minus}`)
            }
            const translate_y_plus = el.getAttribute('translate-y-plus')
            if(translate_y_plus){
                target.classList.add(`translate-y-plus-${translate_y_plus}`)
            }
            const translate_x_minus = el.getAttribute('translate-x-minus')
            if(translate_x_minus){
                target.classList.add(`translate-x-minus-${translate_x_minus}`)
            }
            const translate_x_plus = el.getAttribute('translate-y-plus')
            if(translate_x_plus){
                target.classList.add(`translate-x-plus-${translate_x_plus}`)
            }
            const translate = el.getAttribute('translate')
            if(translate){
                target.classList.add(`translate-${translate}`)
            }
            const flex_basis = el.getAttribute('flex-basis')
            if(flex_basis){
                target.classList.add(`flex__basis-${flex_basis}`)
            }
            const colorfull = el.getAttribute('colorfull')
            if(colorfull){
                if(colorfull === 'true'){
                    target.classList.add('colorfull')
                }
                if(colorfull === 'with-sibling'){
                    target.classList.add(`colorfull__${colorfull}`)
                }
            }
            const shadow = el.getAttribute('shadow')
            if(shadow){
                target.classList.add(`shadow__${shadow}`)
            }
            const pulse_size = el.getAttribute('pulse-size')
            if(pulse_size === 'small'){
                target.classList.add('pulse-inside')
            }
            if(pulse_size === 'big'){
                target.classList.add('pulse-inside-big')
            }
            const gradient_bg = el.getAttribute('gradient-bg')
            const gradient_type = el.getAttribute('gradient-type-bg')
            if(gradient_bg && gradient_type){
                target.classList.add(`gradient-${gradient_type}-${gradient_bg}`)
            }else if(gradient_bg){
                alert('You need to specify card gradient type')
            }
        
    }
    handlePassAttributes(el,target){
        const attrs = el.getAttributeNames(el)
        attrs.forEach(a =>{
            const attr = el.getAttribute(a)
            target.setAttribute(a,attr)
        })
    }
    handlePassClass(el,target){
        const attr = el.getAttribute('class')
        const target_class = target.getAttribute('class')
        if(attr !== null){{
            target.setAttribute('class',attr + ' ' + target_class)
        }}
    }
    handlePassId(el,target){
        const attr = el.getAttribute('inner-id')
        if(attr !== null){{
            target.setAttribute('id',attr)
        }}
    }
    handleGetColor(el){
        el.getAttribute('color')
    }
    handleGetBackgroundColor(el){
        return el.getAttribute('background')
    }
    handleGetTransitionControl(el){
        return el.getAttribute('transition_control')
    }
    handleGetTransitionIn(el){
        const transition = el.getAttribute('transition_in')
        if(transition){
            return transition
        }else{
            return 'fadeIn'
        }
    }
    handleGetTransitionOut(el){
        const transition = el.getAttribute('transition_out')
        if(transition){
            return transition
        }else{
            return 'fadeOut'
        }
    }
}
class Accordion_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.accordion = undefined
    }
    static component_name = 'ui-accordion'
    connectedCallback() {
       this.handleMakeAccordion()
       setTimeout(() => {
        this.accordion = new Accordion()
        this.accordion.handleSetup()
     }, 100);
    }
    disconnectedCallback() {

    }
    attributeChangedCallback(name, oldValue, newValue) {
     
    }
    adoptedCallback() {
    }
    handleMakeAccordion(){
        const accordion = document.createElement('div')
        const accordion_transtion_in = this.candy_utils.handleGetTransitionIn(this)
        const accordion_transtion_out = this.candy_utils.handleGetTransitionOut(this)
        accordion.classList.add('accordion')
        this.candy_utils.handlePassClass(this,accordion)
        this.candy_utils.handlePassId(this,accordion)
        this.candy_utils.handleSetAttributes(this,accordion)

        const accordion_heading = this.querySelector('ui-accordion-heading')
        const accordion_heading_div = document.createElement('div')
        if(accordion_heading){
            accordion_heading_div.classList.add('accordion__heading')
            accordion_heading_div.setAttribute('data-transition_in',accordion_transtion_in)
            accordion_heading_div.setAttribute('data-transition_out',accordion_transtion_out)
            accordion_heading_div.innerHTML = accordion_heading.innerHTML
            this.candy_utils.handlePassClass(accordion_heading,accordion_heading_div)
            this.candy_utils.handlePassId(accordion_heading,accordion_heading_div)
            this.candy_utils.handleSetAttributes(accordion_heading,accordion_heading_div)
            accordion_heading.outerHTML = accordion_heading_div.outerHTML 
        }

        const accordion_body = this.querySelector('ui-accordion-body')
        const accordion_body_div = document.createElement('div')
        const accordion_body_wrapper_div = document.createElement('div')
        if(accordion_body){
            const accordion_transtion_control = this.candy_utils.handleGetTransitionControl(this)
            const accordion_body_isVisible = accordion_body.getAttribute('isVisible')
            accordion_body_wrapper_div.classList.add('accordion__body')
            accordion_body_wrapper_div.classList.add(accordion_body_isVisible)
            accordion_body_wrapper_div.classList.add(accordion_transtion_control)
            if(accordion_body_isVisible){
                accordion_heading_div.classList.add('accordion__open')
            }
            accordion_body_div.innerHTML = accordion_body.innerHTML
            this.candy_utils.handlePassId(accordion_body,accordion_body_div)
            this.candy_utils.handlePassClass(accordion_body,accordion_body_div)
            this.candy_utils.handleSetAttributes(accordion_body,accordion_body_div)
            accordion_body.outerHTML = accordion_body_wrapper_div.outerHTML
        }
            
        const accordion_footer = this.querySelector('ui-accordion-footer')
        const accordion_footer_div = document.createElement('div')
        if(accordion_footer){
            accordion_footer_div.classList.add('accordion__footer')
            accordion_footer_div.innerHTML = accordion_footer.innerHTML
            this.candy_utils.handlePassId(accordion_footer,accordion_footer_div)
            this.candy_utils.handlePassClass(accordion_footer,accordion_footer_div)
            this.candy_utils.handleSetAttributes(accordion_footer,accordion_footer_div)
            accordion_footer.outerHTML = accordion_footer_div.outerHTML
        }
            
        this.innerHTML = ''
        if(accordion_heading){
            accordion.appendChild(accordion_heading)
        }
        if(accordion_body){
            accordion.appendChild(accordion_body)
        }
        if(accordion_footer){
            accordion.appendChild(accordion_footer)
        }
        this.appendChild(accordion)

    }
}
window.customElements.define(Accordion_Component.component_name,Accordion_Component)
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
class Dropdown_Item_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-item'
    connectedCallback() {
        this.handleMakeDropdownItem()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdownItem(){
         const dropdown_item = document.createElement('div')
         dropdown_item.classList.add('dropdown__item')
         this.candy_utils.handlePassClass(this,dropdown_item)
         this.candy_utils.handlePassId(this,dropdown_item)
         this.candy_utils.handleSetAttributes(this,dropdown_item)
         dropdown_item.innerHTML = this.innerHTML
         this.outerHTML = dropdown_item.outerHTML
     }
}
class Dropdown_Menu_Item_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-menu-item'
    connectedCallback() {
        this.handleMakeDropdownItem()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdownItem(){
         const dropdown_menu_item = document.createElement('div')
         const event = this.getAttribute('event')
         if(event){
            dropdown_menu_item.classList.add(`event--${event}`)
         }
         dropdown_menu_item.classList.add('dropdown__menu-item')
         this.candy_utils.handlePassClass(this,dropdown_menu_item)
         this.candy_utils.handlePassId(this,dropdown_menu_item)
         this.candy_utils.handleSetAttributes(this,dropdown_menu_item)
         dropdown_menu_item.innerHTML = this.innerHTML
         this.outerHTML = dropdown_menu_item.outerHTML
     }
}
class Dropdown_Menu_Wrapper_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-menu-wrapper'
    connectedCallback() {
        this.handleMakeWrapper()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeWrapper(){
        const menu_wrapper = document.createElement('div')
        menu_wrapper.classList.add('dropdown__menu-wrapper')
        this.candy_utils.handlePassId(this,menu_wrapper)
        this.candy_utils.handlePassClass(this,menu_wrapper)
        this.candy_utils.handleSetAttributes(this,menu_wrapper)
        menu_wrapper.innerHTML = this.innerHTML
        this.outerHTML = menu_wrapper.outerHTML
     }
}
class Dropdown_Sub_Menu_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-submenu'
    connectedCallback() {
        this.handleMakeDropdownSubmenu()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdownSubmenu(){
         const dropdown_sub_menu = document.createElement('div')
         const position = this.getAttribute('position')
         if(position){
            dropdown_sub_menu.classList.add(`${position}`)
         }
         dropdown_sub_menu.classList.add('dropdown__submenu')
         this.candy_utils.handlePassClass(this,dropdown_sub_menu)
         this.candy_utils.handlePassId(this,dropdown_sub_menu)
         this.candy_utils.handleSetAttributes(this,dropdown_sub_menu)
         dropdown_sub_menu.innerHTML = this.innerHTML
         this.outerHTML = dropdown_sub_menu.outerHTML
     }
}
class Dropdown_Menu_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-menu'
    connectedCallback() {
        this.handleMakeDropdownMenu()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdownMenu(){
         const dropdown_menu = document.createElement('div')
         const transition_control = this.getAttribute('transition-control')
         const transition_in = this.getAttribute('transition-in')
         const transition_out = this.getAttribute('transition-out')
         if(transition_control){
            dropdown_menu.classList.add(`${transition_control}`)
         }
         if(transition_in){
             dropdown_menu.setAttribute('data-transition_in',transition_in)
         }
         if(transition_out){
            dropdown_menu.setAttribute('data-transition_out',transition_out)
         }
         dropdown_menu.classList.add('dropdown__menu')
         this.candy_utils.handlePassClass(this,dropdown_menu)
         this.candy_utils.handlePassId(this,dropdown_menu)
         this.candy_utils.handleSetAttributes(this,dropdown_menu)
         dropdown_menu.innerHTML = this.innerHTML
         
         this.outerHTML = dropdown_menu.outerHTML
     }
}
class Dropdown_Menu_Inner_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-dropdown-menu-inner'
    connectedCallback() {
        this.handleMakeDropdownMenuInner()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdownMenuInner(){
         const dropdown_menu_inner = document.createElement('div')
         dropdown_menu_inner.classList.add('dropdown__menu-inner')
         this.candy_utils.handlePassClass(this,dropdown_menu_inner)
         this.candy_utils.handlePassId(this,dropdown_menu_inner)
         this.candy_utils.handleSetAttributes(this,dropdown_menu_inner)
         dropdown_menu_inner.innerHTML = this.innerHTML
         this.outerHTML = dropdown_menu_inner.outerHTML
     }
}
class Dropdown_Component extends HTMLElement{
    constructor(){
        super()
        this.dropdown = new Dropdown()
        this.candy_utils = new Candy_Utils()
        this.ui_item = window.customElements.define(Dropdown_Item_Sub_Component.component_name,Dropdown_Item_Sub_Component)
        this.ui_menu_item = window.customElements.define(Dropdown_Menu_Item_Sub_Component.component_name,Dropdown_Menu_Item_Sub_Component)
        this.ui_menu_wrapper = window.customElements.define(Dropdown_Menu_Wrapper_Sub_Component.component_name,Dropdown_Menu_Wrapper_Sub_Component)
        this.ui_sub_menu = window.customElements.define(Dropdown_Sub_Menu_Sub_Component.component_name,Dropdown_Sub_Menu_Sub_Component)
        this.ui_menu = window.customElements.define(Dropdown_Menu_Sub_Component.component_name,Dropdown_Menu_Sub_Component)
        this.ui_menu_inner = window.customElements.define(Dropdown_Menu_Inner_Sub_Component.component_name,Dropdown_Menu_Inner_Sub_Component)
    }
    static component_name = 'ui-dropdown'
    connectedCallback() {
        this.handleMakeDropdown()
        setTimeout(() => {
         this.dropdown = new Dropdown()
         this.dropdown.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDropdown(){
         const dropdown = document.createElement('div')
         dropdown.classList.add('dropdown')
         this.candy_utils.handlePassClass(this,dropdown)
         this.candy_utils.handlePassId(this,dropdown)
         this.candy_utils.handleSetAttributes(this,dropdown)
         const hover = this.getAttribute('hover')
         if(hover){
            dropdown.classList.add(`hover-${hover}`)
         }
         dropdown.innerHTML = this.innerHTML
         this.innerHTML = ''
         this.appendChild(dropdown)
     }
}
window.customElements.define(Dropdown_Component.component_name,Dropdown_Component)
class Card_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-card'
    connectedCallback() {
        this.handleMakeCard()
        setTimeout(() => {
         this.handleCardWithShadow()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
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
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadow){
            ThreeD65degRightCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadow){
            ThreeD100degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadow){
            ThreeD65degLeftCardsWithShadow.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,false,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degRightCardsWithShadowPaint){
            ThreeD100degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degRightCardsWithShadowPaint){
            ThreeD65degRightCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,false,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD100degLeftCardsWithShadowPaint){
            ThreeD100degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,65,15,65,15,100,100)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
        if(ThreeD65degLeftCardsWithShadowPaint){
            ThreeD65degLeftCardsWithShadowPaint.forEach(card => {
                const instance = new Card('.card__hover--3d-100deg-right-with-shadow',card,true,true,false,25,10,25,10,65,65)
                instance.handleSetup('mouseover','mouseleave')
            })
        }
    
    }
     handleMakeCard(){
        const card = document.createElement('div')
        card.classList.add('card')
        const hover = this.getAttribute('hover')
        if(hover){
            card.classList.add(`card__hover--${hover}`)
        }
        const hover3D = this.getAttribute('hover-3d')
        const hover3D_Direction = this.getAttribute('direction')
        if(hover3D && hover3D_Direction){
            card.classList.add(`card__hover--3d-${hover3D}-${hover3D_Direction}-with-shadow`)
        }else if(hover3D){
            alert('You need to specity hover direction')
        }
        const hover3D_with_paint = this.getAttribute('hover-3d-paint')
        if(hover3D_with_paint){
            card.classList.add(`card__hover--3d-${hover3D_with_paint}-${hover3D_Direction}-with-shadow-paint`)
        }else if(hover3D_with_paint){
            alert('You need to specity hover direction')
        }
        const isBordered = this.getAttribute('isBordered')
        if(isBordered){
            card.classList.add('card__bordered-inside')
        }
        this.candy_utils.handlePassId(this,card)
        this.candy_utils.handlePassClass(this,card)
        this.candy_utils.handleSetAttributes(this,card)
        card.innerHTML = ''
        
        const header = this.querySelector('ui-card-header')
        const header_div = document.createElement('div')
        if(header){
            header_div.classList.add('card__header')
            this.candy_utils.handlePassId(header,header_div)
            this.candy_utils.handlePassClass(header,header_div)
            this.candy_utils.handleSetAttributes(header,header_div)
            header_div.innerHTML = header.innerHTML
            header.remove()
           
        }
          
        const body = this.querySelector('ui-card-body')
        const body_div = document.createElement('div')
        const button = this.querySelector('ui-card-button')
        const button_div = document.createElement('button')
        
        if(body){
            body_div.classList.add('card__body')
            this.candy_utils.handlePassId(body,body_div)
            this.candy_utils.handlePassClass(body,body_div)
            this.candy_utils.handleSetAttributes(body,body_div)
            body_div.innerHTML = body.innerHTML
            body.remove()
        }
        if(button){
            button_div.classList.add('card__button')
            this.candy_utils.handlePassId(button,button_div)
            this.candy_utils.handlePassClass(button,button_div)
            this.candy_utils.handleSetAttributes(button,button_div)
            button_div.innerHTML = button.innerHTML
            button.remove()
        }
          
        const footer = this.querySelector('ui-card-footer')
        const footer_div = document.createElement('div')
        if(footer){
            footer_div.classList.add('card__footer')
            this.candy_utils.handlePassId(footer,footer_div)
            this.candy_utils.handlePassClass(footer,footer_div)
            this.candy_utils.handleSetAttributes(footer,footer_div)
            footer_div.innerHTML = footer.innerHTML
            footer.remove()
        }
        
        if(header){
            card.appendChild(header_div)
        }
        if(button){
            body_div.appendChild(button_div)
        }
        if(body){
            card.appendChild(body_div)
        }
        if(footer){
            card.appendChild(footer_div)
        }
        
        this.innerHTML = ''
        this.innerHTML = card.outerHTML
     }
}
window.customElements.define(Card_Component.component_name,Card_Component)
class Carousel_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.carousel = new Carousel()
    }
    static component_name = 'ui-carousel'
    connectedCallback() {
        this.handleMakeCarousel()
        setTimeout(() => {
         this.carousel = new Carousel()
         this.carousel.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeCarousel(){
        const carousel = document.createElement('div')
        carousel.classList.add('carousel')

        const transition_control = this.getAttribute('transition-control')
        if(transition_control){
            carousel.classList.add(`carousel__${transition_control}`)
        }
        const isButtons = this.getAttribute('buttons')

        if(isButtons){
            carousel.classList.add(`carousel__buttons-${isButtons}`)
        }
        const isPins = this.getAttribute('pins')

        if(isPins){
            carousel.classList.add(`carousel__pins-${isPins}`)
        }
        const isTextEffect = this.getAttribute('text-effect')

        if(isTextEffect === 'true'){
            carousel.classList.add(`carousel__with-text-effect`)
        }

        this.candy_utils.handlePassId(this,carousel)
        this.candy_utils.handlePassClass(this,carousel)
        this.candy_utils.handleSetAttributes(this,carousel)

        const carousel_view = this.querySelector('ui-carousel-view')
        const carousel_view_div = document.createElement('div')
        if(carousel_view){
            carousel_view_div.classList.add('carousel__view')
            this.candy_utils.handlePassId(carousel_view,carousel_view_div)
            this.candy_utils.handlePassClass(carousel_view,carousel_view_div)
            this.candy_utils.handleSetAttributes(carousel_view,carousel_view_div)
        }

        const carousel_items = this.querySelectorAll('ui-carousel-item')
        carousel_items.forEach((item) =>{
            const carousel_item_div = document.createElement('div')
            carousel_item_div.classList.add('carousel__item')

            this.candy_utils.handlePassId(item,carousel_item_div)
            this.candy_utils.handlePassClass(item,carousel_item_div)
            this.candy_utils.handleSetAttributes(item,carousel_item_div)

            const carousel_item_img = item.querySelector('ui-carousel-item-img')
            if(carousel_item_img){
                const carousel_item_img_div = document.createElement('div')
                carousel_item_img_div.classList.add('carousel__item-img')
                carousel_item_img_div.innerHTML = carousel_item_img.innerHTML

                this.candy_utils.handlePassId(carousel_item_img,carousel_item_img_div)
                this.candy_utils.handlePassClass(carousel_item_img,carousel_item_img_div)
                this.candy_utils.handleSetAttributes(carousel_item_img,carousel_item_img_div)

                carousel_item_div.appendChild(carousel_item_img_div)
            }

            const carousel_item_body = item.querySelector('ui-carousel-item-body')
            if(carousel_item_body){
                const carousel_item_body_div = document.createElement('div')
                carousel_item_body_div.classList.add('carousel__item-body')

                this.candy_utils.handlePassId(carousel_item_body,carousel_item_body_div)
                this.candy_utils.handlePassClass(carousel_item_body,carousel_item_body_div)
                this.candy_utils.handleSetAttributes(carousel_item_body,carousel_item_body_div)

                const carousel_item_heading = carousel_item_body.querySelector('ui-carousel-item-heading')
                if(carousel_item_heading){
                    const carousel_item_heading_div = document.createElement('div')
                    carousel_item_heading_div.classList.add('carousel__item-heading')
                    carousel_item_heading_div.innerHTML = carousel_item_heading.innerHTML

                    this.candy_utils.handlePassId(carousel_item_heading,carousel_item_heading_div)
                    this.candy_utils.handlePassClass(carousel_item_heading,carousel_item_heading_div)
                    this.candy_utils.handleSetAttributes(carousel_item_heading,carousel_item_heading_div)

                    carousel_item_body_div.appendChild(carousel_item_heading_div)
                }
                const carousel_item_text = carousel_item_body.querySelector('ui-carousel-item-text')
                if(carousel_item_text){
                    const carousel_item_text_div = document.createElement('div')
                    carousel_item_text_div.classList.add('carousel__item-text')
                    carousel_item_text_div.innerHTML = carousel_item_text.innerHTML

                    this.candy_utils.handlePassId(carousel_item_text,carousel_item_text_div)
                    this.candy_utils.handlePassClass(carousel_item_text,carousel_item_text_div)
                    this.candy_utils.handleSetAttributes(carousel_item_text,carousel_item_text_div)

                    carousel_item_body_div.appendChild(carousel_item_text_div)
                }
                const carousel_item_footer = carousel_item_body.querySelector('ui-carousel-item-footer')
                if(carousel_item_footer){
                    const carousel_item_footer_div = document.createElement('div')
                    carousel_item_footer_div.classList.add('carousel__item-footer')

                    this.candy_utils.handlePassId(carousel_item_footer,carousel_item_footer_div)
                    this.candy_utils.handlePassClass(carousel_item_footer,carousel_item_footer_div)
                    this.candy_utils.handleSetAttributes(carousel_item_footer,carousel_item_footer_div)

                    carousel_item_footer_div.innerHTML = carousel_item_footer.innerHTML
                    carousel_item_body_div.appendChild(carousel_item_footer_div)
                }
                carousel_item_div.appendChild(carousel_item_body_div)
                carousel_view_div.appendChild(carousel_item_div)
            }


           if(carousel_view){
                carousel.appendChild(carousel_view_div)
           }

           this.innerHTML = ''
           this.appendChild(carousel)


        })
     }
}
window.customElements.define(Carousel_Component.component_name,Carousel_Component)
class Divider_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.divider = new Divider()
    }
    static component_name = 'ui-divider'
    connectedCallback() {
        this.handleMakeDivider()
        setTimeout(() => {
        this.divider = new Divider()
         this.divider.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeDivider(){
        const text = this.getAttribute('text')
        const tag = this.getAttribute('tag')
        const type = this.getAttribute('type')
        const color_type = this.getAttribute('color-type')
        const color = this.getAttribute('color')
        const divider = document.createElement('div')
        divider.classList.add('divider')
        const divider_line_1 = document.createElement('div')
        const divider_line_2 = document.createElement('div')
        let divider_text
        if(tag){
            divider_text = document.createElement(`${tag}`)
        }else{
            divider_text = document.createElement(`h3`)
        }
        if(type){
            divider_text.classList.add(`divider__text-${type}`)
        }
        divider_text.innerHTML = this.innerHTML
        if(type && color_type && color){
            divider_line_1.classList.add(`divider__${type}-${color_type}-${color}`)
            divider_line_2.classList.add(`divider__${type}-${color_type}-${color}`)
        }else{
            alert('You need to specify divider type color-type and color')
        }
        divider.appendChild(divider_line_1)
        divider.appendChild(divider_text)
        divider.appendChild(divider_line_2)
        this.innerHTML = divider.outerHTML


     }
}
window.customElements.define(Divider_Component.component_name,Divider_Component)
class Tooltip_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.tooltip = new Tooltip()
    }
    static component_name = 'ui-tooltip'
    connectedCallback() {
        this.handleMakeTooltip()
        setTimeout(() => {
         this.tooltip = new Tooltip()
         this.tooltip.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeTooltip(){
        const tooltip = document.createElement('div')
        tooltip.classList.add('tooltip')  
        this.candy_utils.handlePassId(this,tooltip)
        this.candy_utils.handlePassClass(this,tooltip)
        this.candy_utils.handleSetAttributes(this,tooltip)
        
        const tooltip_target = this.querySelector('ui-tooltip-target')
        const tooltip_target_div = document.createElement('div')

        if(tooltip_target){
            this.candy_utils.handlePassId(tooltip_target,tooltip_target_div)
            this.candy_utils.handlePassClass(tooltip_target,tooltip_target_div)
            this.candy_utils.handleSetAttributes(tooltip_target,tooltip_target_div)
            tooltip_target_div.innerHTML = tooltip_target.innerHTML
            tooltip_target.remove()
            tooltip.appendChild(tooltip_target_div)
        }

        const tooltip_content = this.querySelector('ui-tooltip-content')
        const tooltip_content_div = document.createElement('div')
        const tooltip_direction = this.getAttribute('direction')

        if(tooltip_content){
            if(tooltip_direction){
                tooltip_content_div.classList.add(`tooltip__content-${tooltip_direction}`)
            }else{
                tooltip_content_div.classList.add('tooltip__content-top')
            }
            this.candy_utils.handlePassId(tooltip_content,tooltip_content_div)
            this.candy_utils.handlePassClass(tooltip_content,tooltip_content_div)
            this.candy_utils.handleSetAttributes(tooltip_content,tooltip_content_div)
        }

        const tooltip_header = this.querySelector('ui-tooltip-header')
        const tooltip_header_div = document.createElement('div')
        if(tooltip_header){
            tooltip_header_div.classList.add('tooltip__header')
            tooltip_header_div.innerHTML = tooltip_header.innerHTML
            this.candy_utils.handlePassId(tooltip_header,tooltip_header_div)
            this.candy_utils.handlePassClass(tooltip_header,tooltip_header_div)
            this.candy_utils.handleSetAttributes(tooltip_header,tooltip_header_div)
            tooltip_content_div.appendChild(tooltip_header_div)
        }

        const tooltip_text = this.querySelector('ui-tooltip-text')
        const tooltip_text_div = document.createElement('div')
        if(tooltip_text){
            tooltip_text_div.classList.add('tooltip__text')
            tooltip_text_div.innerHTML = tooltip_text.innerHTML
            this.candy_utils.handlePassId(tooltip_text,tooltip_text_div)
            this.candy_utils.handlePassClass(tooltip_text,tooltip_text_div)
            this.candy_utils.handleSetAttributes(tooltip_text,tooltip_text_div)
            tooltip_content_div.appendChild(tooltip_text_div)
        }

        if(tooltip_content){
            tooltip.appendChild(tooltip_content_div)
        }
        this.innerHTML = ''
        this.appendChild(tooltip)
     }
}
window.customElements.define(Tooltip_Component.component_name,Tooltip_Component)
class Tabs_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.tabs = new Tabs()
    }
    static component_name = 'ui-tabs'
    connectedCallback() {
        this.handleMakeTabs()
        setTimeout(() => {
         this.tabs = new Tabs()
         this.tabs.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeTabs(){
        const tabs = document.createElement('div')
        tabs.classList.add('tabs')
        this.candy_utils.handlePassId(this,tabs)
        this.candy_utils.handlePassClass(this,tabs)
        this.candy_utils.handleSetAttributes(this,tabs)

        const pills = this.getAttribute('pills')

        if(pills === 'true'){
            tabs.classList.add('tabs__pills')
        }

        const tabs_nav = this.querySelector('ui-tabs-nav')
        const tabs_nav_div = document.createElement('div')

        if(tabs_nav){
            tabs_nav_div.classList.add('tabs__nav')
            this.candy_utils.handlePassId(tabs_nav,tabs_nav_div)
            this.candy_utils.handlePassClass(tabs_nav,tabs_nav_div)
            this.candy_utils.handleSetAttributes(tabs_nav,tabs_nav_div)
        }

        const tabs_nav_items = [...this.querySelectorAll('ui-tabs-nav-item')]

        tabs_nav_items.forEach(item =>{
            const tabs_nav_item_div = document.createElement('div')
            tabs_nav_item_div.classList.add('tabs__nav-item')
            const data_tab = item.getAttribute('data-tab')
            if(data_tab){
                tabs_nav_item_div.setAttribute('data-tab',data_tab)
            }
            this.candy_utils.handlePassId(item,tabs_nav_item_div)
            this.candy_utils.handlePassClass(item,tabs_nav_item_div)
            this.candy_utils.handleSetAttributes(item,tabs_nav_item_div)
            tabs_nav_item_div.innerHTML = item.innerHTML
            tabs_nav_div.appendChild(tabs_nav_item_div)
        })

        if(tabs_nav_items.length > 0){
            tabs.appendChild(tabs_nav_div)
        }


        const tabs_wrapper = this.querySelector('ui-tabs-wrapper')
        const tabs_wrapper_div = document.createElement('div')
        if(tabs_wrapper){
            tabs_wrapper_div.classList.add('tabs__tabs-wrapper')
            this.candy_utils.handlePassId(tabs_wrapper,tabs_wrapper_div)
            this.candy_utils.handlePassClass(tabs_wrapper,tabs_wrapper_div)
            this.candy_utils.handleSetAttributes(tabs_wrapper,tabs_wrapper_div)
        }

        const tabs_view = this.querySelector('ui-tabs-view')
        const tabs_view_div = document.createElement('div')
        if(tabs_view){
            tabs_view_div.classList.add('tabs__view')
            this.candy_utils.handlePassId(tabs_view,tabs_view_div)
            this.candy_utils.handlePassClass(tabs_view,tabs_view_div)
            this.candy_utils.handleSetAttributes(tabs_view,tabs_view_div)
            tabs_wrapper_div.appendChild(tabs_view_div)
        }

        const tabs_tabs = [...this.querySelectorAll('ui-tabs-tab')]
        tabs_tabs.forEach((tab,index) =>{
            const tabs_tab_div = document.createElement('div')
            tabs_tab_div.classList.add('tabs__tab')
            const isActive = tab.getAttribute('active')
            if(isActive === 'true'){
                tabs_tab_div.classList.add('active')
            }
            this.candy_utils.handlePassId(tab,tabs_tab_div)
            this.candy_utils.handlePassClass(tab,tabs_tab_div)
            this.candy_utils.handleSetAttributes(tab,tabs_tab_div)
            tabs_tab_div.innerHTML = tab.innerHTML
            tabs_view_div.appendChild(tabs_tab_div)
        })

        if(tabs_wrapper){
            tabs.appendChild(tabs_wrapper_div)
        }

        this.innerHTML = ''
        this.append(tabs)
     }
}
window.customElements.define(Tabs_Component.component_name,Tabs_Component)
class Input_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.input = new Input()
    }
    static component_name = 'ui-input'
    connectedCallback() {
        this.handleMakeInput()
        setTimeout(() => {
         this.input = new Input()
         this.input.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeInput(){
        const input = document.createElement('div')

        let label_el
        const input_el = document.createElement('input')
        const placeholder = this.getAttribute('placeholder')
        if(placeholder){
            input_el.setAttribute('placeholder', placeholder)
        }

        const label_attr = this.getAttribute('label')
        if(label_attr){
            label_el = document.createElement('label')
            label_el.innerHTML = label_attr
        }
        const for_attr = this.getAttribute('for')
        if(for_attr){
            label_el.setAttribute('for',for_attr)
        }
        const type = this.getAttribute('type')
        if(type){
            input_el.setAttribute('type',type)
        }
        if(label_el){
            input.appendChild(label_el)
        }
        input.appendChild(input_el)
        const style_type = this.getAttribute('style-type')
        if(style_type){
            if(style_type === 'normal'){
                input.classList.add('input__field-normal')
            }
            else if(style_type === 'line'){
                input.classList.add('input__field-line')
            }
            else if(style_type === 'underscore'){
                input.classList.add('input__field-underscore')
                const underscore_el = document.createElement('div')
                underscore_el.classList.add('input__underscore-line-effect')
                input.appendChild(underscore_el)
            }else{
                input.classList.add('input__field')
            }
        }else{
            input.classList.add('input__field')
        }

        
        this.candy_utils.handlePassId(this,input)
        this.candy_utils.handlePassClass(this,input)
        this.candy_utils.handleSetAttributes(this,input)
        this.innerHTML = ''
        this.appendChild(input)
     }
}
window.customElements.define(Input_Component.component_name,Input_Component)
class Modal_Button_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.modal = new Modal()
    }
    static component_name = 'ui-modal-button'
    connectedCallback() {
        this.handleMakeModalButton()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeModalButton(){
        const modal_button = document.createElement('button')
        modal_button.classList.add('modal__open-modal') 
        this.candy_utils.handlePassId(this,modal_button)
        this.candy_utils.handlePassClass(this,modal_button)
        this.candy_utils.handleSetAttributes(this,modal_button)
        const target = this.getAttribute('target')
        if(target){
            modal_button.setAttribute('data-target',target)
        }
        this.candy_utils.handlePassId(this,modal_button)
        this.candy_utils.handlePassClass(this,modal_button)
        this.candy_utils.handleSetAttributes(this,modal_button)
        modal_button.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(modal_button)
     }
}
window.customElements.define(Modal_Button_Sub_Component.component_name,Modal_Button_Sub_Component)
class Modal_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.modal = new Modal()
    }
    static component_name = 'ui-modal'
    connectedCallback() {
        this.handleMakeModal()
        setTimeout(() => {
         this.modal = new Modal()
         this.modal.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeModal(){
        const modal = document.createElement('div')
        modal.classList.add('ui-modal')
        this.candy_utils.handlePassId(this,modal)
        this.candy_utils.handlePassClass(this,modal)
        this.candy_utils.handleSetAttributes(this,modal)
        const modal_wrapper = this.querySelector('ui-modal-wrapper')
        const modal_wrapper_div = document.createElement('div')
        if(modal_wrapper){
            modal_wrapper_div.classList.add('modal-wrapper')
            this.candy_utils.handlePassId(modal_wrapper,modal_wrapper_div)
            this.candy_utils.handlePassClass(modal_wrapper,modal_wrapper_div)
            this.candy_utils.handleSetAttributes(modal_wrapper,modal_wrapper_div)
        }

        const modal_overlay = this.querySelector('ui-modal-overlay')
        const modal_overlay_div = document.createElement('div')
        if(modal_overlay){
            modal_overlay_div.classList.add('modal__overlay')
            this.candy_utils.handlePassId(modal_overlay,modal_overlay_div)
            this.candy_utils.handlePassClass(modal_overlay,modal_overlay_div)
            this.candy_utils.handleSetAttributes(modal_overlay,modal_overlay_div)
            modal_wrapper_div.appendChild(modal_overlay_div)
        }
        const modal_item = this.querySelector('ui-modal-item')
        const modal_item_div = document.createElement('div')
        if(modal_item){
            modal_item_div.classList.add('modal')
            const combine = modal_item.getAttribute('combine')
            if(combine === 'true'){
                modal_item_div.classList.add('modal__combine')
            }
            this.candy_utils.handlePassId(modal_item,modal_item_div)
            this.candy_utils.handlePassClass(modal_item,modal_item_div)
            this.candy_utils.handleSetAttributes(modal_item,modal_item_div)
            modal_wrapper_div.appendChild(modal_item_div)
        }

        const modal_img = this.querySelector('ui-modal-img')
        const modal_img_div = document.createElement('div')
        if(modal_img){
            modal_img_div.classList.add('modal__img')
            this.candy_utils.handlePassId(modal_img,modal_img_div)
            this.candy_utils.handlePassClass(modal_img,modal_img_div)
            this.candy_utils.handleSetAttributes(modal_img,modal_img_div)
            modal_img_div.innerHTML = modal_img.innerHTML
            modal_item_div.appendChild(modal_img_div)
        }

        const modal_header = this.querySelector('ui-modal-header')
        const modal_header_div = document.createElement('div')
        if(modal_header){
            modal_header_div.classList.add('modal__header')
            this.candy_utils.handlePassId(modal_header,modal_header_div)
            this.candy_utils.handlePassClass(modal_header,modal_header_div)
            this.candy_utils.handleSetAttributes(modal_header,modal_header_div)
            modal_header_div.innerHTML = modal_header.innerHTML
            modal_item_div.appendChild(modal_header_div)
        }

        const modal_text = this.querySelector('ui-modal-text')
        const modal_text_div = document.createElement('div')
        if(modal_text){
            modal_text_div.classList.add('modal__text')
            this.candy_utils.handlePassId(modal_text,modal_text_div)
            this.candy_utils.handlePassClass(modal_text,modal_text_div)
            this.candy_utils.handleSetAttributes(modal_text,modal_text_div)
            modal_text_div.innerHTML = modal_text.innerHTML
            modal_item_div.appendChild(modal_text_div)
        }


        const modal_footer = this.querySelector('ui-modal-footer')
        const modal_footer_div = document.createElement('div')
        if(modal_footer){
            modal_footer_div.classList.add('modal__footer')
            this.candy_utils.handlePassId(modal_footer,modal_footer_div)
            this.candy_utils.handlePassClass(modal_footer,modal_footer_div)
            this.candy_utils.handleSetAttributes(modal_footer,modal_footer_div)
            modal_footer_div.innerHTML = modal_footer.innerHTML
            modal_item_div.appendChild(modal_footer_div)
        }

        const modal_close = this.querySelector('ui-modal-close')
        const modal_close_div = document.createElement('div')

        if(modal_close){
            modal_close_div.classList.add('modal__controls')
            const button = document.createElement('button')
            button.classList.add('modal__close')
            button.innerHTML = modal_close.innerHTML
            modal_close_div.appendChild(button)
            modal_item_div.appendChild(modal_close_div)
        }

        if(modal_item){
            modal_wrapper_div.appendChild(modal_item_div)
        }

        if(modal_wrapper){
            modal.appendChild(modal_wrapper_div)
        }

        this.innerHTML = ''
        this.appendChild(modal)
     }
}
window.customElements.define(Modal_Component.component_name,Modal_Component)
class Parallax_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.parallax = new Parallax()
    }
    static component_name = 'ui-parallax'
    connectedCallback() {
        this.handleMakeParallax()
        setTimeout(() => {
         this.parallax = new Parallax()
         this.parallax.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeParallax(){
        const parallax = document.createElement('div')
        parallax.classList.add('parallax')
        this.candy_utils.handlePassId(this, parallax)
        this.candy_utils.handlePassClass(this, parallax)
        this.candy_utils.handleSetAttributes(this, parallax)

        const transition = this.getAttribute('transition')
        if(transition === 'slide' || transition === 'fade'){
            parallax.classList.add(`parallax__${transition}`)
        }

        const parallax_imgs = this.querySelectorAll('ui-parallax-img')

        parallax_imgs.forEach(img =>{
            const image = img.querySelector('img')
            const parallax_img_div = document.createElement('div')
            parallax_img_div.classList.add('parallax__img')
            this.candy_utils.handlePassId(img, parallax_img_div)
            this.candy_utils.handlePassClass(img, parallax_img_div)
            this.candy_utils.handleSetAttributes(img, parallax_img_div)
            parallax_img_div.appendChild(image)
            const parallax_content = img.querySelector('ui-parallax-content')
            const parallax_content_div = document.createElement('div')
            if(parallax_content){
                parallax_content_div.classList.add('parallax__content')
                const parallax_header = parallax_content.querySelector('ui-parallax-content-header')
                const parallax_header_div = document.createElement('div')
                if(parallax_header){
                    parallax_header_div.classList.add('parallax__content-header')
                    this.candy_utils.handlePassId(parallax_header, parallax_header_div)
                    this.candy_utils.handlePassClass(parallax_header, parallax_header_div)
                    this.candy_utils.handleSetAttributes(parallax_header, parallax_header_div)
                    parallax_header_div.innerHTML = parallax_header.innerHTML
                    parallax_content_div.appendChild(parallax_header_div)
                }
                const parallax_text = parallax_content.querySelector('ui-parallax-content-text')
                const parallax_text_div = document.createElement('div')
                if(parallax_text){
                    parallax_text_div.classList.add('parallax__content-text')
                    this.candy_utils.handlePassId(parallax_text, parallax_header_div)
                    this.candy_utils.handlePassClass(parallax_text, parallax_header_div)
                    this.candy_utils.handleSetAttributes(parallax_text, parallax_header_div)
                    parallax_text_div.innerHTML = parallax_text.innerHTML
                    parallax_content_div.appendChild(parallax_text_div)
                }
            }
            parallax_img_div.appendChild(parallax_content_div)
            parallax.appendChild(parallax_img_div)
        })
        this.innerHTML = ''
        this.appendChild(parallax)
     }
}
window.customElements.define(Parallax_Component.component_name,Parallax_Component)
class Progress_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.progress = new Progress()
    }
    static component_name = 'ui-progress'
    connectedCallback() {
        this.handleMakeProgres()
        setTimeout(() => {
         this.progress = new Progress()
         this.progress.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeProgres(){
        const progress = document.createElement('div')
        this.candy_utils.handlePassId(this,progress)
        this.candy_utils.handlePassClass(this,progress)
        this.candy_utils.handleSetAttributes(this,progress)
        const type = this.getAttribute('type')
        if(type === 'line' | !type) {
            progress.classList.add('progress')
        }else if(type === 'round'){
            progress.classList.add('progress-round')
            const dot_color = this.getAttribute('dot-color')
            if(dot_color){
                progress.classList.add(`progress-round__dot-${dot_color}`)
            }
        }
        const mixed = this.getAttribute('mixed')
        if(mixed === 'true'){
            progress.classList.add('progress__mixed')
        }

        const progress_position = this.querySelector('ui-progress-position')
        const progress_position_div = document.createElement('div')
        if(progress_position){
            if(type === 'round'){
                progress_position_div.classList.add('progress-round__position')
            }else if(type === 'line'){
                progress_position_div.classList.add('progress__position')
            }
            const position = this.getAttribute('position')
            this.candy_utils.handlePassId(progress_position,progress_position_div)
            this.candy_utils.handlePassClass(progress_position,progress_position_div)
            this.candy_utils.handleSetAttributes(progress_position,progress_position_div)
            if(position){
                progress_position_div.textContent = position
            }
            progress.appendChild(progress_position_div)
        }
        if(type === 'line' | !type){
            const progress_bar = this.querySelector('ui-progress-bar')
            const progress_bar_div = document.createElement('div')
            if(progress_bar){
                this.candy_utils.handlePassId(progress_bar,progress_bar_div)
                this.candy_utils.handlePassClass(progress_bar,progress_bar_div)
                this.candy_utils.handleSetAttributes(progress_bar,progress_bar_div)
                progress_bar_div.classList.add('progress__bar')
                progress.appendChild(progress_bar_div)
            }
        }
        this.innerHTML = ''
        this.appendChild(progress)
     }
}
window.customElements.define(Progress_Component.component_name,Progress_Component)
class Rating_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.rating = new Rating()
    }
    static component_name = 'ui-rating'
    connectedCallback() {
        this.handleMakeRating()
        setTimeout(() => {
         this.rating = new Rating()
         this.rating.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeRating(){
        const rating = document.createElement('div')
        const stars_count = this.getAttribute('rating')
        if(stars_count){
            rating.classList.add(`rating-${stars_count}`)
        }
        const icon_size = this.getAttribute('icon-size')
        if(icon_size){
            rating.classList.add(`rating__icon-${icon_size}x`)
        }
        this.innerHTML = ''
        const background = this.getAttribute('background')
        if(!background){
            rating.classList.add('bg-white')
        }
        this.candy_utils.handlePassId(this,rating)
        this.candy_utils.handlePassClass(this,rating)
        this.candy_utils.handleSetAttributes(this,rating)
        this.appendChild(rating)
     }
}
window.customElements.define(Rating_Component.component_name,Rating_Component)
class Sidebar_Button_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.sidebar = new Sidebar()
    }
    static component_name = 'ui-sidebar-button'
    connectedCallback() {
        this.handleMakeSidebarButton()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeSidebar(){
        
     }
     handleMakeSidebarButton(){
        const button = document.createElement('button')
        button.classList.add('sidebar__open-sidebar')
        this.candy_utils.handlePassId(this,button)
        this.candy_utils.handlePassClass(this,button)
        this.candy_utils.handleSetAttributes(this,button)
        const target = this.getAttribute('target-id')
        if(target){
            button.setAttribute('data-target-id',target)
        }
        button.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(button)
     }
}
window.customElements.define(Sidebar_Button_Component.component_name,Sidebar_Button_Component)
class Sidebar_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.sidebar = new Sidebar()
    }
    static component_name = 'ui-sidebar'
    connectedCallback() {
        this.handleMakeSidebar()
        setTimeout(() => {
         this.sidebar = new Sidebar()
         this.sidebar.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeSidebar(){
        const sidebar = document.createElement('sidebar')
        sidebar.classList.add('sidebar')
        this.candy_utils.handlePassId(this,sidebar)
        this.candy_utils.handlePassClass(this,sidebar)
        this.candy_utils.handleSetAttributes(this,sidebar)

        const transition_control = this.getAttribute('transition-control')
        if(transition_control){
            sidebar.classList.add(`sidebar__${transition_control}`)
        }
        const circle = this.getAttribute('circle')
        if(circle){
            sidebar.classList.add(`sidebar__circle-${circle}`)
        }

        const sidabar_items = this.querySelectorAll('ui-sidebar-item')
        sidabar_items.forEach(item =>{
            const sidebar_item_div = document.createElement('div')
            sidebar_item_div.classList.add('sidebar__item')
            const sidebar_item_icon = document.createElement('i')
            sidebar_item_icon.classList.add('fa')
            const isLeft = this.getAttribute('direction')
            if(isLeft === 'left' | !isLeft){
                sidebar_item_icon.classList.add('fa-chevron-right')
            }else if(isLeft === 'right'){
                sidebar_item_icon.classList.add('fa-chevron-left')
            }
            sidebar_item_icon.classList.add('fa-1x')
            if(isLeft === 'left' | !isLeft){
                sidebar_item_div.innerHTML = item.innerHTML
                sidebar_item_div.appendChild(sidebar_item_icon)
            }else if(isLeft === 'right'){
                sidebar_item_div.innerHTML = item.innerHTML
                sidebar_item_div.prepend(sidebar_item_icon)
            }
            this.candy_utils.handlePassId(item,sidebar_item_div)
            this.candy_utils.handlePassClass(item,sidebar_item_div)
            this.candy_utils.handleSetAttributes(item,sidebar_item_div)
            sidebar.appendChild(sidebar_item_div)
        })
        this.innerHTML = ''
        this.appendChild(sidebar)
     }
}
window.customElements.define(Sidebar_Component.component_name,Sidebar_Component)
class Nav_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.nav = new Nav()
    }
    static component_name = 'ui-nav'
    connectedCallback() {
        this.handleMakeNav()
        setTimeout(() => {
         this.nav = new Nav()
         this.nav.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeNav(){
        const nav = document.createElement('div')
        nav.classList.add('nav')
        this.candy_utils.handlePassId(this,nav)
        this.candy_utils.handlePassClass(this,nav)
        this.candy_utils.handleSetAttributes(this,nav)

        const nav_hamburger = this.querySelector('ui-nav-hamburger')
        if(nav_hamburger){
            const nav_hamburger_div = document.createElement('div')
            const nav_hamburger_div_html = `
                <div class="nav__hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `
            // nav_hamburger_div.outerHTML = nav_hamburger_div_html
            const target_id = nav_hamburger.getAttribute('target-id')
            if(target_id){
                nav_hamburger_div.setAttribute('data-target-id',target_id)
            }
            nav.appendChild(nav_hamburger_div)
        }

        const nav_menu = this.querySelector('ui-nav-menu')
        const nav_menu_div = document.createElement('div')
        if(nav_menu){
            nav_menu_div.classList.add('nav__menu')
            const transition_control = nav_menu.getAttribute('transition-control')
            if(transition_control){
                nav_menu_div.classList.add(`nav__menu-${transition_control}`)
            }
            this.candy_utils.handlePassId(nav_menu,nav_menu_div)
            this.candy_utils.handlePassClass(nav_menu,nav_menu_div)
            this.candy_utils.handleSetAttributes(nav_menu,nav_menu_div)
        }

        const nav_menu_items = this.querySelectorAll('ui-nav-menu-item')
        nav_menu_items.forEach(item =>{
            const nav_menu_item_div = document.createElement('div')
            nav_menu_item_div.classList.add('nav__menu-item')

            const underline = item.getAttribute('underline')
            if(underline){
                nav_menu_item_div.classList.add(`nav__menu-item-underline-${underline}`)
            }
            const hover_transition = item.getAttribute('hover-transition')
            if(hover_transition){
                nav_menu_item_div.classList.add(`nav__menu-item-hover-${hover_transition}`)
            }

            const isActive = item.getAttribute('active')
            if(isActive === 'true'){
                nav_menu_item_div.classList.add('active')
            } 
            nav_menu_item_div.innerHTML = item.innerHTML
            nav_menu_div.appendChild(nav_menu_item_div)
        })

        if(nav_menu){
            nav.appendChild(nav_menu_div)
        }
        this.innerHTML = ''
        this.appendChild(nav)
    }
}
window.customElements.define(Nav_Component.component_name,Nav_Component)
class Loader_Component extends HTMLElement {
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.loader = new Loader()
    }
    static component_name = 'ui-loader'
    connectedCallback() {
        this.handleMakeLoader()
        setTimeout(() => {
         this.loader = new Loader()
         this.loader.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeLoader(){
        const loader = document.createElement('div')
        const type = this.getAttribute('type')
        loader.classList.add('loader')
        if(type === 'line'){
            loader.classList.add('loader__line')
        }else if(type === 'circle'){
            loader.classList.add('loader__circle')
        }
        const line_color = this.getAttribute('line-color')
        if(line_color){
            loader.classList.add(`loader__line-${line_color}`)
        }
        const theme = this.getAttribute('circle-theme')
        if(theme === 'dark'){
            loader.classList.add('loader__circle-dark')
        }else if(theme === 'light'){
            loader.classList.add('loader__circle-light')
        }
        const circle_background = this.getAttribute('circle-color')
        if(circle_background && type === 'circle'){
            loader.classList.add(`loader__circle-color-${circle_background}`)
        }else if(type === 'circle'){
            alert('You need to set circle color')
        }
        this.candy_utils.handlePassId(this,loader)
        this.candy_utils.handlePassClass(this,loader)
        this.candy_utils.handleSetAttributes(this,loader)
        this.innerHTML = ''
        this.appendChild(loader)
     }
}
window.customElements.define(Loader_Component.component_name,Loader_Component)
class Step_Right_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-right'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__right')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Right_Sub_Component.component_name,Step_Right_Sub_Component)
class Step_Left_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-left'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__left')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Left_Sub_Component.component_name,Step_Left_Sub_Component)
class Step_Content_Sub_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step-content'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step__content')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.outerHTML = step.outerHTML
     }
}
window.customElements.define(Step_Content_Sub_Component.component_name,Step_Content_Sub_Component)
class Step_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.step = new Step()
    }
    static component_name = 'ui-step'
    connectedCallback() {
        this.handleMakeStep()
        setTimeout(() => {
         this.step = new Step()
         this.step.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeStep(){
        const step = document.createElement('div')
        step.classList.add('step')
        this.candy_utils.handlePassId(this,step)
        this.candy_utils.handlePassClass(this,step)
        this.candy_utils.handleSetAttributes(this,step)
        step.innerHTML = this.innerHTML
        this.innerHTML = ''
        this.appendChild(step)
     }
}
window.customElements.define(Step_Component.component_name,Step_Component)
class Toast_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
        this.toast = new Toast()
    }
    static component_name = 'ui-toast'
    connectedCallback() {
        this.handleMakeToast()
        setTimeout(() => {
         this.toast = new Toast()
         this.toast.handleSetup()
      }, 100);
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeToast(){
        const toast = document.createElement('div')
        toast.classList.add('toast')
        this.candy_utils.handlePassId(this,toast)
        this.candy_utils.handlePassClass(this,toast)
        this.candy_utils.handleSetAttributes(this,toast)

        const toast_header = this.querySelector('ui-toast-header')
        const toast_header_div = document.createElement('div')
        if(toast_header){
            toast_header_div.classList.add('toast__header')
            this.candy_utils.handlePassId(toast_header,toast_header_div)
            this.candy_utils.handlePassClass(toast_header,toast_header_div)
            this.candy_utils.handleSetAttributes(toast_header,toast_header_div)
            toast_header_div.innerHTML = toast_header.innerHTML
            const toast_close = this.querySelector('ui-toast-close')
            const toast_close_div = document.createElement('div')
            const toast_close_span_1 = document.createElement('span')
            const toast_close_span_2 = document.createElement('span')
            if(toast_close){
                toast_close_div.classList.add('toast__close')
                toast_close_div.appendChild(toast_close_span_1)
                toast_close_div.appendChild(toast_close_span_2)
                toast_header_div.appendChild(toast_close_div)
            }
            toast.appendChild(toast_header_div)
        }

        const toast_body = this.querySelector('ui-toast-body')
        const toast_body_div = document.createElement('div')
        if(toast_body){
            toast_body_div.classList.add('toast__body')
            this.candy_utils.handlePassId(toast_body,toast_body_div)
            this.candy_utils.handlePassClass(toast_body,toast_body_div)
            this.candy_utils.handleSetAttributes(toast_body,toast_body_div)
            toast_body_div.innerHTML = toast_body.innerHTML
            toast.appendChild(toast_body_div)
        }
        this.innerHTML = ''
        this.appendChild(toast)
     }
}
window.customElements.define(Toast_Component.component_name,Toast_Component)
class Flex_Component extends HTMLElement{
    constructor(){
        super()
        this.candy_utils = new Candy_Utils()
    }
    static component_name = 'ui-flex'
    connectedCallback() {
        this.handleMakeFlex()
     }
     disconnectedCallback() {
 
     }
     attributeChangedCallback(name, oldValue, newValue) {
      
     }
     adoptedCallback() {
     }
     handleMakeFlex(){
        const flex = document.createElement('div')
        flex.classList.add('flex')

        const flex_attr = this.getAttribute('flex')

        if(flex_attr){
            flex.classList.add(`flex__${flex_attr}`)
        }
        const flex_wrap_attr = this.getAttribute('flex-wrap')

        if(flex_wrap_attr){
            flex.classList.add(`flex__wrap-${flex_wrap_attr}`)
        }
        const jusitfy_attr = this.getAttribute('justify')

        if(jusitfy_attr){
            flex.classList.add(`justify__flex-${jusitfy_attr}`)
        }
        const align_attr = this.getAttribute('align')

        if(align_attr){
            flex.classList.add(`align-items__flex-${align_attr}`)
        }

        flex.innerHTML = this.innerHTML

        this.innerHTML = ''
        this.appendChild(flex)
        
     }
}
window.customElements.define(Flex_Component.component_name,Flex_Component)

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
class Framework{
    constructor(){
        this.globalSetup = new GlobalSetup(
            ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black','white','light-white','medium-white'],
            document.documentElement,
            700,
            0.7,
            0.5
        )
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
    handleSetupAll(){
        this.handleCardWithShadow()
        this.handleSetupFunctions()
        this.handleSetupEffects()
    }
}

