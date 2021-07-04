// 单独一行页面数据
const templateRow = (line, x) => {
    let t = ``
    for (let i = 0; i < line.length; i++) {
        let y = i
        // n 为主题颜色的索引
        let n = line[i]
        let color = window.schemeColors[n]
        t += ` <td class="padding-none color-${x}-${y}" data-x=${x} data-y=${y} style="background-image: url(images/${color}.png);"></td>`
    }
    let html = ` <tr> ${t} </tr>`
    return html
}

// 所有行
const templateRows = (colors) => {
    let t = ''
    for (let i = 0; i < colors.length; i++) {
        t += templateRow(colors[i], i)
    }
    return t
}

const templateschemeColors = () => {
    let colors = window.schemeColors.slice(0, window.schemeColorsNum)
    let t = ''
    for (let i = 0; i < colors.length; i++) {
        let color = colors[i]
        t += `<button class="btn" data-index="${i}" style="background-image: url(images/${color}.png);"></button>`
    }
    return t
}

// 地图数据渲染　和　主题颜色数据渲染
const renderColors = (colors) => {
    // 清空页面容器数据
    e('#board').innerHTML = ''
    //更新页面数据
    e('#board').insertAdjacentHTML('beforeend', templateRows(colors))

    e('#controls').innerHTML = ''
    e('#controls').insertAdjacentHTML('beforeend', templateschemeColors())
}

const initTime = () => {
    clearTimeout(window.timeId)
    window.total_time = 0
    window.timeId = setInterval(() => {
        window.total_time += 1
        let time = formatTime(window.total_time)
        e('#counter').innerHTML = time
    }, 1000)
}

const init = () => {
    initTime()
    // 通过配置的数据（那个主题、地图的宽高） 生成颜色数据
    let cs = userDefinedMap(row, col, schemeColorsNum)
    //　渲染数据
    log('cs', cs)
    window.currentColors = JSON.parse(JSON.stringify(cs))
    renderColors(cs)
}

const bindEventNav = () => {
    // 菜单配置开关
    e('#options-btn').addEventListener('click', (event) => {
        let menu = e('#options-menu')
        let cls = 'show'
        if (menu.classList.contains(cls)) {
            menu.classList.remove(cls)
        } else {
            menu.classList.add(cls)
        }
    })
    
    e('#new-game-btn').addEventListener('click', (event) => {
        init()
    })
}
 
const bindEventOption = () => {
    bindAll(es('.grammy-options'), 'change', event => {
        let option = event.target
        let type = option.dataset.type
        let v = option.value
        // 主题
        if (type === 'scheme') {
            defineSchemeColors(v)
        }
        // 颜色数量
        if (type === 'number') {
            let nums = {
                0: 3,
                1: 4,
                2: 5,
            }
            window.schemeColorsNum = nums[v]
        }
        // 设置row col
        if (type === 'size') {
            let size = {
                0: 5,
                1: 10,
                2: 15,
                3: 20,
            }
            window.row = window.col = size[v]
        }
        init()
        // log('type', type, 'v', v)
    })
}

const bindEventControls = () => {
    e('#controls').addEventListener('click', (event) => {
        let btn = event.target
        let index = Number(btn.dataset.index)
        // log('开始', currentColors)
        handleColor(index)
        // log('indx', index, '之后currentColors', currentColors)
        renderColors(window.currentColors)
        win()
    })
}

const bindEvents = () => {
    log('开始事件')
    // 选择颜色
    bindEventControls()
    // 开始游戏和打开配置菜单栏
    bindEventNav()
    // 选择配置数据
    bindEventOption()
}

const defineSchemeColors = (index = 0) => {
    // 选择主题　默认选择第一个
    const colorScheme = [
        [1, 2, 3,4, 5],
        [6, 7, 8, 9, 10],
        [1, 5, 10, 8, 5],
        [11, 12, 8, 9, 10],
    ]
    // 主题的颜色
    window.schemeColors = colorScheme[index]
}

const win = () => {
    if (isWin()) {
        modal('Good ', () => {
            clearTimeout(window.timeId)
        })
        
    }
}

const __main = () => {
    window.schemeColors = []
    // 地图数据
    window.currentColors = []
    defineSchemeColors()
    window.row = 5
    window.col = 5
    window.schemeColorsNum = 5

    init()
    bindEvents()
}

__main()

