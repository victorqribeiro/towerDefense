class SoundManager {

    constructor(sounds){
        this.sounds = sounds || {}
        this.load()
    }
    
    load(){
        for(const name in this.sounds){
            const audio = document.createElement('audio')
            audio.src = this.sounds[name]
            audio.autoplay = false
            audio.load()
            this.sounds[name] = audio
        }
    }
    
    play(sound){
        this.sounds[sound].currentTime = 0
        this.sounds[sound].play()
    }
    
    pause(sound){
        this.sound[sound].pause()
    }
    
    reset(sound){
        this.sound[sound].pause()
        this.sound[sound].currentTime = 0
    }
    
    stopAll(){
        for(const name in sounds){
            this.sounds[name].pause()
            this.sounds[name].currentTime = 0
        }
    }

}
