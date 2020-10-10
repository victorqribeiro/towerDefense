class FX {

    constructor(pos, ttl, vel, type, {grow, fade, rand, fixed, move} = {}){
        this.pos = {
            x: pos.x,
            y: pos.y
        }
        this.randomX = rand ? Math.random() * tileSize - tileSize2 : 0
        this.randomY = rand ? Math.random() * tileSize - tileSize2 : 0
        this.ttl = ttl || 30
        this.vel = vel || 1
        this.type = type || 1
        this.grow = grow || true
        this.fade = fade || true
        this.move = move || false
        this.moveAmount = 0
        this.life = 0
        this.isGone = false
        this.isFixed = fixed
        this.arr = FXtypes[this.type]
    }
    
    update(){
        if( this.isGone || this.isFixed )
            return
        this.life += this.vel
        if( this.life >= this.ttl )
            this.isGone = true
    }

    show(){
        if(this.isFixed)
            return this.showFixed()
            
        if(this.isGone)
            return
            
        let power = 1
        if(this.fade || this.grow)
            power = (this.life / this.ttl) ** 2
        c.save()
        if(this.fade)
            c.globalAlpha = 1 - power
        if(this.move)
            this.moveAmount -= 15
        c.translate(this.pos.x * tileSize + this.randomX, this.pos.y * tileSize + this.randomY + this.moveAmount)
        let ini = 0
        let fin = tileSize
        if(this.grow){
            ini = -tileSize2*power
            fin = tileSize+tileSize*power
        }
        c.drawImage(texture, this.arr[1]*tileSize+1, this.arr[0]*tileSize+1, tileSize-2, tileSize-2, ini, ini, fin, fin)
        c.restore()
    }
    
    showFixed(){
        c.save()
        c.translate(this.pos.x * tileSize, this.pos.y * tileSize)
        c.drawImage(texture, this.arr[1]*tileSize+1, this.arr[0]*tileSize+1, tileSize-2, tileSize-2, 0, 0, tileSize, tileSize)
        c.restore()
    }

}
