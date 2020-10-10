class DoubleTurret extends Turret {

    static price = 100
    static staticType = 2

    constructor(id, pos, enemies){
        super(id, pos, enemies)
        this.type = 2
        this.fireType = 2
        this.price = 100
    }

}
