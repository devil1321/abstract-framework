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