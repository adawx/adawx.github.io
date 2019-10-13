var width = null;
var height = null;
var canvas = ctx = false;
var frameRate = 1 / 40; // Seconds
var frameDelay = frameRate * 1000; // ms
var loopTimer = false;
var balls = [];

/*
 * Experiment with values of mass, radius, restitution,
 * gravity (ag), and density (rho)!
 * 
 * Changing the constants literally changes the environment
 * the ball is in. 
 * 
 * Some settings to try:
 * the moon: ag = 1.6
 * water: rho = 1000, mass 5
 * beach ball: mass 0.05, radius 30
 * lead ball: mass 10, restitution -0.05
 */
function Ball(x, y, radius, e, mass, colour) {
    this.position = {
        x: x,
        y: y
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.e = -e;
    this.mass = mass;
    this.radius = radius;
    this.colour = colour;
    this.area = (Math.PI * radius * radius) / 10000;
};

var coeffDrag = 0.47; // Dimensionless
var rho = 1.22; // kg / m^3
var ag = 9.81; // m / s^2
var mouse = {
    x: 0,
    y: 0,
    isDown: false
};

function randomRGBValue() {
    return 75 + Math.floor(Math.random() * (255 - 20) - 20);
}

function getRandomNumber() {
    var randomNum = Math.floor(Math.random() * 9) + 1;
    randomNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return randomNum;
}

function getMousePosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}
var mouseDown = function (e) {
    if (e.which == 1) {
        getMousePosition(e);
        mouse.isDown = true;
        balls.push(new Ball(mouse.x, mouse.y, 10, 0.7, 10, "rgb(" + randomRGBValue() + "," + randomRGBValue() + "," + randomRGBValue() + ")"));
    }
}
var mouseUp = function (e) {
    if (e.which == 1) {
        mouse.isDown = false;
        balls[balls.length - 1].velocity.x = getRandomNumber();
        balls[balls.length - 1].velocity.y = getRandomNumber();
    }
}



var setup = function () {
    canvas = document.getElementById("ball-canvas");
    ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    canvas.onmousemove = getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;

    loopTimer = setInterval(loop, frameDelay);
}

function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
        if (!mouse.isDown || i != balls.length - 1) {
            //physics - calculating the aerodynamic forces to drag
            // -0.5 * coeffDrag * A * v^2 * rho
            var fx = -0.5 * coeffDrag * rho * balls[i].area * balls[i].velocity.x * balls[i].velocity.x * (balls[i].velocity.x / Math.abs(balls[i].velocity.x));
            var fy = -0.5 * coeffDrag * rho * balls[i].area * balls[i].velocity.y * balls[i].velocity.y * (balls[i].velocity.y / Math.abs(balls[i].velocity.y));

            fx = (isNaN(fx) ? 0 : fx);
            fy = (isNaN(fy) ? 0 : fy);
            console.log(fx);
            //Calculating the accleration of the ball
            //F = ma or a = F/m
            var ax = fx / balls[i].mass;
            var ay = ag + (fy / balls[i].mass);

            //Calculating the ball velocity 
            balls[i].velocity.x += ax * frameRate;
            balls[i].velocity.y += ay * frameRate;

            //Calculating the position of the ball
            balls[i].position.x += balls[i].velocity.x * frameRate * 100;
            balls[i].position.y += balls[i].velocity.y * frameRate * 100;
        }

        //Rendering Ball
        ctx.beginPath();
        ctx.fillStyle = balls[i].colour;
        ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        collisionBall(balls[i]);
        collisionWall(balls[i]);

    }

    //Text
    ctx.fillStyle = 'black';
    ctx.font = "12pt Ariel";
    ctx.filText("Number of Balls: " + balls.length, 0, 16);

}

function collisionWall(ball) {
    if (ball.position.x > width - ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = width - ball.radius;
    }
    if (ball.position.y > height - ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = height - ball.radius;
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = ball.radius;
    }
    if (ball.position.y < ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = ball.radius;
    }
}

function collisionBall(b1) {
    for (var i = 0; i < balls.length; i++) {
        var b2 = balls[i];
        if (b1.position.x != b2.position.x && b1.position.y != b2.position.y) {
            //quick check for potential collisions using AABBs
            if (b1.position.x + b1.radius + b2.radius > b2.position.x &&
                b1.position.x < b2.position.x + b1.radius + b2.radius &&
                b1.position.y + b1.radius + b2.radius > b2.position.y &&
                b1.position.y < b2.position.y + b1.radius + b2.radius) {

                //pythagoras 
                var distX = b1.position.x - b2.position.x;
                var distY = b1.position.y - b2.position.y;
                var d = Math.sqrt((distX) * (distX) + (distY) * (distY));

                //checking circle vs circle collision 
                if (d < b1.radius + b2.radius) {
                    var nx = (b2.position.x - b1.position.x) / d;
                    var ny = (b2.position.y - b1.position.y) / d;
                    var p = 2 * (b1.velocity.x * nx + b1.velocity.y * ny - b2.velocity.x * nx - b2.velocity.y * ny) / (b1.mass + b2.mass);

                    // calulating the point of collision 
                    var colPointX = ((b1.position.x * b2.radius) + (b2.position.x * b1.radius)) / (b1.radius + b2.radius);
                    var colPointY = ((b1.position.y * b2.radius) + (b2.position.y * b1.radius)) / (b1.radius + b2.radius);

                    //stoping overlap 
                    b1.position.x = colPointX + b1.radius * (b1.position.x - b2.position.x) / d;
                    b1.position.y = colPointY + b1.radius * (b1.position.y - b2.position.y) / d;
                    b2.position.x = colPointX + b2.radius * (b2.position.x - b1.position.x) / d;
                    b2.position.y = colPointY + b2.radius * (b2.position.y - b1.position.y) / d;

                    //updating velocity to reflect collision 
                    b1.velocity.x -= p * b1.mass * nx;
                    b1.velocity.y -= p * b1.mass * ny;
                    b2.velocity.x += p * b2.mass * nx;
                    b2.velocity.y += p * b2.mass * ny;
                }
            }
        }
    }
}

setup();