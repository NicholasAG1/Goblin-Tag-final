// Goblin Tag

// Load canvas
let cnv = document.getElementById("main game");
let ctx = cnv.getContext("2d");
cnv.width = 750
cnv.height = 750

// player variables
let time = 0;
let ga = 1;
let power = 0;
// level Variables
let Wall = [];
let powers = [];
// foe variables
let goblin = [];

setInterval(t, 1000)

function t() {
    time++;
    if (time % 5 == 0) {
        ga++;
        spawn();
    }
}
   


// Player location
let player = {
    x: 376,
    y: 740,
    r: 20    
}

// powerup locations
function makePower() {
    for (let i = 0; i < power; i++) {
        powers.push({
            x: Math.random() * cnv.width,
            y: Math.random() * cnv.height,
            r: 15
        })
    }
}

// Goblin Locations
function spawn() {
    for (let i = 0; i < ga; i++) {
        goblin.push({
            x: Math.random() * cnv.width,
            y: Math.random() * cnv.height,
            r: 15
        })
    }
}

// wall location
function wallHor() {
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        Wall.push({
            x: Math.random() * cnv.width,
            y: Math.random() * cnv.height,
            w: Math.random() * cnv.width,
            h: 5
        })
    }
}

function wallVert() {
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        Wall.push({
            x: Math.random() * cnv.width,
            y: Math.random() * cnv.height,
            w: 5,
            h: Math.random() * cnv.width
        })
    }
}


spawn();
wallVert();
wallHor();
makePower();

let loseVar = 0;

let distanceY = 0;
let distanceX = 0;
let gS = 0.01
let col = 0;
let distance = 0;

// Event listiners
document.addEventListener("keydown", move)
// Functions

// Main Programe loop
requestAnimationFrame(draw);

function draw() {
    // Drawing 
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    // Time
    document.getElementById('timer').innerHTML = time;

    // Set player info
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI);
    ctx.fill();

    // Set Wall info
    for (let i = 0; i < Wall.length; i++) {
        ctx.strokeStyle = 'black';
        ctx.fillRect(Wall[i].x, Wall[i].y, Wall[i].w, Wall[i].h)
    }
    

    // Set Goblin info
    for (let g = 0; g < ga; g++) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(goblin[g].x, goblin[g].y, goblin[g].r, 0, 2 * Math.PI);
        ctx.fill()

        // Goblin Movement

        distanceX = (player.x - goblin[g].x)
        distanceY = (player.y - goblin[g].y)
        distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

        goblin[g].y += distanceY * (gS)
        goblin[g].x += distanceX * (gS)

        // If at any given moment 2 goblins touch each other, then move them apart, r = 15
        for (let i = 0; i < goblin.length - 1; i++) {
            let direction = 0;
            if (goblin[i].x + 20 > goblin[i + 1].x && goblin[i].x - 20 < goblin[i + 1].x && goblin[i].y + 20 > goblin[i + 1].y && goblin[i].y - 20 < goblin[i + 1].y) {
                direction = Math.floor(Math.random() *4)
                if (direction == 1) {
                    goblin[i].x += 20
                }else if (direction == 2) {
                    goblin[i].y += 20
                }else if (direction == 3) {
                    goblin[i].x -= 20
                }else if (direction == 4) {
                    goblin[i].y -= 20
                }
            }
            // Check if the goblins tagged you 
            if (distance < player.r + goblin[i].r) {
                endGame()
            }
        }
    }

    // set powerup
    for (let p = 0; p < power; p++) {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(powers[p].x, powers[p].y, powers[p].r, 0, 2 * Math.PI);
        ctx.fill()
    }

    // Request another Animation frame
    requestAnimationFrame(draw);
}

let dir;

function move() {

    if (event.code == "ArrowUp") {
           player.y -= 10
           dir = 'u'
           wallCollide()
       }
       
       if (event.code == "ArrowRight") {
           player.x += 10
           dir = 'r'
           wallCollide()
       }
       
       if (event.code == "ArrowDown") {
           player.y += 10
           dir = 'd'
           wallCollide()
       }
       
       if (event.code == "ArrowLeft") {
           player.x -= 10
           dir = 'l'
           wallCollide()
       }
        // stop at the edges
       if (player.y < 0) {
           player.y = 0;
       }else if (player.y > 750) {
           player.y = 750;
       }else if (player.x < 0) {
           player.x = 0;
       }else if (player.x > 750) {
           player.x = 750;
       }
} 

function endGame() {
    document.getElementById('Game-Over').innerHTML = 'Game Over. Click Here to reset';
    document.getElementById('Game-Over').addEventListener('click', Reset)
    cnv.remove()
    time--
}

function Reset() {
    document.location.reload()
}

function wallCollide() {

    for (let i = 0; i < Wall.length; i++) {
        // Set Wall hit detection
        if (circleRectCollide(player, Wall[i])) {
            if (dir == 'u') {
                player.y = Wall[i].y + Wall[i].h + player.r;
            }else if (dir == 'd') {
                player.y = Wall[i].y - player.r;
            }else if (dir == 'l') {
                player.x = Wall[i].x + Wall[i].w + player.r;
            }else if (dir == 'r') {
                player.x = Wall[i].x - player.r;
            }
        }
    }
}


function circleRectCollide(aCircle, aRect) {
    // aCircle should have (x, y) and r properties
    // aRect should have (x, y) and w, h properties
    let leC = aCircle.x - aCircle.r;
    let reC = aCircle.x + aCircle.r;
    let teC = aCircle.y - aCircle.r;
    let beC = aCircle.y + aCircle.r;

    let leR = aRect.x;
    let reR = aRect.x + aRect.w;
    let teR = aRect.y;
    let beR = aRect.y + aRect.h;

    return (leC < reR && reC > leR && beC > teR && teC < beR) 
}