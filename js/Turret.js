class Turret {

    static minRange = 0
    static range = 2
    static price = 50
    static staticType = 1
    
	constructor(id, pos, enemies){
	    this.id = id
		this.pos = {
			x: pos.x,
			y: pos.y
		}
		this.r = 15
		this.level = 1
		this.minRange = 0
		this.range = 2
		this.angle = 0
		this.speed = 0.2
		this.lastDelta = 0
		this.coolDown = 20
		this.currentCoolDown = 0
		this.bullets = []
		this.hits = 0
		this.kills = 0
		this.isShooting = false
		this.lastShot = 10
		this.currentLastShot = 0
		this.type = 1
		this.fireType = 1
		this.price = 50
		this.bulletType = Bullet
		this.enemies = enemies
		this.initialRotation = -HALFPI
		this.maxHealth = 100 
		this.health = this.maxHealth
		this.isGone = false
	}
	
	upgrade(){
	    this.level++
	    this.range += 0.5
	    this.maxHealth += this.maxHealth * 0.2
	    this.health = this.maxHealth
	    this.price += this.price/2
	}
	
    getHit(bullet){
        this.health = Math.max(this.health-bullet.strength, 0)
    }
	
	turnToEnemy(){
	    if(!this.enemy)
	        return

		let a = Math.atan2( this.pos.y-this.enemy.pos.y, this.pos.x-this.enemy.pos.x )
		
		a = a > 0 ? a : TWOPI + a
	
		this.delta = a - this.angle
		
		if( Math.abs(this.lastDelta-this.delta) > Math.PI )
		
			this.delta = this.delta - TWOPI
		
		this.angle += this.delta * this.speed

		this.lastDelta = this.delta
			
	}
	
	shootEnemy(){
	    if(!this.enemy)
	        return
	        
		if( Math.abs(this.delta) < 0.2 && !this.currentCoolDown){
			this.bullets.push( 
			    new this.bulletType(
			        this.id, 
			        {x: this.pos.x, y: this.pos.y}, 
			        this.enemies, 
			        this.angle, 
			        this.fireType, 
			        this.enemy
			    ) 
			)
			this.currentCoolDown = this.coolDown
			this.currentLastShot = this.lastShot
			soundManager.play(`shoot${this.type}`)
		}
	}
	
	getEnemy(){
	    this.enemy = null
		let closeDist = Infinity
		for(let i = 0; i < this.enemies.length; i++){
			const dist = this.distance( this.enemies[i] )
			if( dist < closeDist && dist > this.minRange && dist < this.range && this.enemies[i].health > 0){
				closeDist = dist
				this.enemy = this.enemies[i]
			}
		}
	}
	
	updateBullets(){
		for(let i = this.bullets.length-1; i >= 0 ; i--){
		
			this.bullets[i].update()
			
			if(this.bullets[i].isGone) 
				
				this.bullets.splice(i,1)
			
		}	
	}
	
	update(){

        if(this.health <= 0)
            return

        this.updateBullets()

        this.getEnemy()
			
        this.turnToEnemy()
			
        this.shootEnemy()
			
	
		if( this.currentCoolDown > 0 )
		
			this.currentCoolDown -= 1
			
	    if( this.currentLastShot > 0 )
	     
	        this.currentLastShot -= 1
	
	}
	
	show(){

        if(this.health <= 0)
            return

	    const t = turretTypes[this.type]
		for(let i = 0; i < this.bullets.length; i++){
			this.bullets[i].show()
		}
		c.save()
		c.translate( this.pos.x * tileSize + tileSize2, this.pos.y * tileSize + tileSize2 )
		
		if(t.base)
		    c.drawImage(texture, t.base.x*tileSize, t.base.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		c.rotate(this.angle+this.initialRotation)
		c.drawImage(texture, t.cannon.x*tileSize, t.cannon.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		if(t.fire && this.currentLastShot && this.fireType <= 4){
		    c.drawImage(texture, t.fire.x*tileSize, t.fire.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize-2, tileSize, tileSize)
		}
		c.restore()
	}
	
	static showRange(pos, minRange, range){
	    fc.clearRect(0,0,w,h)
		fc.save()
	    fc.translate( pos.x * tileSize + tileSize2, pos.y * tileSize + tileSize2 )
	    fc.globalAlpha = 0.8
		fc.beginPath()
		fc.arc(0,0,range*tileSize,0,TWOPI, false)
		fc.arc(0,0,minRange*tileSize,0,TWOPI, true)
		fc.fillStyle = "rgba(0,0,200,0.2)"
		fc.fill()
		fc.globalAlpha = 1
		fc.restore()
	}
	
	static showPreview(pos){
		this.showRange(pos, this.minRange, this.range)
	    const t = turretTypes[this.staticType]
		fc.save()
	    fc.translate( pos.x * tileSize + tileSize2, pos.y * tileSize + tileSize2 )
		fc.rotate(-HALFPI)
		fc.drawImage(texture, t.base.x*tileSize, t.base.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		fc.drawImage(texture, t.cannon.x*tileSize, t.cannon.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		fc.restore()
	}

	distance(enemy){
		return Math.sqrt( (this.pos.x - enemy.pos.x) ** 2 + (this.pos.y - enemy.pos.y) ** 2 )
	}

}
