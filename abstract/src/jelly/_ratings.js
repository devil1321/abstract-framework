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