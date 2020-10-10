class MissileLauncher extends Turret {

    static minRange = 4
    static range = 6
    static price = 200
    static staticType = 4
    
    constructor(id, pos, enemies){
        super(id, pos, enemies)
        this.type = 4
        this.fireType = 6
        this.coolDown = 50
        this.price = 200
        this.minRange = 4
        this.range = 6
        this.bulletType = Missile
    }
    
    show(){
	    const t = turretTypes[this.type]
		for(let i = 0; i < this.bullets.length; i++){
			this.bullets[i].show()
		}
		c.save()
		c.translate( this.pos.x * tileSize + tileSize2, this.pos.y * tileSize + tileSize2 )
		c.drawImage(texture, t.base.x*tileSize, t.base.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		c.rotate(this.angle-Math.PI/2)
		
		if(!this.currentLastShot){
		    c.drawImage(texture, t.cannon.x*tileSize, t.cannon.y*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		}else{
		    c.drawImage(texture, t.cannon.x*tileSize, (t.cannon.y+1)*tileSize, tileSize, tileSize, -tileSize2, -tileSize2, tileSize, tileSize)
		}
		/* debug
		c.beginPath()
		c.arc(0,0,this.range*tileSize,0,TWOPI)
		c.stroke()
		c.beginPath()
		c.arc(0,0,this.minRange*tileSize,0,TWOPI)
		c.stroke()
		*/
		c.restore() 
    }

}
