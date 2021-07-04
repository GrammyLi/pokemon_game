// 定义我们的 log 函数
const log = console.log.bind(console)
// 自定义的选择器函数
const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}
const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}
const appendHtml = function(element, html) {
    element.insertAdjacentHTML("beforeend", html)
}
const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}
const bindEventDelegate = function(element, eventName, callback, responseClass) {
    element.addEventListener(eventName, function(event) {
        let target = event.target
        if (target.classList.contains(responseClass)) {
            callback()
        }
    })
}
const appendAll = function(selector, html) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        log('*** invalid selector, no element is selected')
    } else {
        for (let i = 0; i < elements.length; i++) {
            appendHtml(elements[i], html)
        }
    }
}
const bindAll = function(selector, eventName, callback, responseClass) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        log('*** invalid selector, no element is selected')
    } else {
        if (responseClass === undefined) {
            for (let i = 0; i < elements.length; i++) {
                bindEvent(elements[i], eventName, callback)
            }
        } else {
            for (let i = 0; i < elements.length; i++) {
                bindEventDelegate(elements[i], eventName, callback, responseClass)
            }
        }
    }
}

const randomStar = function(grid, x, y) {
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            grid[i][j] = Math.floor(Math.random() * 5) + 1
        }
    }
    return grid
}

const createField = function(x, y) {
    let table = e('table')
    let grid = []
    for (let i = 0; i < y; i++) {
        appendHtml(table, `<tr id="id-row-${i}"></tr>`)
        let row = e(`#id-row-${i}`)
        grid.push([])
        for (let j = 0; j < x; j++) {
            appendHtml(row, `<td class="cell" id="id-cell-${j}-${i}"></td>`)
            grid[i].push(0)
        }
    }
    randomStar(grid, x, y)
    return grid
}

const gravity = function(array) {
    let result = []
    let zeros = 0
    for (let i = 0; i < array.length; i++) {
        let s = array[i]
        if (s === 0) {
            zeros += 1
        } else {
            result.push(s)
        }
    }
    for (let i = 0; i < zeros; i++) {
        result.push(0)
    }
    return result
}
const arrayAllZero = function(array) {
    let n = array.length
    for (let i = 0; i < n; i++) {
        if (array[i] !== 0) {
            return false
        }
    }
    return true
}
const compactGrid = function(grid) {
    let max_x = grid.length
    let max_y = grid[0].length
    let result = []
    let zeros = 0
    let blankArray = []
    for (let y = 0; y < max_y; y++) {
        blankArray.push(0)
    }
    for (let x = 0; x < max_x; x++) {
        let s = grid[x]
        if (arrayAllZero(s)) {
            zeros += 1
        } else {
            result.push(s)
        }
    }
    for (let i = 0; i < zeros; i++) {
        result.push(blankArray)
    }
    for (let x = 0; x < max_x; x++) {
        result[x] = gravity(result[x])
    }
    return result
}
const refresh = function(grid) {
    let max_x = grid.length
    let max_y = grid[0].length
    for (let x = 0; x < max_x; x++) {
        for (let y = 0; y < max_y; y++) {
            let cell = e(`#id-cell-${x}-${y}`)
            let gridcell = grid[x][max_y - 1 - y]
            if (gridcell === 1) {
                cell.classList.add('clickable', 'p1')
                cell.classList.remove('p2', 'p3', 'p4', 'p5', 'pop', 'highlighted')
            }
            if (gridcell === 2) {
                cell.classList.add('clickable', 'p2')
                cell.classList.remove('p1', 'p3', 'p4', 'p5', 'pop', 'highlighted')
            }
            if (gridcell === 3) {
                cell.classList.add('clickable', 'p3')
                cell.classList.remove('p1', 'p2', 'p4', 'p5', 'pop', 'highlighted')
            }
            if (gridcell === 4) {
                cell.classList.add('clickable', 'p4')
                cell.classList.remove('p1', 'p2', 'p3', 'p5', 'pop', 'highlighted')
            }
            if (gridcell === 5) {
                cell.classList.add('clickable', 'p5')
                cell.classList.remove('p1', 'p2', 'p3', 'p4', 'pop', 'highlighted')
            }
            if (gridcell > 5) {
                cell.classList.add('highlighted')
                cell.classList.remove('clickable')
            }
            if (gridcell === 0) {
                cell.classList.remove('clickable', 'pop', 'p1', 'p2', 'p3', 'p4', 'p5', 'highlighted')
            }
            if (gridcell === 'p') {
                cell.classList.remove('clickable', 'p1', 'p2', 'p3', 'p4', 'p5', 'highlighted')
                cell.classList.add('pop')
            }
        }
    }
}

const ifGameOver = function(grid) {
    let max_x = grid.length
    let max_y = grid[0].length
    for (let x = 0; x < max_x; x++) {
        for (let y = 0; y < max_y; y++) {
            if (!isAlone(grid, x, y)) {
                return false
            }
        }
    }
    log('GAME OVER')
    alert(`GAME OVER`)
    return true
}

const isAlone = function(grid, x, y) {
    let max_x = grid.length
    let max_y = grid[0].length
    let self = grid[x][y]
    // Define: zero is always Alone!
    if (self === 0) {
        return true
    }
    if (x !== 0 && grid[x - 1][y] === self) {
        return false
    }
    if (y !== 0 && grid[x][y - 1] === self) {
        return false
    }
    if (x < max_x - 1 && grid[x + 1][y] === self) {
        return false
    }
    if (y < max_y - 1 && grid[x][y + 1] === self) {
        return false
    }
    return true
}
const popOn = function(grid, x, y, n = 0) {
    let max_x = grid.length
    let max_y = grid[0].length
    let self = grid[x][y]
    if (isAlone(grid, x, y) && n === 0) {
        return
    } else {
        grid[x][y] = 'p'
        if (x !== 0 && grid[x - 1][y] === self) {
            popOn(grid, x - 1, y, n + 1)
        }
        if (y !== 0 && grid[x][y - 1] === self) {
            popOn(grid, x, y - 1, n + 1)
        }
        if (x < max_x - 1 && grid[x + 1][y] === self) {
            popOn(grid, x + 1, y, n + 1)
        }
        if (y < max_y - 1 && grid[x][y + 1] === self) {
            popOn(grid, x, y + 1, n + 1)
        }
    }
}
const clearPop = function(grid) {
    let combotext = e('#combo')
    let max_x = grid.length
    let max_y = grid[0].length
    let score = 0
    let combo = 0
    let multiplier = 5
    for (let x = 0; x < max_x; x++) {
        for (let y = 0; y < max_y; y++) {
            if (grid[x][y] === 'p') {
                grid[x][y] = 0
                combo += 1
                score += multiplier * combo
                log('score +', multiplier * combo)
            }
        }
    }
    combotext.innerHTML = `Combo X ${combo}, Score + ${score}`
    log('combo =', combo)
    return score
}

const lightOn = function(grid, x, y, n = 0) {
    let max_x = grid.length
    let max_y = grid[0].length
    let self = grid[x][y]
    if (isAlone(grid, x, y) && n === 0) {
        return
    } else {
        grid[x][y] += 5
        if (x !== 0 && grid[x - 1][y] === self) {
            lightOn(grid, x - 1, y, n + 1)
        }
        if (y !== 0 && grid[x][y - 1] === self) {
            lightOn(grid, x, y - 1, n + 1)
        }
        if (x < max_x - 1 && grid[x + 1][y] === self) {
            lightOn(grid, x + 1, y, n + 1)
        }
        if (y < max_y - 1 && grid[x][y + 1] === self) {
            lightOn(grid, x, y + 1, n + 1)
        }
    }
}
const lightOff = function(grid) {
    let max_x = grid.length
    let max_y = grid[0].length
    for (let x = 0; x < max_x; x++) {
        for (let y = 0; y < max_y; y++) {
            if (grid[x][y] > 5) {
                grid[x][y] -= 5
            }
        }
    }
}
const showScore = function(grid) {
    let combotext = e('#combo')
    let max_x = grid.length
    let max_y = grid[0].length
    let score = 0
    let combo = 0
    let multiplier = 5
    for (let x = 0; x < max_x; x++) {
        for (let y = 0; y < max_y; y++) {
            if (grid[x][y] > 5) {
                combo += 1
                score += multiplier * combo
            }
        }
    }
    combotext.innerHTML = `Combo X ${combo}, Score + ${score}`
    return score
}

const bindPlay = function() {
    let playButton = e('.gua-button-play')
    bindEvent(playButton, 'click', function() {
        log('play')
        let a = e('#id-audio-music')
        // 添加播放功能
        a.play()
    })
}
const bindPause = function() {
    let playButton = e('.gua-button-pause')
    bindEvent(playButton, 'click', function() {
        log('pause')
        let a = e('#id-audio-music')
        // 添加暂停功能
        a.pause()
    })
}

const __main = function() {
    // 变量定义与初始化
    let score = 0
    let grid = createField(10, 10)
    refresh(grid)
    let table = e('table')
    bindPlay()
    bindPause()
    table.addEventListener('click', function(event) {
        let target = event.target
        let x = Number(target.id.slice(-3, -2))
        let y = grid.length - 1 - Number(target.id.slice(-1))
        if (target.classList.contains('clickable')) {
            lightOff(grid)
            lightOn(grid, x, y, 0)
            showScore(grid)
            refresh(grid)
        } else if (target.classList.contains('highlighted')) {
            popOn(grid, x, y, 0)
            refresh(grid)
            setTimeout(function() {
                score += clearPop(grid)
                let scoretext = e('#id-span-score')
                scoretext.innerHTML = String(score)
                grid = compactGrid(grid)
                refresh(grid)
                ifGameOver(grid)
            }, 500)
        }
    })
}

__main()