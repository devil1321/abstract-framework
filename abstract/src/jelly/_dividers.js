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