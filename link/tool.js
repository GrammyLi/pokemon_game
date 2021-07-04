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
// 预设DOM操作
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

const createZeroArray = function(length) {
    // 返回长度为 length 的数组，其所有元素皆为 0
    let array = []
    for (let i = 0; i < length; i++) {
        array.push(0)
    }
    return array
}

const clonedSquare = function(square) {
    let clone = []
    for (let i = 0; i < square.length; i++) {
        clone.push(square[i].slice(0))
    }
    return clone
}

const randomBetween = (start, end) => {
    let n = Math.random() * (end - start + 1)
    return ~~(n + start)
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
