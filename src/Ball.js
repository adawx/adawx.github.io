import * as constants from './constants';

export default class Ball {
    constructor(x, y, radius, mass, colour) {
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.el = -constants.el;
        this.mass = mass;
        this.radius = radius;
        this.colour = colour;
        this.area = (Math.PI * radius * radius) / 10000;
    }

    update() {
        //Calculate Drag force: -0.5 * coeffDrag * Density * Area * velocity^2 
        var Fx = -0.5 * constants.coeffDrag * constants.rho * this.area * this.velocity.x * this.velocity.x * (this.velocity.x / Math.abs(this.velocity.x));
        var Fy = -0.5 * constants.coeffDrag * constants.rho * this.area * this.velocity.y * this.velocity.y * (this.velocity.y / Math.abs(this.velocity.y));

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        //Calculating the accleration of the ball
        //F = ma or a = F/m
        var ax = Fx / this.mass;
        var ay = constants.ag + (Fy / this.mass);

        //Calculating the ball velocity 
        this.velocity.x += ax * constants.frameRate;
        this.velocity.y += ay * constants.frameRate;

        //Calculating the position of the bal
        this.position.x += this.velocity.x * constants.frameRate * 100;
        this.position.y += this.velocity.y * constants.frameRate * 100;
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