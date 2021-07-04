/**
 * 第一步: 生成数据
 * 第二步：渲染数据
 * 第三步：绑定事件
 */
// icon 地址： https://codepen.io/animeshk874/pen/VBggBE
/**
 * 
 * @param {几行　第一行和最后一行填充　０} row 
 * @param {几列　第一列和最后一列填充　０} col 
 * @param {多少种宝可梦} number 
 */
const definePokemons = (row, col, number) => {
    let zeros = createZeroArray(col)
    // 多少只宝可梦
    let pokemons = (row - 2) * (col - 2)
    let ps = []
    for (let i = 0; i < pokemons / 2; i++) {
        let n = randomBetween(1, number)
        ps.push(n)
    }
    // 最后必须成对出现
    ps = [...ps, ...ps]
    let r = []
    //　第一行　默认填充零
    r.push(zeros)
    // 中间部分，一行第一元素和最后元素为零
    for (let i = 0; i < row - 2; i++) {
        let line
        let start = i * (col - 2)
        let end = (i + 1) * (col - 2)
        let middle = ps.slice(start, end)
        line = [0, ...middle, 0]
        r.push(line)
    }
    // 最后一行　默认填充零
    r.push(zeros)
    return r
}

const templateRow = (line, y) => {
    let t = `<tr id="id-row-${y}">`
    for (let i = 0; i < line.length; i++) {
        let x = i
        let n = line[i]
        let cls = n
        if (typeof n === 'number') {
            cls = `c${n}`
        }  
        t += `
        <td class="cell ${cls}" id="id-cell-${x}-${y}" data-x="${x}" data-y="${y}">(${x}, ${y})</td>
        `
    }
    t += '</tr>'
    return t
}

const renderPokemons = (data) => {
    e('#id-table-field').innerHTML = ''
    let t = ''
    for (let i = 0; i < data.length; i++) {
        let line = data[i]
        // 得到一行模版数据
        t += templateRow(line, i)
    }
    appendHtml(e('#id-table-field'), t)
}

const init = () => {
    // 点击次数：其只只能为　０、１、２
    window.times = 0
    window.firstPosition = -1
    let [row, col] = [8, 8]
    let number = 8
    let data = definePokemons(row, col, number)
    window.currentPokemons = JSON.parse(JSON.stringify(data))
    renderPokemons(data)
}

const hasRoute = (position1, position2) => {
    let [x1, y1] = position1
    let [x2, y2] = position2
    let map = clonedSquare(window.currentPokemons)
    let route = []
    let route0 = ifLink0(map, x1, y1, x2, y2, route)
    let route1 = ifLink1(map, x1, y1, x2, y2, route)
    let route2 = ifLink2(map, x1, y1, x2, y2, route)

    if (route0) {
        log('Link0 from', x1, y1, 'to', x2, y2)
        log('route', route0)
        return route0
    } else if (route1) {
        log('Link1 from', x1, y1, 'to', x2, y2)
        log('route', route1)
        return route1
    } else if (route2) {
        log('Link2 from', x1, y1, 'to', x2, y2)
        log('route', route2)
        return route2
    } else {
        log('No Link from', x1, y1, 'to', x2, y2)
        return false
    }

}

const isClickedPokemonValid = (position1, position2) => {
    // 条件一：是否是相同宝可梦、是不是重复点击自己
    let [y1, x1] = position1
    let [y2, x2] = position2
    let is_common = currentPokemons[x1][y1] === currentPokemons[x2][y2]
 
    let not_click_self = !((x1 === x2) && (y1 === y2))
    let rule01 = is_common && not_click_self
    if (!rule01) {
        return false
    }
    // 条件二：是否有有效路径可以相互连接
    let has_route = hasRoute(position1, position2)
    return has_route
}

const updateCurrentPokemons = () => {
    for (let i = 0; i < currentPokemons.length; i++) {
        let line = currentPokemons[i]
        for (let j = 0; j < line.length; j++) {
            let not_number =  !(typeof(line[j]) == 'number')
            if (not_number) {
                currentPokemons[i][j] = 0
            }
        }
    }
}

const bindEvents = () => {
    let soundLink = e('#id-audio-link')
    let soundExplode = e('#id-audio-explode')
    bindEvent(e('#id-table-field'), 'click', event => {
        let cell = event.target
        // 点击pokemon 才有效
        if (!cell.classList.contains('cell')) {
            return
        }
        let x = Number(cell.dataset.x)
        let y = Number(cell.dataset.y)
        let p = [x, y]
        log('p', p)
        // 点击空白位置无效
        if (currentPokemons[x][y] === 0) {
            return
        }
        window.times += 1
        // 是否是第一次有效点击
        if (window.times === 1) {
            log('第一次点击')
            window.firstPosition = p
        } else {
            log('第二次点击')
            let rt = isClickedPokemonValid(window.firstPosition, p)
            if (rt) {
                log('合法')
                currentPokemons[y][x] = 't0'
                let [x2, y2] = firstPosition
                currentPokemons[y2][x2] = 't0'
                rt.forEach(element => {
                    let [x, y, v] = element
                    currentPokemons[y][x] = v
                })
                // log('rt', rt)
                // log('currentPokemons', currentPokemons)
                soundLink.play()
                renderPokemons(currentPokemons)
                
                setTimeout(function() {
                    updateCurrentPokemons()
                    renderPokemons(currentPokemons)
                    soundExplode.play()
                }, 500)
            }
            // 重新初始化
            window.times = 0
            window.firstPosition = []
        }
    })
    bindMusicPlayer()
}

const __main = () => {
    init()
    bindEvents()
}

__main()