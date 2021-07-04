/*

第一步：

- 扫雷
算法：
1. 标记雷算法 完成

ui:
1. 画一个正方形 完成
2. 画一排正方形  完成
3. 画 n * n 正方形 完成

完成此项目：
1. 数据初始化：完成
2. 绑定事件： 点击事件 完成


第二步：
用户自定义地图（输入 n * n, 然后确定雷的数量）

第三步：
用户点击标记雷
1. 最多可以标记10次
2. 左键是点击 展开，右键是标记 mark
定时器功能：完成
1.格式化时间函数
2. 显示在页面中

游戏结束功能 完成
1. won
2. lost

第四步：
1. 用户第一次点击不为雷
第一步:
那么重新   直接赋值，对应位置为零
第二步:
渲染数据， 对应位置默认被点击

第三步: 解决对应位置， 周围一大片
周围一大片不为0
 
*/
/**
 * 
 * @param {行数} row 
 * @param {列数} col 
 * @param {雷的数量 } mineNumber  它要求要小于 row * col
 */
const userDefinedMap = (row, col, mineNumber) => {
    let r = []
    // 初始化
    let all_cell = row * col
    for (let i = 0; i < all_cell - mineNumber; i++) {
        r.push(0)
    }
    for (let i = 0; i < mineNumber; i++) {
        r.push(9)
    }
    // 洗牌算法
    r = shuffle(r)
    // 转换成二维数组
    let square = []
    for (let i = 0; i < row; i++) {
        let line = []
        for (let j = 0; j < col; j++) {
            let index = i * col + j
            let v = r[index]
            line.push(v)
        }
        square.push(line)
    }
    // 标记算法
    square = markedSquare(square)
    // log('square', square)
    return square
}
window.game_over = false
// 用户自定义的行和列
window.definedRow = 18
window.definedCol = 18

// 标记的次数
window.markedTime = 0
// 雷的数量
window.mineNumber = 24


window.times = 0

// 开始游戏默认的
window.square = userDefinedMap(definedRow, definedCol, mineNumber)
// 一行
/**
 * 
 * @param {* 一行的数据} line
 * @param {* 第几行} x
 */
const templateRow = (line, x) => {
    let t = ``
    for (let i = 0; i < line.length; i++) {
        let n = line[i]
        let v = n
        if (n == 9) {
            v = ''
        }
        if (n == 0) {
            v = ''
        }
        let classNameMapper = [
            '',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'nine',
        ]
        
        t += `<div class="cell ${classNameMapper[n]} cell-${x}-${i} magician-gray" data-number="${n}" data-x="${x}" data-y="${i}"><span>${v}</span></div>`
    }
    let html = `<div class="row clearfix ">${t}</div>`
    return html
}

// 所有行
const templateRows = (square) => {
    let t = ''
    for (let i = 0; i < square.length; i++) {
        t += templateRow(square[i], i)
    }
    return t
}

const renderSquare = (square) => {
    // 所有的行
    let html = templateRows(square)
    appendHtml(e('.magician-container'), html)
}

const initTime = () => {
    clearTimeout(window.timeId)
    window.total_time = 0
    window.timeId = setInterval(() => {
        window.total_time += 1
        let time = formatTime(window.total_time)
        e('.magician-timer').innerHTML = time
    }, 1000)
}

const init = () => {
    window.times = 0
    // 先清空数据
    window.game_over = false
    window.markedTime = 0
    e('.magician-container').innerHTML = ''
    if (e('.result').classList.contains('lost')) {
        e('.result').classList.remove('lost')
    }
    if (e('.result').classList.contains('won')) {
        e('.result').classList.remove('won')
    }

    // 数据
    let data = window.square
    renderSquare(data)
    initTime()
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

    // 四个顶点
    clickThisCell(square, i - 1, j - 1)
    // right
    clickThisCell(square, i + 1, j + 1)
    // up
    clickThisCell(square, i - 1, j + 1)
    // down
    clickThisCell(square, i + 1, j - 1)
}

// 点击周围 这个方块的条件
const clickThisCellRules = (square, x, y) => {
    // 是否在 square 里面
    let row = square.length
    let col = square[0].length
    let rule_row = x >= 0 && x < row
    let rule_col = y >= 0 && y < col
    let has_in_square = rule_row && rule_col
    if (!has_in_square) {
        return false
    }
    // 是否被点击
    let sel = `.cell-${x}-${y}`
    let not_clicked = !(e(sel).classList.contains('clicked'))
    // 是否是雷
    let not_mine = square[x][y] != 9

    return has_in_square && not_clicked && not_mine
}

const clickThisCell = (square, x, y) => {
    if (clickThisCellRules(square, x, y)) {
        // 先显示
        let sel = `.cell-${x}-${y}`
        let cell = e(sel)
        cell.classList.remove('magician-gray')
        cell.classList.add('magician-white')
        cell.classList.add('clicked')
        // 如果是空白，点击周围所有的雷
        if (square[x][y] === 0) {
            clickAroundCells(square, x, y)
        }
    }
}

const actionClickCell = (cell, square) => {
    let x = int(cell.dataset.x)
    let y = int(cell.dataset.y)
    // 如果是第一次点击
    if (window.times === 0 && square[x][y] !== 0) { 
        log('第一次　点击')
        let new_data = JSON.parse(JSON.stringify(firstClickCellData(x, y)))
        window.square = new_data
        // 更新　square
        square = new_data
        init()
        window.times = 1
    } 
    cell = e(`.cell-${x}-${y}`)
    window.times += 1
    cell.classList.remove('magician-gray')
    cell.classList.add('magician-white')
    cell.classList.add('clicked')
    let n = square[x][y]
    if (n === 9) {
        gameOver(square)
    }
    if (n == 0) {
        // 点击周围的 空白方块
        clickAroundCells(square, x, y)
    }
}

const firstClickCellData = (x, y) => {
    let data = userDefinedMap(definedRow, definedCol, mineNumber)
    let n = data[x][y]
    if (n === 0) {
        return data
    } else {
        return firstClickCellData(x, y)
    }
}

const toggleMarkedCell = (cell) => {
    // 如果被标记，那么显示 红旗
    let cells = es('.cell')
    for (let c of cells) {
        if (c.classList.contains('marked')) {
            log('显示红旗')
            c.innerText = ''
            continue
        }
        let n = Number(c.dataset.number)
        if (n == 9) {
            n = ''
        }
        if (n == 0) {
            n = ''
        }
        c.innerText = n
    }
    // 更新标记才次数
    window.markedTime = es('.marked').length
    e('.magician-marked-time').innerHTML = `${markedTime} / ${window.mineNumber}`
}

const bindClickCell = () => {
    // 点击方块
    bindEvent(e('.magician-container'), 'mousedown', (event) => {
        let cell = event.target
        //禁用右键菜单
        cell.oncontextmenu = (event) => {
            return false
        }
        let btnNum = event.button
        if (cell.classList.contains('cell') && !cell.classList.contains('clicked')) {
            if (btnNum == 2) {
                if (markedTime === window.mineNumber) {
                    return
                }
                toggle(cell, 'marked')
                toggleMarkedCell(cell)
            }
            if (btnNum == 0) {
                if (cell.classList.contains('marked')) {
                    return
                }
                let data = JSON.parse(JSON.stringify(square))
                actionClickCell(cell, data)
            }
            gameWon(window.square)
        }
    })
}

// 用户可以选择不同模式，进行游戏体验
const selectGameBy = modeType => {
    let modeMpaer = {
        'small': {
            row: 8,
            col: 8,
            mine: 1,
        },
        'mid': {
            row: 10,
            col: 10,
            mine: 10,
        },
        'large': {
            row: 16,
            col: 16,
            mine: 30,
        },
    }
    let {row, col, mine} = modeMpaer[modeType]
    window.definedRow = row
    window.definedCol = col
    window.mineNumber = mine
    window.square = userDefinedMap(definedRow, definedCol, mineNumber)
    init()
}

const bindClickMode = () => {
    bindEvent(e('.selector'), 'click', (event) => {
        let li = event.target
        if (li.classList.contains('magician-mode')) {
            let modeType = li.dataset.mode
            selectGameBy(modeType)
        }
    })
}

// 所有方块都展示出来
const showAllCell = square => {
    for (let i = 0; i < square.length; i++) {
        for (let j = 0; j < square[i].length; j++) {
            let sel = `.cell-${i}-${j}`
            let cell = e(sel)
            if (Number(cell.dataset.number) === 9) {
                cell.classList.add('pikachu')
            }
            if (cell.classList.contains('clicked')) {
                continue
            }
            if (cell.classList.contains('magician-gray')) {
                cell.classList.remove('magician-gray')
                cell.classList.add('magician-white')
                cell.classList.add('clicked')
            }
            if (cell.classList.contains('marked')) {
                cell.classList.remove('magician-gray')
                cell.classList.add('magician-white')
                cell.classList.add('clicked')
            }
            
        }
    }
}

const gameOver = (square) => {
    window.game_over = true
    modal('Pokemon Game over. ', () => {
        log('over')
        showAllCell(square)
        e('.result').classList.add('lost')
        clearTimeout(window.timeId)
        window.game_over = false
    })
}

const gameWon = (square) => {
    let marked_time = window.markedTime
    let clicked_time = es('.clicked').length
    let row = square.length
    let col = square[0].length
    let mine_number = row * col
    log('clicked_time', clicked_time)
    log('marked_time + clicked_time', marked_time + clicked_time)
    let is_won = marked_time + clicked_time === mine_number && marked_time > 0
    log('is_won', is_won)
    if (is_won && !game_over) {
        modal('You received a Pikachu', () => {
            log('胜利')
            showAllCell(square)
            e('.result').classList.add('won')
            clearTimeout(window.timeId)
            window.game_over = true
        })
    }
}

const bindEvents = () => {
    bindClickCell()
    bindClickMode()
}

const __main = () => {
    init()
    bindEvents()
}

__main()