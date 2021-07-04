/*
第一步： 生成　color　数据　完成
第二步： colors渲染　完成
第三步：绑定事件，抽离出算法 完成
第四步：解决颜色配置问题，多少行，多少列，那个主题，颜色种类个数

*/
const debug = true
const log = debug ? console.log.bind(console) : function() { }
const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)

const bindAll = (elements, eventName, callback) => {
    for (let element of elements) {
        element.addEventListener(eventName, callback)
    }
}
/**
 * 
 * @param {一行有多少个颜色} row 
 * @param {一列有多少个颜色} col 
 * @param {地图中颜色种类的个数} num 　　颜色种类　0 < num <= 5
 */
const userDefinedMap = (row = 5, col = 5, num = 5) => {
    let ps = []
    for (let i = 0; i < row; i++) {
        let list = []
        for (let j = 0; j < col; j++) {
            let n = Math.floor(Math.random() * num)
            list.push(n)
        }
        ps.push(list)
    }
    return ps
}

const clickAroundCells = (square, x, y) => {
    let i = x
    let j = y
    // left
    clickThisCell(square, i, j - 1)
    // right
    clickThisCell(square, i, j + 1)
    // up
    clickThisCell(square, i - 1, j)
    // down
    clickThisCell(square, i + 1, j)
}

const clickThisCellRules = (square, x, y) => {
    // 是否在 square 里面
    let row = square.length
    let col = square[0].length
    let rule_row = x >= 0 && x < row
    let rule_col = y >= 0 && y < col
    let has_in_square = rule_row && rule_col
    let c = `${x}-${y}`
    let not_clicked = !clickeds.includes(c)

    return has_in_square && not_clicked
}

const clickThisCell = (square, x, y) => {
    if (clickThisCellRules(square, x, y)) {
        let n = square[x][y]
        let c = `${x}-${y}`
        // 先显示
        clickeds.push(c)
        if (legalNums[0] === n) {
            // 更新数据
            window.currentColors[x][y] = legalNums[1]
            clickAroundCells(square, x, y)
        }
    }
}

// 之前颜色区域　＋　之后融合的颜色区域
let legalNums
let clickeds = []

const handleColor = (index) => {
    let square = JSON.parse(JSON.stringify(window.currentColors))
    let start = window.currentColors[0][0]
    // 合法数字
    legalNums = [start, index]

    // 相当于点击　坐标为【x, y】元素，然后用展开雷的算法
    let [x, y] = [0, 0]
    if (start != index) {
        log('可以扩展周围的')
        // 点击周围的 空白方块
        window.currentColors[x][y] = legalNums[1]
        clickAroundCells(square, x, y)
    }
    clickeds = []
    legalNums = []
}

// window.currentColors

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

const isWin = () => {
    let n = currentColors[0][0]
    for (let i = 0; i < currentColors.length; i++) {
        let line = currentColors[i]
        for (let j = 0; j < line.length; j++) {
            if (n != currentColors[i][j]) {
                return false
            }
        }
    }
    return true
}

const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
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