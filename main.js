
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const styleDisplay = (a, b) => {
    a.style.display = `${b}`
}
const styleTrans = (a, b) => {
    a.style.transition = `${b}`
}

const addClass = (obj, cs) => {
    obj.classList.add(cs)
}
const removeClass = (obj, cs) => {
    obj.classList.remove(cs)
}
const toggleClass = (obj, cs) => {
    obj.classList.toggle(cs)
}

const formatNumber = num => {
    let arr = num.split('')
    let leng = arr.length
    let remainder = leng % 3
    let d = 0
    if(leng / 3 >= 1 && leng > 3) 
        for(let i = remainder; i < leng ; i+=3) {
            arr.splice(i + d, 0, ".")
            d++
        }
    if(arr[0] === ".") 
        arr.shift()
   
    return arr.join("") + "đ"
}

//todo add Transition to Element

let qr = $(".--item-hover-qrCode");
let navQRCode = $(".nav-qrCode")
qr.onmouseover = _ => styleTrans(navQRCode, ".2s ease-in-out")


let navItemNotis = $(".--item-hover-notifications");
let navNotis = $(".nav-notifications")
navItemNotis.onmouseover = _ => styleTrans(navNotis, '.2s linear')


let headerSearchingList = $(".searching-list")
let headerSearchingSubList = $(".searching-list__list")
headerSearchingList.onmouseover =  _ => {
    addClass(headerSearchingSubList, "searching-list__list--active")
    styleTrans(headerSearchingSubList, ".3s ease-in-out")
}
headerSearchingList.onmouseleave = _ => 
    removeClass(headerSearchingSubList, "searching-list__list--active")


let headerCart = $(".header-cart__wrap")
let headerCartList = $(".header-cart__list")
headerCart.onmouseover = _ => styleTrans(headerCartList, ".2s ease-out")


let navItemUser = $(".nav-list__item--user")
let userMenu = $(".user-menu")
navItemUser.onmouseover = _ => styleTrans(userMenu, ".2s ease-in")


//todo Logic Form Login Logout

let modal = $(".modal")
let modalInner = $('.modal-inner')
let formReg = $(".form-register")
let formLog = $(".form-login")
const modalFormActive = (visible, hidden) => {
    addClass(modalInner, "modal-inner--active")
    styleDisplay(visible, "block")
    styleDisplay(hidden, "none")
}

let switchBtnToLogin = $(".switch-form-btn--toLogin")
let switchBtnToRegister = $(".switch-form-btn--toRegister")
switchBtnToLogin.onclick = _ => modalFormActive(formLog, formReg)
switchBtnToRegister.onclick = _ => modalFormActive(formReg, formLog)

let registerBtn = $(".button--register")
let loginBtn = $(".button--login")
registerBtn.onclick = _ => {
    addClass(modal, "visible--active")
    modalFormActive(formReg, formLog)
}
loginBtn.onclick = _ => {
    addClass(modal, "visible--active")
    modalFormActive(formLog, formReg)
}
modal.addEventListener("click", function(e) {
    if(e.target.matches(".modal")) {
        removeClass(modalInner, "modal-inner--active")
        removeClass(modal, "visible--active")
    }
})
let modalBackBtn = $$(".back-btn")
modalBackBtn.forEach(btn => btn.onclick = _ => {
    removeClass(modalInner, "modal-inner--active")
    removeClass(modal, "visible--active")
})


//todo Logic Searching List Header

let searchingListText = $(".searching-list > span")
let searchingItem = $$(".searching-item")
let indexSearchingItem = 0

searchingItem.forEach((item, index) => {
    item.onclick = e => {
        let item = e.target
        let prevItem = searchingItem[indexSearchingItem] 

        searchingListText.innerText = item.innerText
        addClass(item, 'searching-item--active')

        if(indexSearchingItem !== index) {
            removeClass(prevItem, 'searching-item--active')
            indexSearchingItem = index
        }
        removeClass(headerSearchingSubList, "searching-list__list--active")
    }
})


//todo Logic products rate-part

let rateHeartDefault = $$('.rate-heart-default')
let rateHeartClicked = $$('.rate-heart-clicked')
let rateHeartArr = $$('.products-item__rate-heart')
rateHeartArr.forEach((item, index) => {
    item.onclick = e => {
        let heartDefault = rateHeartDefault[index] 
        let heartChange = rateHeartClicked[index] 
        if(e.target.closest('.rate-heart-default')) {
            styleDisplay(heartDefault, "none")
            styleDisplay(heartChange, "block")
        } else {
            styleDisplay(heartChange, "none")
            styleDisplay(heartDefault, "block")
        }
    }
})

let rateStarsItem = $$('.products-item__rate-stars')
let goldStar = 'rgb(255, 206, 62)'
let defaultStar = 'rgb(222, 222, 222)'
rateStarsItem.forEach(item => {
    let starsArrHtmlCollections = item.children
    //? convert HTMLCollections to array
    var starsArr = [...starsArrHtmlCollections];
    starsArr.map((star, index) => {
        star.onclick = _ => {
            let changeColorStars = starsArr.slice(0, index + 1)
            if(star.style.color === `${goldStar}`) {
                let changeDefaultColor = starsArr.slice(index + 1, starsArr.length + 1)
                //? default color
                changeDefaultColor.map(st => st.style.color = `${defaultStar}`)
            }     
            //? gold color       
            changeColorStars.map(st => st.style.color = `${goldStar}`)
        }
    })
})

let oldPrice = $$('.old-price')
let newPrice = $$('.new-price')
let oldPriceArr = [...oldPrice]
let newPriceArr = [...newPrice]
//? Format number
oldPriceArr.map(item => item.innerText = formatNumber(item.innerText))
newPriceArr.map(item => item.innerText = formatNumber(item.innerText))


//todo Logic Header Bars on Mobile

let searchMobileBtn = $(".header-bars-mb__searching")
let headerSearchingMid = $(".header-searching-mid")
searchMobileBtn.onclick = _ => {
    toggleClass(headerSearchingMid, "header-bars-mb--active")
}


//todo Menu-mobile

let aaa = $('.line-top-btn')
let bbb = $('.line-bot-btn')
let multiUseBtn = $('.multiUseBtn')
let menuMobile = $('.menu-mobile')
let menuMobileWrapper = $('.menu-mobile__wrapper')
multiUseBtn.onclick = _ => {
    toggleClass(menuMobile, "visible--active")
    toggleClass(menuMobileWrapper, 'menu-mobile__wrapper--active')
    toggleClass(multiUseBtn, "multiUseBtn--active")
    toggleClass(aaa, "line-top--active")
    toggleClass(bbb, "line-bot--active")
}