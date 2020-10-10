class Enemy {

	constructor(pos, path, r, type, speed){
	
		this.pos = pos || {x: 0, y: 0}
		
		this.maxHealth = 50 + type * 10
		
		this.health = this.maxHealth
		
		this.r = r || 10
		
		this.type = type || 1
		
		this.angle = 0
		
		this.path = path
		
		this.current = 0
		
		this.speed = speed || 0.02
		
		this.offSet = 0.5
		
		this.value = 10
		
		this.win = false
	
	}
	
	update(){
	
	    if( this.health <= 0 || this.win )
	    
	        return

		if( this.current >= this.path.length ){

            this.win = true

			return
			
        }

        const xDir = this.path[this.current][1] - this.pos.x
        const yDir = this.path[this.current][0] - this.pos.y
        
        let xFunc
        if( xDir >= 0 ){
            this.pos.x += Math.min(xDir, this.speed)
            xFunc = Math.floor
        }else{
            this.pos.x += Math.max(xDir, -this.speed)
            xFunc = Math.ceil
        }   
        
        let yFunc
        if( yDir >= 0){
            this.pos.y += Math.min(yDir, this.speed)
            yFunc = Math.floor
        }else{
            this.pos.y += Math.max(yDir, -this.speed)
            yFunc = Math.ceil
        }

        this.angle = Math.atan2(yFunc(this.pos.y) - this.path[this.current][0], xFunc(this.pos.x) - this.path[this.current][1]) + Math.PI
		
		if( this.dist(this.pos.x,this.path[this.current][1],this.pos.y,this.path[this.current][0]) <= this.speed )
		
		    this.current += 1

	}
	
	show(){
	    if( this.health <= 0 )
	        return
        const e = enemiesTypes[this.type]
	    c.save()
	    c.translate( this.pos.x * tileSize + tileSize2, this.pos.y * tileSize + tileSize2 )
	    this.showHealthBar()
	    c.rotate(this.angle)
	    if(e.shadow)
	        c.drawImage(texture, e.shadow.x*tileSize+1, e.shadow.y*tileSize, tileSize, tileSize, -tileSize, tileSize, tileSize, tileSize)
	    c.drawImage(texture, e.body.x*tileSize+1, e.body.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
	    c.restore()
	}

    dist(x1,x2,y1,y2){
        return Math.sqrt( (x1-x2)**2 + (y1-y2)**2 )
    }

    showHealthBar(){
        c.fillStyle = "red"
        c.fillRect(-15, -tileSize2, this.health / this.maxHealth * 0.3 * 100, 5)
        c.strokeStyle = "black"
        c.strokeRect(-15, -tileSize2, 30, 5)
    }

    getHit(bullet){
        this.health = Math.max(this.health-bullet.strength, 0)
        turrets[bullet.turrentId].hits++
        if(this.health <= 0)
            turrets[bullet.turrentId].kills++
    }

}
