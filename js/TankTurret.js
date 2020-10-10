class TankTurret extends Turret {
    
	constructor(id, pos, enemies, type){
        super(id, pos, enemies)
        this.angle = Math.PI
        this.type = type || 8
        this.initialRotation = Math.PI
    }
    
    getEnemy(){
	    this.enemy = null
		let closeDist = Infinity
		for(const id in turrets){
		    const enemy = turrets[id]
			const dist = this.distance( enemy )
			if( dist < closeDist && dist > this.minRange && dist < this.range && !enemy.isGone){
				closeDist = dist
				this.enemy = enemy
			}
		}
	}
    
}
