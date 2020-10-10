class TimeManager {

    constructor(){
        this.callbacks = []
    }

    addCallback(func, startTime, timeInterval, howManyTimes){
        this.callbacks.push({
            func,
            startTime,
            timeInterval, 
            howManyTimes, 
            count: 0
        })
    }

    update(){
        if(!this.callbacks.length)
            return
        for(let i = this.callbacks.length-1; i >= 0; i--){
            if( performance.now() - this.callbacks[i].startTime >= this.callbacks[i].timeInterval ){
                this.callbacks[i].func()
                this.callbacks[i].startTime = performance.now()
                if(!this.callbacks[i].howManyTimes)
                    continue
                this.callbacks[i].count++
                if( this.callbacks[i].count == this.callbacks[i].howManyTimes )
                    this.callbacks.splice(i, 1)
            }
        }
    }

}
