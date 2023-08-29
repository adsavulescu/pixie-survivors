import * as PIXI from 'pixi.js';
import Victor from 'victor';

export default class Slashing {
    constructor({app, level, player, allowedDimensions}) {
        this.app = app;
        this.level = level;
        this.player = player;
        this.allowedDimensions = allowedDimensions;
        this.bullets = [];
        this.bulletRadius = 8;
        this.circleRadius = 70;
        this.maxBullets = 5;
        this.bulletVelocity = 0.1;


        // this.direction = null;

        this.theta = 0;

    }

    fire() {
        if (this.player.getDirection().moving) {

            if (this.bullets.length < this.maxBullets) {
                for (let i = 0; i < this.maxBullets; i++) {
                    this.theta = 0;
                    const dot = new PIXI.Graphics();
                    dot.beginFill(0X0000ff);
                    dot.drawCircle(0, 0, this.bulletRadius);
                    dot.endFill();
                    this.bullets.push(dot);
                    this.level.addChild(dot);
                }
            }

        }

    }

    set slash(shooting) {
        if(shooting) {
            this.fire();
            this.interval = setInterval(() => this.fire(), 500);
        } else {
            clearInterval(this.interval);
        }
    }

    update(delta) {

        this.theta += this.bulletVelocity * delta;


        this.bullets.forEach((bullet, bulletIndex) => {
            this.direction = this.player.getDirection().direction;

            const distance = (bulletIndex + this.bulletVelocity) * (this.circleRadius / this.maxBullets);
            let x, y = 0;

            // Right
            if (this.direction === 'right') {
                x = this.player.position.x + distance * Math.sin(this.theta);
                y = this.player.position.y - distance * Math.cos(this.theta);
            }

            // Top
            if (this.direction === 'top') {
                x = this.player.position.x - distance * Math.cos(this.theta);
                y = this.player.position.y - distance * Math.sin(this.theta);
            }

            // Bottom
            if (this.direction === 'bottom') {
                x = this.player.position.x + distance * Math.cos(this.theta);
                y = this.player.position.y + distance * Math.sin(this.theta);
            }

            // Left
            if (this.direction === 'left') {
                x = this.player.position.x - distance * Math.sin(this.theta);
                y = this.player.position.y + distance * Math.cos(this.theta);
            }
            bullet.position.set(x, y);
        });

        if (this.theta >= 2 * Math.PI / 3) {
            this.theta = 0;

            for (let i = 0; i < this.bullets.length; i++) {
                let bullet = this.bullets[i];
                this.level.removeChild(bullet);
            }
            this.bullets = [];
        }
    }
}
