const bindPlay = function() {
    let playButton = e('.grammy-button-play')
    let nowPlaying = e('.now-playing')
    bindEvent(playButton, 'click', function() {
        log('play')
        nowPlaying.classList.add('visible')
        let a = e('#id-audio-music')
        // 添加播放功能
        a.play()
    })
}
const bindPause = function() {
    let playButton = e('.grammy-button-pause')
    let nowPlaying = e('.now-playing')
    bindEvent(playButton, 'click', function() {
        log('pause')
        nowPlaying.classList.remove('visible')
        let a = e('#id-audio-music')
        // 添加暂停功能
        a.pause()
    })
}

const bindMusicPlayer = function() {
    bindPlay()
    bindPause()
}