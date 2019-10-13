(function () {
    'use strict';

    //Utility Functions

    const factorOfSpeed = 10;

    function randomRGBValue() {
        return Math.floor(Math.random() * (255));
    }

    function getRandomNumber() {
        var randomNum = Math.floor(Math.random() * factorOfSpeed) + 1;
        randomNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return randomNum;
    }

    //Physics and Other Constants

    //Physics
    const coeffDrag = 0.47; // Smooth sphere coefficient of drag
    const rho = 1.22; // kg / m^3 - density of ball
    const ag = 9.81; // m / s^2 -- acceleration due to gravity
    const el = 0.8; // Factor of energy retained after a collision

    //Other
    const frameRate = 1 / 60; // Seconds
    const frameDelay = frameRate * 1000; // ms

    class Ball {
        constructor(x, y, radius, mass, colour) {
            this.position = {
                x: x,
                y: y
            };
            this.velocity = {
                x: 0,
                y: 0
            };
            this.el = -el;
            this.mass = mass;
            this.radius = radius;
            this.colour = colour;
            this.area = (Math.PI * radius * radius) / 10000;
        }

        update() {
            //Calculate Drag force: -0.5 * coeffDrag * Density * Area * velocity^2 
            var Fx = -0.5 * coeffDrag * rho * this.area * this.velocity.x * this.velocity.x * (this.velocity.x / Math.abs(this.velocity.x));
            var Fy = -0.5 * coeffDrag * rho * this.area * this.velocity.y * this.velocity.y * (this.velocity.y / Math.abs(this.velocity.y));

            Fx = (isNaN(Fx) ? 0 : Fx);
            Fy = (isNaN(Fy) ? 0 : Fy);

            //Calculating the accleration of the ball
            //F = ma or a = F/m
            var ax = Fx / this.mass;
            var ay = ag + (Fy / this.mass);

            //Calculating the ball velocity 
            this.velocity.x += ax * frameRate;
            this.velocity.y += ay * frameRate;

            //Calculating the position of the bal
            this.position.x += this.velocity.x * frameRate * 100;
            this.position.y += this.velocity.y * frameRate * 100;
        }

        render(ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.colour;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }

        checkWallCollision(width, height) {
            if (this.position.x > width - this.radius) {
                this.velocity.x *= this.el;
                this.position.x = width - this.radius;
            }
            if (this.position.y > height - this.radius) {
                this.velocity.y *= this.el;
                this.position.y = height - this.radius;
            }
            if (this.position.x < this.radius) {
                this.velocity.x *= this.el;
                this.position.x = this.radius;
            }
            if (this.position.y < this.radius) {
                this.velocity.y *= this.el;
                this.position.y = this.radius;
            }
        }

    }

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

        loopTimer = setInterval(loop, frameDelay);
    };

    var loop = function () {
        ctx.clearRect(0, 0, width, height);

        balls.forEach(ball => {
            ball.update();
            ball.render(ctx);
            ball.checkWallCollision(width, height);
        });

        //Text
        updateTextCounter(ctx);

    };

    function updateTextCounter(ctx) {
        // ctx.fillStyle = 'black';
        // ctx.font = "12pt Ariel";
        ctx.fillText("Number of Balls: " + balls.length, 0, 16);
    }

    function getMousePosition(e) {
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    }

    var mouseClick = function (e) {
        if (e.which == 1) {
            getMousePosition(e);
            balls.push(new Ball(mouse.x, mouse.y, 6, 10, "rgb(" + randomRGBValue() + "," + randomRGBValue() + "," + randomRGBValue() + ")"));
            balls[balls.length - 1].velocity.x = getRandomNumber();
            balls[balls.length - 1].velocity.y = getRandomNumber();
        }
    };

    setup();

}());
