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