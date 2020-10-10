const fs = require('fs')

const getNeighbours = (map, cell) => {
	const neighbours = []
	for(let i = -1; i < 2; i++){
		for(let j = -1; j < 2; j++){
			if(cell[0]+i >= 0 && cell[0]+i < map.length && 
			   cell[1]+j >= 0 && cell[1]+j < map[0].length && 
			   i !== j && (!i && j || i && !j) && 
			   map[cell[0]][cell[1]])
				neighbours.push( [ cell[0]+i, cell[1]+j ] ) 
		}
	}
	return neighbours
}

const depthFirst = (map, start, end) => {
  const stack = []
  const path = {}
  const visited = {}
  visited[ start ] = true
  stack.push(start)
  while( stack.length > 0 ){
  	v = stack.shift();
  	if( v[0] == end[0] && v[1] == end[1]){
  		let i = end
  		let p = []
  		while(i != start){
  			p.push( i )
  			i = path[i]
  		}	
  		return p.reverse()
  	}
  	const n = getNeighbours(map, v)
  	for(let i = 0; i < n.length; i++){
  		if( !(n[i] in visited) ){
  			visited[ n[i] ] = true
				path[ n[i] ] = v
				stack.push( n[i] )
  		}
  	}
  }
  return null;
}

const randInt = (_min, _max) => {
    return Math.floor(Math.random() * (Math.max(_max,_min)-Math.min(_max,_min)+1) + Math.min(_max,_min))
}

const generateMap = (w, h, curvesProbability, vertical) => {

    const map = Array(h).fill().map(_ => Array(w).fill(0) )
    
    if(typeof(vertical) == "undefined")
        vertical = Math.random() < 0.5
    
    let ini, fin, sides
    if(vertical){
        ini = [0,randInt(0,w-1)]
        fin = [h-1, randInt(0,w-1)]
        sides = h
    }else{
        ini = [randInt(0,h-1),0]
        fin = [randInt(0,h-1),w-1]
        sides = w
    }
    
    const points = [ini]
    for(let i = 3; i <= sides - 3; i+=3){
        if(Math.random() > curvesProbability)   
            continue
        if(vertical)
            points.push( [i, randInt(0,w-1)])
        else
            points.push( [randInt(0,h-1), i])
    }    
    points.push(fin)

    for(let i = 0; i < points.length-1; i++){
        if(!vertical){
            for(let j = Math.min(points[i][0], points[i+1][0]); j <= Math.max(points[i][0], points[i+1][0]); j++){
                map[j][points[i][1]] = 5
            }
            for(let j = Math.min(points[i][1], points[i+1][1]); j <= Math.max(points[i][1], points[i+1][1]); j++){
                map[points[i+1][0]][j] = 5
            }
        }else{
            for(let j = Math.min(points[i][1], points[i+1][1]); j <= Math.max(points[i][1], points[i+1][1]); j++){
                map[points[i][0]][j] = 5
            }
            for(let j = Math.min(points[i][0], points[i+1][0]); j <= Math.max(points[i][0], points[i+1][0]); j++){
                map[j][points[i+1][1]] = 5
            }
        }
    }
        
    return {map, ini, fin}
}

const getRule = (grid) => {
    const int = parseInt(grid, 2)
    
    if( int == 1 )  return 1
    
    if( int == 64 ) return 7
    
    if( int == 4 ) return 3
    
    if( int == 256 ) return 9
    
    if( [8, 9, 72, 73].includes(int) ) return 4
        
    if( [32, 36, 288, 292].includes(int) ) return 6

    if( [2, 3, 6, 7].includes(int) ) return 2

    if( [128, 192, 384, 448].includes(int) ) return 8
        
    if( [200, 201, 456, 457].includes(int) ) return 11

    if( [416, 420, 480, 484].includes(int) ) return 10

    if( [38, 39, 294, 295].includes(int) ) return 12

    if( [11, 15, 75, 79].includes(int) ) return 13
    
    return 0
}

const beautifyMap = map => {
    const beautyMap = Array(map.length).fill().map( _ => Array(map[0].length).fill(0) )
    for(let i = 0; i < beautyMap.length; i++){
        for(let j = 0; j < beautyMap[0].length; j++){
            if( map[i][j] ){
                beautyMap[i][j] = map[i][j]
                continue
            }
            let string = ""
            for(let iv = -1; iv < 2; iv++){
                for(let jv = -1; jv < 2; jv++){
                    if(i+iv < 0 || i+iv >= beautyMap.length || j+jv < 0 || j+jv >= beautyMap[0].length)
                        string += "0"
                    else
                        string += `${map[i+iv][j+jv]/5}`
                }
            }
            beautyMap[i][j] = getRule(string)
        }
    }
    return beautyMap
}

const generateDetails = (map, details) => {
    const detailMap = Array(map.length).fill().map( _ => Array(map[0].length).fill(0) )
    for(let i = 0; i < detailMap.length; i++){
        for(let j = 0; j < detailMap[0].length; j++){
            if(map[i][j] == 5 )
                continue
            if(Math.random() > 0.08)
                continue
            detailMap[i][j] = randInt(1, details)
        }
    }
    return detailMap
}

const canPlace = (map,x,y,checkBound = false) => {
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if( x+j >= map[0].length || x+j < 0 || i+y >= map.length || i+y < 0 )
                if(checkBound)
                    return false
                else
                    continue
            if( map[y+i][x+j] )
                return false
        }
    }
    return true
}

const closeMap = (map) => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            let sum = 0
            for(let y = -1; y < 2; y++){
                for(let x = -1; x < 2; x++){
                    if(x+j < 0 || x+j >= map[0].length || i+y < 0 || i+y >= map.length)
                        continue
                    if( Math.abs(x+y) == 1 && map[y+i][x+j] )
                        sum += 1
                }
            }
            if(sum >= 3)
                map[i][j] = 5
        }
    }
    return map
}

const generateIsland = (map) => {
    const islandMap = Array(map.length).fill().map( _ => Array(map[0].length).fill(0) )
    let tryout = 0
    let x
    let y
    let ok = false
    while(tryout < 5){
        x = randInt(0, map[0].length-1)
        y = randInt(0, map.length-1)
        if(canPlace(map,x,y)){
            islandMap[y][x] = 5
            ok = true
            break
        }
        tryout += 1
    }
    if(ok){
        for(let i = 0; i < Math.floor(Math.random() * map.length * map[0].length); i++){
            const possibleDir = []
            if(canPlace(map,x+1,y,true)){
                islandMap[y][x+1] = 5
                possibleDir.push([y,x+1]) 
            }
            if(canPlace(map,x-1,y,true)){
                islandMap[y][x-1] = 5
                possibleDir.push([y,x-1]) 
            }
            if(canPlace(map,x,y+1,true)){
                islandMap[y+1][x] = 5
                possibleDir.push([y+1,x]) 
            }
            if(canPlace(map,x,y-1,true)){
                islandMap[y-1][x] = 5
                possibleDir.push([y-1,x]) 
            }
            let newDir = possibleDir[Math.floor(Math.random()*possibleDir.length)]
            if(newDir){
                x = newDir[1]
                y = newDir[0]
            }
        }
    }
    const closedMap = closeMap(islandMap)
    return beautifyMap(closedMap)
}

const mergeIslandMap = (map, island) => {
    for(let i = 0; i < map.length; i++)
        for(let j = 0; j < map[0].length; j++)
            if(island[i][j] && !map[i][j])
                map[i][j] = island[i][j] + 13
    return map
}

const data = generateMap(21, 10, 0.5)

const path = depthFirst(data.map, data.ini, data.fin)

const beautyMap = beautifyMap(data.map)

const island = generateIsland(beautyMap)

const finalMap = mergeIslandMap(beautyMap, island)

const detailMap = generateDetails(data.map, 8)

const yOffsetPossible = [0, 3, 6, 9]

const xOffsetPossible = [0, 5, 10]

fs.writeFileSync(
    '../map.json', 
    JSON.stringify({
        map: finalMap,
        detailMap: detailMap,
        path: path,
        ini: data.ini,
        yOffset: yOffsetPossible[Math.floor(Math.random() * yOffsetPossible.length)],
        xOffset: xOffsetPossible[Math.floor(Math.random() * xOffsetPossible.length)],
    })
)

