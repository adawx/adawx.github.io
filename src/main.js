import * as utils from './utils';
import * as constants from './constants';
import Ball from './Ball';

//Declarations
var width = null;
var height = null;
var canvas = false;
var ctx = false;
var loopTimer = false;
var balls = [];
var mouse = {
    x: 0,
    y: 0
};


var setup = function () {
    canvas = document.getElementById("ball-canvas");
    ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    canvas.onmousemove = getMousePosition;
    canvas.onclick = mouseClick;

    loopTimer = setInterval(loop, constants.frameDelay);
};

var loop = function () {
    ctx.clearRect(0, 0, width, height);

    balls.forEach(ball => {
        ball.update();
        ball.render(ctx);
        ball.checkWallCollision(width, height);
    })

    //Text
    updateTextCounter(ctx);

};

function updateTextCounter(ctx) {
    ctx.fillText("Number of Balls: " + balls.length, 0, 16);
};

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
};

var mouseClick = function (e) {
    if (e.which == 1) {
        getMousePosition(e);
        balls.push(new Ball(mouse.x, mouse.y, 6, 10, "rgb(" + utils.randomRGBValue() + "," + utils.randomRGBValue() + "," + utils.randomRGBValue() + ")"));
        balls[balls.length - 1].velocity.x = utils.getRandomNumber();
        balls[balls.length - 1].velocity.y = utils.getRandomNumber();
    }
};

setup();