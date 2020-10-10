class MusicManager {

    constructor(src, loop){
        this.sound = document.createElement('audio')
	    this.sound.src = src
	    this.sound.type = "audio/mp3"
	    this.sound.loop = loop || true
	    this.sound.load()
	    this.isTransitioning = false
    }
    
    play(){
        this.sound.play()
    }
    
    pause(){
        this.sound.pause()
    }
    
    increaseVolume(val = 0.1){
        this.sound.volume = Math.min(1, this.sound.volume+val)
    }
    
    decreaseVolume(val = 0.1){
        this.sound.volume = Math.max(0, this.sound.volume-val)
    }
    
    setVolume(val){
        if(val < 0 || val > 1)
            return
        this.sound.volume = val
    }
    
    isPaused(){
        return this.sound.paused
    }
    
    reset(){
        this.sound.currentTime = 0
    }
    
    isGoingToEnd(){
        return (this.sound.duration - this.sound.currentTime) < 10
    }
    
    transition(sound, rate = 0.01){
        this.isTransitioning = true
        if(sound.isPaused()){
            sound.setVolume(0)
            sound.play()
        }
        this.decreaseVolume(rate)
        sound.increaseVolume(rate)
        if(this.sound.volume || sound.volume < 1){
            setTimeout( ()=>{ this.transition(sound, rate) }, 100 )
        }else{
            this.isTransitioning = false
            const tmp = this.sound
            this.sound = sound.sound
            sound.sound = tmp
            sound.reset()
        }
    }

}
