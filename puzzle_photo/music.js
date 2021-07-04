const cutMusic = () => {
    let c = e('.gua-cut')
    log('c', c)
    // let s = find(c, 'source')
    // log('s', s)
    c.play()
}
const noMusic = () => {

}
const playBg = () => {
    let p = e('#id-audio-player')
    log('p', p)
    p.play()
}

