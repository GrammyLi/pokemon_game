const pokemon_images = [
    {
        id: '1',
        name: 'Bulbasaur',
        hp: 45,
        atk: 49,
    },
    {
        id: '2',
        name: 'Pikachu',
        hp: 35,
        atk: 55,
    },
    {
        id: '3',
        name: 'Golduck',
        hp: 39,
        atk: 30,
    },

    {
        id: '4',
        name: 'Dratini',
        hp: 41,
        atk: 64,
    },
    {
        id: '5',
        name: 'Charmander',
        hp: 39,
        atk: 52,
    },
    {
        id: '6',
        name: 'Snorlax',
        hp: 160,
        atk: 110,
    },
    {
        id: '7',
        name: 'Abra',
        hp: 25,
        atk: 20,
    },
    {
        id: '8',
        name: 'Jigglypuff',
        hp: 115,
        atk: 45,
    },
    {
        id: '9',
        name: 'Mew',
        hp: 100,
        atk: 100,
    },
    {
        id: '10',
        name: 'Eevee',
        hp: 55,
        atk: 55,
    },
    {
        id: '11',
        name: 'Pidgey',
        hp: 40,
        atk: 45,
    },
    {
        id: '12',
        name: 'Meowth',
        hp: 35,
        atk: 45,
    },
]

const templatePokemonImage = (pokemon) => {
    let { id, name, hp, atk, } = pokemon
    let url = `./Pictures/${id}.png`
    let t = `
    <img class="pokemon-images pokemon-image-${id}" src=${url} alt="${name}" title="${name}" data-id=${id} />
    `
    return t
}

const renderpokemonImages = () => {
    let t = ''
    for (let p of pokemon_images) {
        t += templatePokemonImage(p)
    }
    appendHtml(e('.pokemon-images-container'), t)
}

const init = () => {
    renderpokemonImages()
}

const pokemonStatsBy = id => {
    let index = id - 1
    let { name, hp, atk, } = pokemon_images[index]
    //  <img id="pokemon-stats-image" src="./Pictures/5.png" alt="Charmander" title="Charmander">
    let p = e('#pokemon-stats-image')
    p.src = `./selected/${id}.png`
    p.alt = name
    p.title = name
    e('.pokemon-name').innerText = name
    e('.pokemon-hp').innerText = hp
    e('.pokemon-hp-bar-value').style.width = `${hp}%`
    e('.pokemon-atk').innerText = atk
    e('.pokemon-atk-bar-value').style.width = `${atk}%`
    e('.add-pokemon-button').dataset.id = id
}

const templateSelected = id => {
    let selected_len = selected_pokemon_ids.length
    let del = `
    <div class="roster-pokemon-delete" data-id=${id}>
    </div>`

    if (selected_len == 6) {
        del = ''
    }
    let index = id - 1
    let { name, hp, atk, } = pokemon_images[index]
    let u = `./selected/${id}.png`
    let t = `
    <div class="roster-pokemon-container">
        <div class="roster-pokemon selected-pokemon-add">
            　 <img src="${u}" /> 　
        </div>
        ${del}
    </div>
    `
    return t
}

const templateAfter = () => {
    let selected_len = selected_pokemon_ids.length
    let l = 6 - selected_len
    let t = ''
    for (let i = 0; i < l; i++) {
        t += `
        <div class="roster-pokemon-container">
            <div class="roster-pokemon">
                　 　
            </div>
        </div>
        `
    }
    return t
}

const renderSelected = () => {
    e('.roster-team-container').innerHTML = ''
    let t = ''
    for (let id of selected_pokemon_ids) {
        t += templateSelected(id)
    }
    let after = templateAfter()
    t += after
    appendHtml(e('.roster-team-container'), t)
    if (selected_pokemon_ids.length === 6) {
        e('.add-pokemon-button').classList.add('hide')
        e('.start-game-pokemon-button').classList.remove('hide')
    }
}

const bindPokemonImages = () => {
    bindAll(es('.pokemon-images'), 'click', event => {
        let target = event.target

        let ps = es('.pink-border')
        for (let p of ps) {
            p.classList.remove('pink-border')
        }

        if (target.classList.contains('selected-pokemon')) {
            return
        }
        target.classList.add('pink-border')

        let id = Number(target.dataset.id)
        // log('id', id)
        pokemonStatsBy(id)
    })
}

const bindAddPokemon = () => {
    bindEvent(e('.add-pokemon-button'), 'click', event => {
        let target = event.target

        //　是否已经加满　６个宝可梦
        if (es('.selected-pokemon-add').length === 6) {
            let t = e('.max-pokemon-selected-error-text')
            t.classList.remove('hide')
            t.classList.add('show')
            // log('已经满了')
            return
        }
        let id = Number(target.dataset.id)
        if (selected_pokemon_ids.includes(id)) {
            return
        }
        let sel = `.pokemon-image-${id}`
        e(sel).classList.add('selected-pokemon')
        selected_pokemon_ids.push(id)
        renderSelected()
    })
}

const bindStartGame = () => {
    bindEvent(e('.start-game-pokemon-button'), 'click', event => {
        let target = event.target
        log('开始游戏')
        start_game()
        e('.pokemon-game-container').classList.remove('hide')
        target.classList.add('hide')
    })
}

const bindDeletePokemon = () => {
    bindEvent(e('.roster-team-container'), 'click', event => {
        let target = event.target
        if (!target.classList.contains('roster-pokemon-delete')) {
            return
        }
        // log('target', target)
        let id = Number(target.dataset.id)
        // log('delete id', id)
        let id_index = 0
        selected_pokemon_ids.forEach((i, index) => {
            // log('i', i, 'index', index)
            if (i == id) {
                id_index = index
            }
        })
        selected_pokemon_ids.splice(id_index, 1)

        renderSelected()
        let sel = `.pokemon-image-${id}`
        e(sel).classList.remove('selected-pokemon')
    })
}

const bindPokemonTitle = () => {
    bindEvent(e('.pokemon-title-input'), 'change', event => {
        let target = event.target
        let v = target.value
        let title = `${v} - PopStar`
        e('.pokemon-title').innerText = title
    })
}

const bindEvents = () => {
    bindPokemonImages()
    bindAddPokemon()
    bindStartGame()
    bindDeletePokemon()
    bindPokemonTitle()
}

const __main = () => {
    init()
    bindEvents()
}

__main()
/*
第一步：
1. 生成 10 * 10 简单数据  完成

第二步：
1. 数据渲染  完成

第三步：
1. 点击事件
    判断此 pokemon 是否


第一步：
选择宝可梦
 */