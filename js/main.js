const TWOPI = Math.PI * 2
const HALFPI = Math.PI / 2
const FRAMES_PER_SECOND = 60
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5

let tileSize = 64

let canvas,
	c,
	fcanvas,
	fc,
	wh,
	w,
	h,
	u,
	event,
	tileSize2,
	screenSize,
	mapSize,
	map,
	detailMap,
	turretMap,
	enemies,
	fxs,
	path,
	ini,
	yOffset,
	xOffset,
	turrets,
	texture,
	turretType,
	money,
	delta,
	numEnemies,
	depEnemies,
	timEnemies,
	startTime,
	lastPos,
	selected,
	id,
	enemySpeed,
	enemyType,
	mainBg,
	otherBg,
	lastFrameTime,
	tManager,
	soundManager
		

const load = () => {
    mainBg = new MusicManager("music/Analog-Nostalgia.mp3")
    otherBg = new MusicManager("music/Runaway-Food-Truck.mp3")
    soundManager = new SoundManager({
        'shoot1': 'soundfx/156895__halgrimm__a-shot.wav',
        'shoot2': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot3': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot4': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot5': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot6': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot7': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot8': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'shoot9': 'soundfx/368734__leszek-szary__shoot-1.wav',
        'letsgo': 'soundfx/514688__metrostock99__lets-go.wav'
    })
    texture = new Image()
    texture.src = `img/towerDefense_tilesheet${tileSize==32?'-32':''}.png`
    texture.onload = () => {
        fetch("map.json").
        then( response => response.json() ).
        then( data => {
            map = data.map
            detailMap = data.detailMap
            turretMap = Array(map.length).fill().map( _ => Array(map[0].length).fill(0) )
            path = data.path
            ini = data.ini
	        yOffset = data.yOffset || 0
	        xOffset = data.xOffset || 0
            showMenu()
        }).
        catch( e => console.log(e) )
    }
}

const showMenu = () => {
    const btn = document.createElement('button')
    btn.innerText = "Play"
    btn.style.width = "300px"
    btn.style.height = "50px"
    btn.style.position = "fixed"
    btn.style.top = "50%"
    btn.style.left = "50%"
    btn.style.marginLeft = "-150px"
    btn.style.marginTop = "-25px"
    btn.onclick = () => {
        btn.remove()
        init()
    }
    document.body.appendChild( btn )
}

const transposeMap = () => {

    const tmpMap = Array(map[0].length).fill().map( _ => Array(map.length).fill(0) )
    const tmpDetailMap = Array(map[0].length).fill().map( _ => Array(map.length).fill(0) )
    const tmpTurretMap = Array(map[0].length).fill().map( _ => Array(map.length).fill(0) )
    
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            let val = map[i][j]
            let oldVal = 0
            if(val > 13){
                val -= 13
                oldVal = 13
            }
            switch(val){
                case 2 :
                    val = 4
                    break
                case 3 :
                    val = 7
                    break
                case 4 :
                    val = 2
                    break
                case 6 :
                    val = 8
                    break
                case 7 :
                    val = 3
                    break
                case 8 :
                    val = 6
                    break
                case 11 :
                    val = 12
                    break
                case 12 :
                    val = 11
                    break
            }
            tmpMap[j][i] = val + oldVal
            tmpDetailMap[j][i] = detailMap[i][j]
            tmpTurretMap[j][i] = turretMap[i][j]
        }
    }

    map = tmpMap
    detailMap = tmpDetailMap
    turretMap = tmpTurretMap
    
    for(let i = 0; i < path.length; i++){
        let temp = path[i][0]
        path[i][0] = path[i][1]
        path[i][1] = temp
    }
    
    let tmp = ini[0]
    ini[0] = ini[1]
    ini[1] = tmp
   
}

const init = function(){

    tManager = new TimeManager()

    scale = window.devicePixelRatio

    lastFrameTime = 0

    mainBg.play()

    enemySpeed = 0.02
    
    enemyType = 1

    lastPos = { x: 0, y: 0}

    id = 0

    numEnemies = 8
    
    depEnemies = 0
    
    timEnemies = 1000

    money = 200

    turretType = null
	
	tileSize2 = tileSize/2
	
	canvas = document.createElement('canvas')
	
	w = map[0].length * tileSize
	
	h = map.length * tileSize
	
	canvas.width = w * scale
	
	canvas.height = h * scale
	
	canvas.style.width = w + "px"
	
	canvas.style.height = h + "px"
	
	document.body.innerHTML = ""
	
	document.body.appendChild( canvas )
	
	c = canvas.getContext('2d')
	
	c.scale(scale, scale)
	
	fcanvas = canvas.cloneNode()
	
	fcanvas.style.position = "absolute"
	
	document.body.appendChild( fcanvas )
	
	fc = fcanvas.getContext('2d')
	
	fc.scale(scale, scale)
	
	enemies = []
	
	turrets = {}
	
	fxs = []

	fcanvas.addEventListener('click', mouseClick )
	
	fcanvas.addEventListener('mousemove', feedback )
	
	fcanvas.addEventListener('mouseout', () =>{
	    fc.clearRect(0,0,w,h)
	})
	
	document.addEventListener('keydown', changeTurret )
	
	document.addEventListener('visibilitychange', visibilityChange )
	
	startTime = performance.now()
	
    tManager.addCallback(
        ()=>{
            startTime = performance.now()
        },
        startTime,
        60000,
        0
    )
	
    tManager.addCallback(
        deployEnemies,
        startTime,
        60000,
        3
    )
	
	u = requestAnimationFrame(update)
}

const draw = function(){
	c.clearRect(0,0,w,h)
	
	for(let i = 0; i < map.length; i++){
		for(let j = 0; j < map[0].length; j++){
		    let index = map[i][j]
		    let localOffset = 0
		    if(index > 13){
		        index -= 13
		        localOffset = 5
		    }
		    const arr = coords[index]
            c.drawImage(
                texture, 
                ((arr[1]+xOffset+localOffset)%15)*tileSize, 
                (arr[0]+yOffset)*tileSize, 
                tileSize, 
                tileSize, 
                j * tileSize, 
                i * tileSize, 
                tileSize, 
                tileSize
            )
            if(!detailMap[i][j])
                continue
            const detail = detailTypes[detailMap[i][j]]
            c.drawImage(
                texture, 
                detail.pos.x*tileSize, 
                detail.pos.y*tileSize, 
                tileSize, 
                tileSize, 
                j * tileSize, 
                i * tileSize, 
                tileSize, 
                tileSize
            )
        }
    }
	
	for(const id in turrets){
	    if(turrets[id].isGone)
	        continue
        turrets[id].show()
	}
	
	for(let i = 0; i < enemies.length; i++){
		enemies[i].show()
	}
	
	for(let i = 0; i < fxs.length; i++){
		fxs[i].show()
	}
	
	if(selected && selected.type == "turret"){
        Turret.showRange(
            selected.pos,
            turrets[selected.id].minRange,
            turrets[selected.id].range
        )
    }
	
	if(selected){
	    c.strokeStyle = "blue"
	    c.strokeRect(selected.pos.x * tileSize, selected.pos.y * tileSize, tileSize, tileSize)
	}
	
	showMoney()

}

const update = function(time){

    tManager.update()

    if(time-lastFrameTime < FRAME_MIN_TIME){
        u = requestAnimationFrame(update)
        return
    }
    lastFrameTime = time

	draw()
	
	for(let i = enemies.length-1; i >= 0; i--){
		enemies[i].update()
		if(enemies[i].health <= 0){
            money += enemies[i].value
            fxs.push( new FX(enemies[i].pos, 1000, 1, 2, {grow: false, fade: true, rand: true}) )
		    enemies.splice(i, 1)
        }else if(enemies[i].win){
            fxs.push( new FX(enemies[i].pos, 60, 1, 4, {grow: true, fade: true, rand: false}) )
            enemies.splice(i, 1)
        }
	}
	
	for(const id in turrets){
	    if(turrets[id].isGone)
	        continue
        turrets[id].update()
        if(turrets[id].health < turrets[id].maxHealth * 0.3)
            fxs.push( new FX(turrets[id].pos, 5, 1, 1, {grow: false, fade: true, rand: true, fixed: false, move: true}) )
        if(turrets[id].health <= 0){
            fxs.push( new FX(turrets[id].pos, 0, 0, 3, {grow: false, fade: false, rand: true, fixed: true}) )
            turrets[id].isGone = true
        }
	}
	
	for(let i = fxs.length-1; i >= 0; i--){
		fxs[i].update()
		if(fxs[i].isGone)
		    fxs.splice(i, 1)
	}
	
    showTime()
    
    if(mainBg.isGoingToEnd() && !mainBg.isTransitioning)
        mainBg.transition(otherBg)
		
	u = requestAnimationFrame(update)
	
}

const drawText = (text, x, y) => {
    for(let i = 0; i < text.length; i++){
        const arr = charMap[text[i]]
        c.drawImage(
            texture, 
            arr[1] * tileSize, 
            arr[0] * tileSize, 
            tileSize, 
            tileSize, 
            i * tileSize + x, 
            y, 
            tileSize, 
            tileSize
        )
    }
}

const showTime = () => {
    const stringTime = `${60-parseInt((performance.now() - startTime)/1000)}`
    drawText(stringTime, 0, h-tileSize)
}

const showMoney = () => {
    const stringMoney = `$${money}`
    drawText(stringMoney, w-stringMoney.length*tileSize, 0)
}

let ie = 0

const deployEnemies = () => {

    if(ie == 0){
        tManager.addCallback(
            ()=>{
                soundManager.play('letsgo')
            },
            performance.now(),
            800,
            1
        )
        tManager.addCallback(
            ()=>{
                enemies.push( new Enemy({x:ini[1],y:ini[0]}, path, 15, enemyType, enemySpeed) )
            },
            performance.now(),
            1000,
            8
        )
    }
    
    if(ie == 1){
        const x1 = 0
        const y1 = map.length>>1
        const x2 = map[0].length-1
        const y2 = y1
        tManager.addCallback(
            ()=>{
                enemies.push( new Airplane({x:x1,y:y1}, [[y2,x2]], 15, 8, 0.04) )
            },
            performance.now(),
            1000,
            3
        )
    }
    
    if(ie == 2){
        tManager.addCallback(
            ()=>{
                enemies.push( new Tank({x:ini[1],y:ini[0]}, path, 15, 6, 0.02) )
            },
            performance.now(),
            1000,
            1
        )
    }
    
    ie = (ie+1)%3
    
}

const getPosition = e => {
    if(!e.offsetX)
        return lastPos
    lastPos.x = Math.floor( e.offsetX / tileSize )
    lastPos.y = Math.floor( e.offsetY / tileSize )
    return lastPos
}

const mouseClick = e => {

    const pos = getPosition(e)

    if(turretType && money-turretType.price >= 0 && map[pos.y][pos.x] != 5 && !detailMap[pos.y][pos.x] && !turretMap[pos.y][pos.x]){
        money -= turretType.price
        id += 1
        turrets[id] = new turretType(id, {x: pos.x, y: pos.y}, enemies)
        turretMap[pos.y][pos.x] = id
        turretType = null
    }else if(!turretType){
        if(turretMap[pos.y][pos.x] && !turrets[turretMap[pos.y][pos.x]].isGone)
            selected = {
                'type': 'turret',
                'id': turrets[turretMap[pos.y][pos.x]].id,
                'price': turrets[turretMap[pos.y][pos.x]].price,
                'pos': turrets[turretMap[pos.y][pos.x]].pos
            }
        else if(detailMap[pos.y][pos.x])
            selected = {
                'type': 'detail',
                'id': detailMap[pos.y][pos.x],
                'price': detailTypes[detailMap[pos.y][pos.x]].price,
                'pos': {x: pos.x, y: pos.y}
            }
        else
            selected = null
    }
	
}

const feedback = e => {
    const pos = getPosition(e)
    fc.clearRect(0, 0, fcanvas.width, fcanvas.height)
    const spot = map[pos.y][pos.x]
    if((spot < 5 || (spot > 5 && spot < 14) || spot > 13) && !detailMap[pos.y][pos.x] && !turretMap[pos.y][pos.x])
        fc.strokeStyle = "black"
    else
        fc.strokeStyle = "red"
    fc.strokeRect(pos.x * tileSize, pos.y * tileSize, tileSize, tileSize)
    if(turretType)
        turretType.showPreview(pos)
}

const playPause = (e) => {
    e.preventDefault()
    if(u)
        u = cancelAnimationFrame(u)
    else
        update()
}

const changeTurret = e => {
    switch(e.keyCode){
        /* debug */
        case 32 :
            playPause(e)
            break;
        case 13 :
            deployEnemies()
            break;
        /* end debug */
        case 48 :
            turretType = null
            break
        case 49 :
            turretType = Turret
            break
        case 50 :
            turretType = DoubleTurret
            break
        case 51 :
            turretType = DoubleMissileLauncher
            break
        case 52 :
            turretType = MissileLauncher
            break
        case 68 :
            if(selected)
                remove(selected)
            break
        case 85 :
            if(selected && selected.type == "turret" && money - selected.price >= 0){
                money -= selected.price
                turrets[selected.id].upgrade()
            }
        default :
            turretType = null
    }
    feedback(e)
    //selected = null
}

const remove = object => {
    if(object.type == "turret" && turrets[object.id].health > 0){
        delete turrets[object.id]
        turretMap[object.pos.y][object.pos.x] = 0
        money += Math.round( object.price * 0.8 )
        selected = null
    }else if(object.type == "detail"){
        if(money - object.price >= 0){
            money -= object.price
            detailMap[object.pos.y][object.pos.x] = 0
        }
    }
    selected = null
}

const visibilityChange = () => {
  if (document.visibilityState === 'visible') {
    mainBg.play()
  } else {
    mainBg.pause()
  }
}

load()

const reload = () => {
    yOffset = (yOffset + 3) % 12
    if(yOffset == 0)
        xOffset = (xOffset+5) % 15
    setTimeout( reload, 1000 )
}
