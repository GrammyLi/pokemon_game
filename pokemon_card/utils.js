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

const randomBetween = (start, end) => {
    let n = Math.random() * (end - start + 1)
    return ~~(n + start)
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

const rjust = function(str, size, delimeter = '0') {
    let result = str
    while (result.length < size) {
        result = delimeter + result
    }
    return result
}

const formatTime = function(sum) {
    let m = String(Math.floor(sum % 3600 / 60))
    let s = String(Math.floor(sum % 60))
    let time = `${rjust(m, 2)}:${rjust(s, 2)}`
    return time
}