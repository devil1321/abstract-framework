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