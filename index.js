var arena = []
var timer = 0;
var timerTarget = 0.5
var alive = true;

var screenWidth = 400;
var screenHeight = 640;
var blockSize = screenWidth / 10;

var pieces = [
    [{ x: 200, y: 0 }, { x: 200, y: 40 }, { x: 200, y: 80 }, { x: 200, y: 120 }, { x: 220, y: 60 }],
    [{ x: 160, y: 0 }, { x: 160, y: 40 }, { x: 200, y: 40 }, { x: 240, y: 40 }, { x: 200, y: 40 }],
    [{ x: 240, y: 0 }, { x: 240, y: 40 }, { x: 200, y: 40 }, { x: 160, y: 40 }, { x: 200, y: 40 }],
    [{ x: 160, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 40 }, { x: 160, y: 40 }, { x: 180, y: 20 }],
    [{ x: 200, y: 0 }, { x: 240, y: 0 }, { x: 200, y: 40 }, { x: 160, y: 40 }, { x: 200, y: 40 }],
    [{ x: 200, y: 0 }, { x: 200, y: 40 }, { x: 160, y: 40 }, { x: 240, y: 40 }, { x: 200, y: 40 }],
    [{ x: 200, y: 0 }, { x: 160, y: 0 }, { x: 200, y: 40 }, { x: 240, y: 40 }, { x: 200, y: 40 }]
]

var current = []

function fillArena() {
    for (i = 0; i <= screenHeight; i += blockSize) {
        arena.push({ x: -blockSize, y: i })
    }

    for (i = 0; i <= screenHeight; i += blockSize) {
        arena.push({ x: screenWidth, y: i })
    }

    for (i = 0; i <= screenWidth; i += blockSize) {
        arena.push({ x: i, y: screenHeight })
    }
}

function checkLine() {
    for (i = 0; i < screenHeight; i += blockSize) {
        let aux = []
        for (j = 0; j < screenWidth; j += blockSize) {
            arena.find(function (value, index) {
                if (value.x === j && value.y === i) {
                    aux.push(index)
                    return true
                }
            })
        }
        if (aux.length >= 10) {
            aux.sort((a, b) => b - a)
            aux.forEach(function (value, index) {
                arena.splice(value, 1)
            })

            arena.forEach(function (value, index) {
                if (value.y < i && value.x > -blockSize && value.x < screenWidth) value.y += blockSize
            })
        }
    }
}

function getNewPiece() {
    let index = Math.floor(Math.random() * pieces.length)
    current = [
        { x: pieces[index][0].x, y: pieces[index][0].y },
        { x: pieces[index][1].x, y: pieces[index][1].y },
        { x: pieces[index][2].x, y: pieces[index][2].y },
        { x: pieces[index][3].x, y: pieces[index][3].y },
        { x: pieces[index][4].x, y: pieces[index][4].y }
    ]
}

function setup() {
    createCanvas(screenWidth, screenHeight)
    fillArena()
    getNewPiece()
}

function draw() {
    if (alive) {
        timer += deltaTime / 1000;
        if (timer >= timerTarget) {
            timer = 0
            moveDown()
        }
    }
    background(0)
    fill(255)

    for (piece in current) {
        if (piece != 4) rect(current[piece].x, current[piece].y, blockSize, blockSize)
    }

    for (item in arena) {
        rect(arena[item].x, arena[item].y, blockSize, blockSize)
    }

    if(!alive){
        textSize(64);
        fill(255, 0, 0);
        text('YOU LOSE\nREFRESH\nTHE PAGE', 40, 260);
    }
    
}

function moveDown() {
    if (!checkCollision(blockSize, current)) {
        for (piece in current) {
            current[piece].y += blockSize
        }
    }
    else {
        current.splice(4, 1)
        arena = arena.concat(current)
        checkLine()
        getNewPiece()
        if (checkCollision(0, current))
            alive = false
    }
}

function rotatePiece() {
    var newPiece = [
        { x: current[0].x, y: current[0].y },
        { x: current[1].x, y: current[1].y },
        { x: current[2].x, y: current[2].y },
        { x: current[3].x, y: current[3].y },
        { x: current[4].x, y: current[4].y }
    ]
    var newX;
    var newY;
    for (piece in newPiece) {
        newX = -newPiece[piece].y + newPiece[4].y + newPiece[4].x
        newY = newPiece[piece].x - newPiece[4].x + newPiece[4].y
        newPiece[piece].x = newX
        newPiece[piece].y = newY
    }
    if (!checkCollision(0, newPiece)) {
        current = newPiece
    }
}

function checkCollision(number, newPiece) {
    if (arena.some(function (value, index) {
        for (piece in newPiece) {
            if (newPiece[piece].x === value.x && newPiece[piece].y + number === value.y)
                return true
        }
    }))
        return true;
    else {
        return false;
    }

}

function keyPressed() {
    if (alive) {
        if (keyCode === UP_ARROW) {
            rotatePiece()
        }
        if (keyCode === LEFT_ARROW) {
            if (!arena.some(function (value, index) {
                for (piece in current) {
                    if (current[piece].x - blockSize === value.x && current[piece].y === value.y)
                        return true
                }
            })) {
                for (piece in current) {
                    current[piece].x -= blockSize
                }
            }
        }
        if (keyCode === RIGHT_ARROW) {
            if (!arena.some(function (value, index) {
                for (piece in current) {
                    if (current[piece].x + blockSize === value.x && current[piece].y === value.y)
                        return true
                }
            })) {
                for (piece in current) {
                    current[piece].x += blockSize
                }
            }
        }
        if (keyCode === DOWN_ARROW) {
            timerTarget = 0.1
        }
    }
}

function keyReleased() {
    if (alive) {
        if (keyCode === DOWN_ARROW) {
            timerTarget = 0.5
        }
    }
}