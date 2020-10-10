const turretTypes = {
    1: {
        base: {x:19, y:7},
        cannon: {x:19, y:10},
        fire: {x:19, y:12}
    },
    2: {
        base: {x:20, y:7},
        cannon: {x:20, y:10},
        fire: {x:20, y:12}
    },
    3: {
        base: {x:21, y:7},
        cannon: {x:21, y:8},
        fire: {x:21, y:12}
    },
    4: {
        base: {x:22, y:7},
        cannon: {x:22, y:8},
        fire: {x:22, y:12}
    },
    8: {
        base: null,
        cannon: {x:15, y:12},
        fire: null
    },
    9: {
        base: null,
        cannon: {x:16, y:12},
        fire: null
    }
}

const enemiesTypes = {
    1: {
        body: {x:15, y:10}
    },
    2: {
        body: {x:16, y:10}
    },
    3: {
        body: {x:17, y:10}
    },
    4: {
        body: {x:18, y:10}
    },
    5: {
        body: {x:15, y:11}
    },
    6: {
        body: {x:16, y:11}
    },
    7: {
        body: {x:17, y:11},
        shadow: {x:17, y:12}
    },
    8: {
        body: {x:18, y:11},
        shadow: {x:18, y:12}
    }
}

const bulletsType = {
    1: [11,19],
    2: [11,20],
    3: [11,21],
    4: [11,22],
    5: [10,21],
    6: [10,22],
}

const charMap = {
    '0': [12,0],
    '1': [12,1],
    '2': [12,2],
    '3': [12,3],
    '4': [12,4],
    '5': [12,5],
    '6': [12,6],
    '7': [12,7],
    '8': [12,8],
    '9': [12,9],
    '%': [12,10],
    '$': [12,11],
    ':': [12,12],
    '+': [12,14],
    '.': [12,15]
}

const detailTypes = {
    1: {pos: {y: 5, x: 15}, price: 50},
    2: {pos: {y: 5, x: 16}, price: 30},
    3: {pos: {y: 5, x: 17}, price: 30},
    4: {pos: {y: 5, x: 18}, price: 50},
    5: {pos: {y: 5, x: 19}, price: 50},
    6: {pos: {y: 5, x: 20}, price: 80},
    7: {pos: {y: 5, x: 21}, price: 80},
    8: {pos: {y: 5, x: 22}, price: 80}
}

const coords = {
    0 : [2,4],
    1 : [0,0],
    2 : [0,1],
    3 : [0,2],
    4 : [1,0],
    5 : [1,1],
    6 : [1,2],
    7 : [2,0],
    8 : [2,1],
    9 : [2,2],
    10 : [0,3],
    11 : [0,4],
    12 : [1,3],
    13 : [1,4]
}

const FXtypes = {
    1: [0, 19],
    2: [0, 20],
    3: [0, 21],
    4: [0, 22]
}
