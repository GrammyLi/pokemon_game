const debug = true
const log = debug ? console.log.bind(console) : function () { }

const int = number => parseInt(number, 10)

const len = arr_or_str => arr_or_str.length

const copy = arr_or_obj => {
    let a = JSON.parse(JSON.stringify(arr_or_obj))
    return a
}
const bindEvent = (element, eventName, callback) => {
    element.addEventListener(eventName, callback)
}
const bindAll = (elements, eventName, callback) => {
    for (let e of elements) {
        bindEvent(e, eventName, callback)
    }
}
const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
}

const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)

const find = (ele, sel) => {
    return ele.querySelector(sel)
}

const shuffle = (arr) => {
    if (!Array.isArray(arr) && arr.length) {
        return []
    }
    for (let i = arr.length; i > 0; i--) {
        const idx = Math.floor(Math.random() * i)
        if (idx !== (i - 1)) {
            const tmp = arr[idx];
            arr[idx] = arr[i - 1]
            arr[i - 1] = tmp
        }
    }
    return arr
}

const imageFormPath = (path) => {
    let img = new Image()
    img.src = path
    return img
}

