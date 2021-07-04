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


/*
第一步：
1. 生成 10 * 10 简单数据  完成

第二步：
1. 数据渲染  完成

第三步：
1. 点击事件
    判断此 pokemon 是否
 */

const createPokemons = (row = 10, col = 10) => {
    let ps = []
    for (let i = 0; i < row; i++) {
        let list = []
        for (let j = 0; j < col; j++) {
            let n = Math.floor(Math.random() * 6) + 1
            list.push(n)
        }
        ps.push(list)
    }
    return ps
}

/**
 * 
 * @param {*一行的数据} line 
 * @param {*第几行} x
 */
const templateLine = (line, x) => {
    let center = ''
    for (let index = 0; index < line.length; index++) {
        let n = line[index]
        let y = index
        let pokemon_class = ''
        // 没有宝可梦的情况
        if (n == 0) {
            pokemon_class = ''
        } else {
            // 含有宝可梦情况
            pokemon_class = `clickable p${n}`
        }

        center += `<td class="cell ${pokemon_class}" id="id-cell-${x}-${y}" ></td>`
    }
    t = ` <tbody>
            <tr id="id-row-${x}">
                ${center}
            </tr>
          </tbody>
    `
    return t
}


const renderPokemons = (pokemons) => {
    let t = ''
    for (let i = 0; i < pokemons.length; i++) {
        let line = pokemons[i]
        t += templateLine(line, i)
    }
    e('#id-table-field').insertAdjacentHTML('beforeend', t)
}

// 点击周围 这个方块的条件
const clickThisCellRules = (pokemons, x, y, v) => {
    // log('x, y', x, y, 'v', v)
    // 是否在 pokemons 里面
    let row = pokemons.length
    let col = pokemons[0].length
    let rule_row = x >= 0 && x < row
    let rule_col = y >= 0 && y < col
    // log('rule_col', rule_row, 'rule_col', rule_col)
    let has_in_pokemons = rule_row && rule_col
    if (!has_in_pokemons) {
        log('超出边界')
        return false
    }
    // 没有被标记 highlighted
    let sel = `#id-cell-${x}-${y}`
    let not_marked = !(e(sel).classList.contains('highlighted'))
    // log('not_marked', not_marked)
    // 不是空的
    let not_blank = pokemons[x][y] != 0
    // log('not_blank', not_blank)
    // 值也相同
    let common_value = pokemons[x][y] === v
    // log('common_value', common_value)

    return has_in_pokemons && not_marked && not_blank && common_value
}

const clickThisCell = (pokemons, x, y, v) => {
    if (clickThisCellRules(pokemons, x, y, v)) {
        // log('要添加 hightlighted', x, y, v)
        // 标记自己
        selectPokemon(pokemons, x, y)
    }
}

const clickAround = (pokemons, x, y, v) => {
    let i = x
    let j = y
    // left
    clickThisCell(pokemons, i, j - 1, v)
    // right
    clickThisCell(pokemons, i, j + 1, v)
    // up
    clickThisCell(pokemons, i - 1, j, v)
    // down
    clickThisCell(pokemons, i + 1, j, v)
}

const selectPokemon = (pokemons, x, y) => {
    let sel = `#id-cell-${x}-${y}`
    e(sel).classList.remove('clickable')
    e(sel).classList.add('highlighted')
    let v = pokemons[x][y]

    clickAround(pokemons, x, y, v)
}

const removeAllHighlighted = () => {
    let hts = es('.highlighted')
    for (let h of hts) {
        h.classList.remove('highlighted')
    }
}

/*
[
    [2, 1, 4, 0],
    [2, 1, 4, 0],
    [2, 0, 4, 0],
    [2, 1, 4, 0],
]

[
    [2, 0, 4, 0],
    [2, 1, 4, 0],
    [2, 1, 4, 0],
    [2, 1, 4, 0],
]
*/
const is_block = (x, y) => {
     // 是否在 pokemons 里面
     let row = pokemons.length
     let col = pokemons[0].length
     let rule_row = x >= 0 && x < row
     let rule_col = y >= 0 && y < col
     // log('rule_col', rule_row, 'rule_col', rule_col)
     let has_in_pokemons = rule_row && rule_col
     return has_in_pokemons
}
// 垂直
 
const listenPokemonsY = () => {
    for (let i = 0; i < pokemons.length; i++) {
        let row = pokemons[i]
        for (let j = 0; j < row.length; j++) {
            let number = pokemons[i][j]
            if (is_block(i - 1, j)) {
                if (pokemons[i][j] == 0) {
                    pokemons[i][j] = pokemons[i - 1][j]
                    pokemons[i - 1][j] = 0
                }
            }
             
        }
    }
}

// 水平
const is_colums_all_zeros = (arr) => {
    for (let a of arr) {
        if (a != 0) {
            return false
        }
    }
    return true
}

const index_colums_zeros = () => {
    let l = pokemons[0].length
    let index_colums = []
    for (let m = 0; m < l; m++) {
        let arr = []
        for (let i = 0; i < pokemons.length; i++) {
            let row = pokemons[i]
            arr.push(row[m])
        }
        if (is_colums_all_zeros(arr)) {
            index_colums.push(m)
        }
    }
    
    return index_colums
}
 
const listenPokemonsX = () => {
    let colums = index_colums_zeros()
    for (let j of colums) {
        for (let i = 0; i < pokemons.length; i++) {
            if (is_block(i, j + 1)) {
                pokemons[i][j] = pokemons[i][j + 1]
                pokemons[i][j + 1] = 0
            }
        }
    }
}
 
const pokemonsGravity = () => {
     // 垂直 部分 zeros
     for (let i = 0; i < pokemons.length; i++) {
        listenPokemonsY()
    }
    // 水平 所有的 zeros
    for (let i = 0; i < pokemons[0].length; i++) {
        listenPokemonsX()
    }
}

const init = () => {
    e('#id-table-field').innerHTML = ''
    pokemonsGravity()
    renderPokemons(pokemons)
}

const bindEventPokemons = () => {
    bindEvent(e('#id-table-field'), 'click', event => {
        let target = event.target
        // log('target', target)
        // 如果classList 只含有 cell, 说明没有宝可梦
        if (target.classList.length === 1 || target.classList.contains('pop')) {
            return
        }
        
        let arr = target.id.split('-')
        // 第几行
        let x = Number(arr[2])
        // 第几列
        let y = Number(arr[3])
         
        if (target.classList.contains('highlighted')) {
            // 删除数据 (删除 p1 highlighted 添加 pop)
            let hts = es('.highlighted')
            // 只有一个pokemon时
            if (hts.length === 1) {
                 hts[0].classList.remove('highlighted')
                 hts[0].classList.add('clickable')
                 return
            }
            // 多个相同的宝可梦
            for (let h of hts) {
                let arr = h.id.split('-')
                // 第几行
                let x = Number(arr[2])
                // 第几列
                let y = Number(arr[3])
                h.classList.remove('highlighted')
                let v = pokemons[x][y]
                let p = `p${v}`
                h.classList.remove(p)
                h.classList.add('pop')
            }

            // 清空数据，初始化
            setTimeout(function() {
                let ps= es('.pop')
                for (let h of ps) {
                    let arr = h.id.split('-')
                    // 第几行
                    let x = Number(arr[2])
                    // 第几列
                    let y = Number(arr[3])
                    h.classList.remove('pop')
                    pokemons[x][y] = 0
                }
                init()
            }, 500)
        } else {
            // 提前清空所有的 highlighted
            removeAllHighlighted()

            selectPokemon(pokemons, x, y)
        }
    })
}

const bindEvents = () => {
    bindEventPokemons()
}

const __main = () => {
    // let data = [
    //     [3, 5, 2, 4, 4, 2, 2, 1, 3, 5],
    //     [4, 4, 2, 3, 2, 5, 5, 2, 3, 1],
    //     [5, 5, 2, 5, 4, 5, 5, 3, 5, 3],
    //     [4, 3, 1, 1, 5, 1, 3, 3, 2, 3],
    //     [2, 3, 1, 5, 3, 5, 1, 1, 4, 5],
    //     [2, 2, 2, 3, 3, 3, 5, 5, 2, 4],
    //     [3, 5, 5, 5, 1, 3, 4, 2, 2, 4],
    //     [1, 2, 3, 2, 1, 3, 1, 4, 4, 3],
    //     [1, 3, 5, 2, 4, 1, 5, 3, 2, 2],
    //     [1, 2, 2, 5, 4, 5, 4, 2, 5, 5],
    // ]
    // 创建数据
    window.pokemons = createPokemons()
    init()
    bindEvents()
}

__main()