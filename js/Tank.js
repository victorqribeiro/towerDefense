class Tank extends Enemy {

    constructor(pos, path, r, type, speed){
        super(pos, path, r, type, speed)
        this.turret = new TankTurret(0, this.pos, null, this.type+3)
    }
    
    update(){
        super.update()
        this.turret.pos = this.pos
        this.turret.update()
    }
    
    show(){
        super.show()
        this.turret.show()
    }

}
