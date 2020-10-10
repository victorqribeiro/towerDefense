class Bullet {

	constructor(id, pos, enemies, a, type, enemy){
	    this.turrentId = id
		this.pos = {
			x: pos.x,
			y: pos.y
		}
		this.a = a - Math.PI/2
		this.speed = 0.4
		this.dir = {
			x: Math.cos(a) * this.speed,
			y: Math.sin(a) * this.speed
		}
		this.r = 10
		this.type = type || 1
		this.arr = bulletsType[this.type]
		this.strength = 10
		this.isGone = false
		this.enemy = enemy
		this.enemies = enemies
	}
	
	dealDamage(){
	    if(this.distance(this.enemy)*tileSize <= (this.r+this.enemy.r)){
            this.enemy.getHit(this)
            this.isGone = true
            fxs.push(new FX(this.enemy.pos) )
        }
	}
	
	update(){
	    if(this.isGone) 
	        return
		this.pos.x -= this.dir.x
		this.pos.y -= this.dir.y
		
        if(this.pos.x < 0 || this.pos.x > wh || this.pos.y < 0 || this.pos.y > wh){
		   this.isGone = true
		   return
        }
        
        this.dealDamage()
	}
	
	show(){
	    if(this.isGone) 
	        return
	    c.save()
	    c.translate( this.pos.x * tileSize + tileSize2, this.pos.y * tileSize + tileSize2 )
        c.rotate(this.a)
        c.drawImage(texture, this.arr[1]*tileSize, this.arr[0]*tileSize, tileSize, tileSize, -tileSize2, -tileSize, tileSize, tileSize)
        c.restore()
	}

    distance(target){
        return Math.sqrt((this.pos.x - target.pos.x) ** 2 + (this.pos.y - target.pos.y) ** 2)
    }

}
