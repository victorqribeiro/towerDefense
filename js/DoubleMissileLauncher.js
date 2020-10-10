class DoubleMissileLauncher extends MissileLauncher {

    static price = 250
    static staticType = 3

    constructor(id, pos, enemies){
        super(id, pos, enemies)
        this.type = 3
        this.fireType = 5
        this.price = 250
    }

}
