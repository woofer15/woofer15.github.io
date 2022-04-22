let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let tileX = 0
let currentTileHeight = 200;
let randomHeight = Math.floor((Math.random()*3)+ 1);
let playerHeight = 200;
let scroll = true;
let nextTileHeight;
let myScore = 0;
let useGravity = true;
let canJump = true;
let floating = false;

if (randomHeight === 1) {
    nextTileHeight = 150;
} else if (randomHeight === 2) {
    nextTileHeight = 200;
} else if (randomHeight === 3) {
    nextTileHeight = 250;
};

let firstTile = function() {
    //generate the first tile
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = '#000050';
    ctx.fillRect(tileX, 400 - currentTileHeight, 800, currentTileHeight);
    if (tileX <= 0) {
        nextTile();
    };
    if (tileX === -800) {
        //reset tiles
        tileX = 0
        randomHeight = Math.floor((Math.random()*3)+ 1);
        if (randomHeight === 1) {
            nextTileHeight = 150;
        } else if (randomHeight === 2) {
            nextTileHeight = 200;
        } else if (randomHeight === 3) {
            nextTileHeight = 250;
        };
    };
    if (tileX === -751) {
        currentTileHeight = nextTileHeight;
        //crash
        if (playerHeight < nextTileHeight) {
            scroll = false;
        };
    };
};

let nextTile = function() {
    //generate next tile
    ctx.fillStyle = '#000050';
    ctx.fillRect(tileX + 800, 400 - nextTileHeight, 800, nextTileHeight);
}

let playerTile = function() {
    //create player
    ctx.fillStyle = '#00ED00'
    ctx.fillRect(25, 400 - playerHeight - 25, 25, 25);
};

let gravity = function() {
    //create gravity
    if (useGravity === true) {
        if (currentTileHeight < playerHeight) {
            playerHeight = playerHeight - 5;
            floating = true;
        } else {
            floating = false
        };
    };
    if (floating === false) {
        canJump = true;
    };
};

let score = function() {
    //add to score
    ctx.font = "20px Courier";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "White";
    ctx.fillText("Score: " + myScore, 0, 0);
    myScore++;
};

let jump = function() {
    //make the player jump
    $("body").keydown(function (event) {
        let letter = event.key;

        if (letter === 'ArrowUp') {
            if (canJump === true) {
                //jump
                canJump = false;
                useGravity = false;
                playerHeight = playerHeight + 150;
                setTimeout(reGravity, 125);
            };
        };
    });
};

let reGravity = function() {
    useGravity = true;
};

let tick = function() {
    if (scroll === true) {
        //create the tick
        firstTile();
        playerTile();
        gravity();
        score();
        jump();
        tileX = tileX - 1;
        setTimeout(tick, 0.1);
    } else {
        //stop game
        ctx.font = "145px Courier";
        ctx.fillStyle = "Red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", 400, 200);
    };
};

tick();