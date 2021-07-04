/*
- data    
- render data => map  
- event  
    - click
        - 点击翻转

- 算法   
    - 点击两次 对比是否 数字相等  
        - 相等  翻转成功  
        - 不相等 翻转失败 还原

- 数据打乱

- 先情况 container内容，再去初始化页面 然后再去绑定事件
*/


/*
 1. 点击开始游戏
 2. 点击退出游戏
 3. 解决翻转问题
*/

// 清空游戏的内容：更新图片数据、定时器清零、尝试次数和匹配次数置零
const clearGameContent = () => {
    // 宝可梦清空
    e('.cardArea').innerHTML = ''
    // Todo 定时器清零 
    // 尝试次数和匹配次数置零
    e('.magician-attempts').innerText = 0
    e('.magician-matches').innerText = 0
}

const templatePokemon = (picturesIndex, index) => {
    const pictures = [
        "pichu.png",
        "cleffa.png",
        "azuril.png",
        "igglybuff.png",
        "munchlax.png",
        "teddiursa.png",
        "togepi.png",
        "wynaut.png",
        "happiny.png",
        "pichu.png",
        "cleffa.png",
        "azuril.png",
        "igglybuff.png",
        "munchlax.png",
        "teddiursa.png",
        "togepi.png",
        "wynaut.png",
        "happiny.png"
    ]
    let url = `./img/${pictures[picturesIndex]}`
    let t = `
    <div class="cardContainer" data-index=${index} data-picturesIndex=${picturesIndex}>
        <div class="card">
            <div class="cardFront  cardFront-${index}">
                <img class="cardFront" src=${url}>
            </div>

            <div class="cardBack cardBack-${index}">
                <img class="card-logo" src="./img/daycare.jpg">
            </div>
        </div>
    </div>
    `
    return t
}

const renderPokemons = pokemons => {
    let container = e('.cardArea')
    let t = ''
    for (let i = 0; i < pokemons.length; i++) {
        let p = pokemons[i]
        t += templatePokemon(p, i)
    }
    appendHtml(container, t)
}

const init = () => {
    clearGameContent()
    // 选取九组数据
    window.pokemons = [
        0, 0,
        1, 1,
        2, 2,
        3, 3,
        4, 4,
        5, 5,
        6, 6,
        7, 7,
        8, 8,
    ]

    renderPokemons(pokemons)
}

// 点击开始游戏
const bindStartGame = () => {
    bindAll(es('.magician-start-game'), 'click', event => {
        let hide = 'hidden'
        let game = e('.game')
        if (game.classList.contains(hide)) {
            game.classList.remove(hide)
            e('.start').classList.add(hide)
        }
        init()
    })
}

// 点击退出游戏
const bindBackGame = () => {
    bindEvent(e('.magician-back-game'), 'click', event => {
        let hide = 'hidden'
        let game = e('.game')
        game.classList.add(hide)
        e('.start').classList.remove(hide)
    })
}

const actionClickCard = card => {
    let cardBack = card.querySelector('.cardBack')
    // 如果此牌被点击，那么点击无效
    if (cardBack.classList.contains('hidden')) {
        return
    }
    // 点击有效
    window.clickTime += 1
    let cardFront = card.querySelector('.cardFront')
    if (window.clickTime == 1) {
        cardFront.classList.remove('hidden')
        cardBack.classList.add('hidden')
        
        // 添加 flip
        // 记录，第一次点击的位置
        window.firstPosition = Number(card.dataset.index)
    }
    if (window.clickTime == 2) {
        cardFront.classList.remove('hidden')
        cardBack.classList.add('hidden')

        // 第二次点击的位置
        secondPosition = Number(card.dataset.index)
        if (pokemons[firstPosition] !== pokemons[secondPosition]) {
            setTimeout(() => {
                let className = 'hidden'
                let selFirstFont = `.cardFront-${firstPosition}`
                let selFirstBack = `.cardBack-${firstPosition}`
                e(selFirstFont).classList.add(className)
                e(selFirstBack).classList.remove(className)

                let selSecondFont = `.cardFront-${secondPosition}`
                let selSecondBack = `.cardBack-${secondPosition}`
                e(selSecondFont).classList.add(className)
                e(selSecondBack).classList.remove(className)
                window.firstPosition = -1
                window.clickTime = 0
            }, 1000)
        } else {
            window.firstPosition = -1
            window.clickTime = 0
        }
    }
}

const bindClickCards = () => {
    bindEvent(e('.cardArea'), 'click', event => {
        let target = event.target
        let card = target.closest('.cardContainer')
        actionClickCard(card)
    })
}

const bindEvents = () => {
    bindStartGame()
    bindBackGame()
    bindClickCards()
}

const __main = () => {
    // 点击的次数
    window.clickTime = 0
    window.firstPosition = -1

    bindEvents()
}

__main()