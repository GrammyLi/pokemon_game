const clearCanvas = () => {
    let canvas = e("canvas")
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, 450, 450)
}

const drawImage = (index, value) => {
    let v = value
    if (v == 0) {
        return
    }
    let j = index % 3  // col
    let i = Math.floor(index / 3) // row
    let f = 150
    let x = i * f
    let y = j * f
    let src = `./${type_dir}/puzz${v}.jpg`
    let image = imageFormPath(src)
    loadImage(image, x, y)
}

const loadImage = (image, x, y) => {
    let canvas = e("canvas")
    let context = canvas.getContext("2d")
    context.drawImage(image, x, y)
    image.onload = function() {
        // log('image', image)
        // log('x', x, 'y', y)
        context.drawImage(image, x, y, 150, 150)
    }
}

const renderImages = (data) => {
    for (let i = 0; i < len(data); i++) {
        let v = data[i]
        drawImage(i, v)
    }
}

const initData = () => {
    let data = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    data = shuffle(data)
    return data
}

const initOriginalImages = () => {
    // 修改 title
    e('.davizi-imgs').innerHTML = ''
    let d = window.type_dir
    let title = `Magician-${d}-Puzzle`
    e('.gua-game-title').innerHTML = title
    let t = `
    <div style="margin:auto">
        <img src="./${d}/puzz1.jpg" id="puzz1" width="150" height="150">
        <img src="./${d}/puzz2.jpg" id="puzz2" width="150" height="150">
        <img src="./${d}/puzz3.jpg" id="puzz3" width="150" height="150">
    </div>
    <div>
        <img src="./${d}/puzz4.jpg" id="puzz4" width="150" height="150">
        <img src="./${d}/puzz5.jpg" id="puzz5" width="150" height="150">
        <img src="./${d}/puzz6.jpg" id="puzz6" width="150" height="150">
    </div>
    <img src="./${d}/puzz7.jpg" id="puzz7" width="150" height="150">
    <img src="./${d}/puzz8.jpg" id="puzz8" width="150" height="150">
    <img src="./${d}/puzz9.jpg" id="puzz9" width="150" height="150">
    `
    e('.davizi-imgs').insertAdjacentHTML('beforeend', t)
}

const init = () => {
    clearCanvas()
    window.data = initData()
    renderImages(data)

    initOriginalImages()
}

const reRenderImages = () => {
    clearCanvas()
    renderImages(window.data)
}

const validKeys = (key) => {
    let keys = ['a', 'd', 'w', 's']
    return keys.includes((key))
}

const blankIndex = () => {
    for (let i = 0; i < len(window.data); i++) {
        let v = window.data[i]
        if (v === 0) {
            return i
        }
    }
}

const validIndex = (index) => {
    return index >= 0 && index < len(window.data)
}

const imageMove = (distance) => {
    let i = blankIndex()
    let new_index = i + distance
    if (validIndex(new_index)) {
        changeImage(i, new_index)
        cutMusic()
    } else {
        noMusic()
    }
}

const changeImage = (index, new_index) => {
    let v2 = window.data[new_index]
    window.data[new_index] = 0
    window.data[index] = v2

    reRenderImages()
}

const bindEventKeyboard = () => {
    bindEvent(window, 'keydown', function(event) {
        // log('keydown', event)
        let k = event.key
        let keyMappers = {
            'a': +3,
            'd': -3,
            'w': +1,
            's': -1,
        }

        if (validKeys(k)) {
            let d = keyMappers[k]
            imageMove(d)
        }
        winGame()
        updateTimes()
    })
}

const changeClickImage = (i, j) => {
    let new_i = i * 3 + j

    let b = blankIndex()
    let adjacent_indexs = [b - 1, b + 1, b + 3, b - 3]

    let rule_adjacent = adjacent_indexs.includes(new_i)
    let rule_border = validIndex(new_i)

    if (rule_adjacent && rule_border) {
        changeImage(b, new_i)
        cutMusic()
        // playBg()
    } else {
        noMusic()
    }
}

const bindEventClick = () => {
    bindEvent(e('canvas'), 'click', event => {
        let target = event.target
        // 得到坐标
        let rect = target.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top
        let space = 0
        let debug_length = 150
        let pixelWidth = debug_length + space
        let i = Math.floor(x / pixelWidth)
        let j = Math.floor(y / pixelWidth)
        // i row
        // j colums
        log('i', i, 'j', j)
        changeClickImage(i, j)
        winGame()
        updateTimes()
    })
}

const winGame = () => {
    let a = [1, 2, 3, 4, 5, 7, 8, 0]
    if (JSON.stringify(a) === JSON.stringify(window.data)) {
        log('恭喜 win game')
    }
}

const bindEventSelect = () => {
    bindEvent(e('select'), 'change', event => {
        let v = event.target.value
        log('value', v)
        if (v === type_dir) {
            return
        }
        window.type_dir = v
        window.times = 0
        e('.gua-times').innerHTML = window.times
        init()
    })
}

const bindEvents = () => {
    bindEventKeyboard()
    bindEventClick()
    bindEventSelect()
}

const updateTimes = () => {
    window.times += 1
    e('.gua-times').innerHTML = window.times
}

const __main = () => {
    window.type_dir = 'Dunk'
    window.times = 0
    init()
    bindEvents()
}

__main()
/*
- 第一步初始化数据
    - render data

- 第二步 绑定事件
    - 键盘
        - up
        - down
        - left
        - right
    - 点击

- up  键盘
    - 空白元素（-1） 下面的元素向上移动 改变数据
        - 判断空白元素下面是否有元素
            - 有   移动  改变数据 清空画布，重新画

            - 没有  playNoMusic() 不移动 不改变数据

- up  鼠标点击 图片
    - 边界检测，是否为空白元素旁边周围元素
        - 是
             - 同上
        - 不是
            - playNoMusic() 不移动 不改变数据

- 改变数据
    - 空白元素和此元素 值进行交换

- data
    - 洗牌算法

- win game
    - 判断

- 记录移动次数

 */