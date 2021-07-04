const fillMap = function(map, fruitNum, fruitRepeat) {
    map = clonedSquare(map)
    let h = map.length
    let w = map[0].length
    let x = 0
    let y = 0
    for (let i = 0; i < fruitNum; i++) {
        for (let j = 0; j < fruitRepeat; j++) {
            x = Math.floor(Math.random() * w)
            y = Math.floor(Math.random() * h)
            if (map[y][x] === 0) {
                map[y][x] = i + 1
            } else {
                j -= 1
            }
        }
    }
    return map
}

const createMap = function(height, width, fruitNum, fruitRepeat) {
    let map = []
    let h = height - 2
    let w = width - 2
    for (let y = 0; y < h; y++) {
        map.push([])
        for (let x = 0; x < w; x++) {
            map[y].push(0)
        }
    }
    map = fillMap(map, fruitNum, fruitRepeat)
    for (let y = 0; y < h; y++) {
        map[y].unshift(0)
        map[y].push(0)
    }
    let zeroArray = createZeroArray(width)
    map.unshift(zeroArray)
    map.push(zeroArray)
    return map
}

const createTable = function(width, height) {
    let table = e('table')
    for (let y = 0; y < height; y++) {
        appendHtml(table, `<tr id="id-row-${y}"></tr>`)
        let row = e(`#id-row-${y}`)
        for (let x = 0; x < width; x++) {
            appendHtml(row, `<td class="cell" id="id-cell-${x}-${y}" data-x="${x}" data-y="${y}">(${x}, ${y})</td>`)
        }
    }
}

const refresh = function(map) {
    map = clonedSquare(map)
    let h = map.length
    let w = map[0].length
    let classMenu = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9',
        'c10', 'c11', 'c12', 'c13', 'c14', 'c15',
        'tx', 'ty', 't1', 't2', 't3', 't4', 't0'
    ]
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let cell = e(`#id-cell-${x}-${y}`)
            let mapCell = map[y][x]
            cell.innerHTML = `(${x}, ${y}) ${mapCell}`
            for (let i = 0; i < classMenu.length; i++) {
                cell.classList.remove(classMenu[i])
            }
            if (typeof mapCell === 'number') {
                cell.classList.add(classMenu[mapCell])
            } else {
                cell.classList.add(mapCell)
            }
        }
    }
}

// 判断(x1, y1)到(x2, y2)是否能直接相连（直线上无障碍）
// 能相连则返回 route，否则返回 false
const ifLink0 = function(map, x1, y1, x2, y2, route) {
    
    map = clonedSquare(map)
    route = clonedSquare(route)
    
    if (x1 === x2) {
        let a = Math.max(y1, y2)
        let b = Math.min(y1, y2)
        for (let i = b + 1; i < a; i++) {
            if (map[i][x1] !== 0) {
                return false
            }
            route.push([x1, i, 'ty'])
        }
        return route
    } else if (y1 === y2) {
        let a = Math.max(x1, x2)
        let b = Math.min(x1, x2)
        for (let i = b + 1; i < a; i++) {
            if (map[y1][i] !== 0) {
                return false
            }
            route.push([i, y1, 'tx'])
        }
        return route
    } else {
        log('No Link0', x1, y1, x2, y2)
        return false
    }
}

// 判断(x1, y1)到(x2, y2)是否相连（只拐1次弯）
const ifLink1 = function(map, x1, y1, x2, y2, route) {
    // log('ifLink1', x1, y1, x2, y2)
    
    map = clonedSquare(map)
    route = clonedSquare(route)
    
    // t1 ~ t4 为四种拐角的标记
    // t1 t2
    // t4 t3
    let corner1
    let corner2
    if (x1 < x2) {
        if (y1 < y2) {
            // x1 < x2, y1 < y2
            corner1 = 't2'
            corner2 = 't4'
        } else {
            // x1 < x2, y1 > y2
            corner1 = 't3'
            corner2 = 't1'
        }
    }  else {
        if (y1 < y2) {
            // x1 > x2, y1 < y2
            corner1 = 't1'
            corner2 = 't3'
        } else {
            // x1 > x2, y1 > y2
            corner1 = 't4'
            corner2 = 't2'
        }
    }

    if (map[y1][x2] === 0) {
        let route1 = ifLink0(map, x1, y1, x2, y1, route)
        let route2 = ifLink0(map, x2, y1, x2, y2, route)
        if (route1 && route2) {
            route = route1.concat(route2)
            route.push([x2, y1, corner1])
            return route
        } else {
            return false
        }
    } else if (map[y2][x1] === 0) {
        let route1 = ifLink0(map, x1, y1, x1, y2, route)
        let route2 = ifLink0(map, x1, y2, x2, y2, route)
        if (route1 && route2) {
            route = route1.concat(route2)
            route.push([x1, y2, corner2])
            return route
        } else {
            return false
        }
    } else {
        return false
    }
}

// 判断(x1, y1)到(x2, y2)是否相连（只拐2次弯）
const ifLink2 = function(map, x1, y1, x2, y2, route) {
    map = clonedSquare(map)
    route = clonedSquare(route)
    let h = map.length
    let w = map[0].length
    
    for (let x = 0; x < w; x++) {
        if (map[y1][x] === 0) {
            let route1 = ifLink0(map, x1, y1, x, y1, route)
            let route2 = ifLink1(map, x, y1, x2, y2, route)
            if (route1 && route2) {
                route = route1.concat(route2)
                if (y1 < y2) {
                    if (x < x1) {
                        route.push([x, y1, 't1'])
                    } else {
                        route.push([x, y1, 't2'])
                    }
                } else {
                    if (x < x1) {
                        route.push([x, y1, 't4'])
                    } else {
                        route.push([x, y1, 't3'])
                    }
                }
                return route
            }
        }
    }
    for (let y = 0; y < h; y++) {
        if (map[y][x1] === 0) {
            let route1 = ifLink0(map, x1, y1, x1, y, route)
            let route2 = ifLink1(map, x1, y, x2, y2, route)
            if (route1 && route2) {
                route = route1.concat(route2)
                if (x1 < x2) {
                    if (y < y1) {
                        route.push([x1, y, 't1'])
                    } else {
                        route.push([x1, y, 't4'])
                    }
                } else {
                    if (y < y1) {
                        route.push([x1, y, 't2'])
                    } else {
                        route.push([x1, y, 't3'])
                    }
                }
                return route
            }
        }
    }
    return false
}

// 判断(x1, y1)与(x2, y2)是否值相等且能相连
const isLink = function(map, x1, y1, x2, y2) {
    map = clonedSquare(map)
    let route = []
    
    if (map[y1][x1] !== map[y2][x2]) {
        return false
    } else {
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
}

const routePrint = function(map, route) {
    map = clonedSquare(map)
    
    while (route.length > 0) {
        let node = route.pop()
        let x = node[0]
        let y = node[1]
        map[y][x] = node[2]
    }
    
    return map
}
const mapClear = function(map) {
    map = clonedSquare(map)
    let h = map.length
    let w = map[0].length
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (typeof map[y][x] === 'string') {
                map[y][x] = 0
            }
        }
    }
    return map
}

const bindClick = function(map) {
    let table = e('table')
    let cord = []
    let cords = []
    let soundLink = e('#id-audio-link')
    let soundExplode = e('#id-audio-explode')
    table.addEventListener('click', function(event) {
        let target = event.target
        if (!target.classList.contains('c0') && !target.classList.contains('highlighted') ){
            let x = Number(target.dataset.x)
            let y = Number(target.dataset.y)
            cord.push(x)
            cord.push(y)
            if (cords.length === 0) {
                cords.push(cord)
                cord = []
                target.classList.add("highlighted")
            } else {
                cords.push(cord)
                cord = []
                e('.highlighted').classList.remove('highlighted')
                // 判断：cords[0]与cords[1]是否值相等且能相连，若相连，消除
                log('cords', cords)
                let route = isLink(map, cords[0][0], cords[0][1], cords[1][0], cords[1][1])
                if (route) {
                    map = routePrint(map, route)
                    map[cords[0][1]][cords[0][0]] = 't0'
                    map[cords[1][1]][cords[1][0]] = 't0'
                    refresh(map)
                    soundLink.play()
                    map = mapClear(map)
                    setTimeout(function() {
                        refresh(map)
                        soundExplode.play()
                    }, 500)
                }
                cords = []
            }
        }
    })
}

const loadPics = function(images, map, width, height) {
    let loads = 0
    let names = Object.keys(images)
    for (let name of names) {
        let img = new Image()
        img.src = images[name]
        img.dataset.id = name
        img.onload = () => {
            loads += 1
            // 所有图片都载入成功之后
            if (loads === names.length) {
                // 移除 .loading 元素
                let loading = e('.loading')
                loading.style.opacity = '0'
                setTimeout(() => {
                    loading.remove()
                    createTable(width, height)
                    refresh(map)
                    bindClick(map)
                }, 1000)
            }
        }
    }
}

const __main = function() {
    // 变量定义与初始化
    let height = 8
    let width = 12
    let fruitNum = 15
    let fruitRepeat = 4

    bindMusicPlayer()

    let testmap = [
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    let map = createMap(height, width, fruitNum, fruitRepeat)
    // map = testmap

    // 图片资源目录
    let images = {
        t0: "Theme-Universe/t0.jpg",
        t1: "Theme-Universe/t1.jpg",
        t2: "Theme-Universe/t2.jpg",
        t3: "Theme-Universe/t3.jpg",
        t4: "Theme-Universe/t4.jpg",
        tx: "Theme-Universe/tx.jpg",
        ty: "Theme-Universe/ty.jpg",
    }
    for (let i = 0; i < 16; i++) {
        images[i] = "Theme-Universe/" + String(i) +".jpg"
    }
    
    loadPics(images, map, width, height)
}

__main()
