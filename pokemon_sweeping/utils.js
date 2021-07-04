const debug = true
const log = debug ? console.log.bind(console) : function() { }

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

const markedSquare = function(array) {
    let square = copy(array)
    for (let i = 0; i < len(square); i++) {
        let line = square[i]
        for (let j = 0; j < len(line); j++) {
            if (square[i][j] === 9) {
                markedAround(square, i, j)
            }
        }
    }
    // log('square', square)
    return square
}

const markedAround = function(square, i, j) {
    // left
    jxyi(square, i, j - 1)
    // right
    jxyi(square, i, j + 1)
    // up
    jxyi(square, i - 1, j)
    // down
    jxyi(square, i + 1, j)

    // 四个顶点
    jxyi(square, i - 1, j - 1)
    // right
    jxyi(square, i + 1, j + 1)
    // up
    jxyi(square, i - 1, j + 1)
    // down
    jxyi(square, i + 1, j - 1)
}

const isSquare = function(square, i, j) {
    let rule_row = i >= 0 && i < len(square)
    let rule_col = j >= 0 && j < len(square[0])
    return rule_col && rule_row
}

const jxyi = function(square, i, j) {
    if (isSquare(square, i, j) && square[i][j] != 9) {
        square[i][j] += 1
    }
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

const toggle = (ele, className) => {
    if (ele.classList.contains(className)) {
        ele.classList.remove(className)
    } else {
        ele.classList.add(className)
    }
}

const removeAll = sel => {
    let tags = document.querySelectorAll(sel)
    tags.forEach((tag) => {
        tag.remove()
    })
}

const modal = (title, callback, actions = [],) => {
    // e('#unFind-mines-number').classList.add('hide')
    /*
        这个函数生成一个弹窗页面
        弹窗包含 title 作为标题
        actions 里面的 string 作为标题生成按钮
        弹窗还包含一个 Cancel 按钮
        点击按钮的时候, 调用 callback(index)
    */
    let buttons = []
    for (let i = 0; i < actions.length; i++) {
        let a = actions[i]
        buttons.push(buttonTemplate(a, i))
    }
    let actionButtons = buttons.join('')
    let t = `
    <div class='modal-container modal-remove'>
        <div class='modal-mask'></div>
        <div class="modal-alert vertical-center">
            <div class="modal-title">
                ${title}
            </div>
            <div class="modal-message">
                ${actionButtons}
            </div>
            <div class='modal-control'>
                <button class="modal-button modal-action-button" data-index="-1">Cancel</button>
            </div>
        </div>
    </div>
    `
    appendHtml(e('body'), t)
    // css
    let css = `
    <style class="modal-remove">
        .modal-container {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .modal-mask {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.5;
        }
        .modal-alert {
            margin: 0 auto;
            width: 200px;
            opacity: 1;
        }
        .modal-title {
            text-align: center;
            font-size: 27px;
            background: pink;
        }
        .modal-message {
            padding: 10px 5px;
            background: white;
        }
        .modal-input {
            width: 100%;
        }
        .modal-control {
            font-size: 0;
        }
        button {
            width: 100%;
        }
        .modal-button {
            height: 100%;
            font-size: 18px;
            border: 0;
        }
        .vertical-center {
            top: 50%;
            position: relative;
            transform: translateY(-50%);
        }
    </style>
    `
    appendHtml(e('head'), css)
    // event
    bindAll(es('.modal-action-button'), 'click', function(event) {
        //log('click button')
        let index = event.target.dataset.index
        callback(index)
        removeAll('.modal-remove')
    })
}