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


        this.theta = 0;

    }

    fire() {
        if (this.bullets.length < this.maxBullets) {
            for (let i = 0; i < this.maxBullets; i++) {
                this.theta = 0;
                const dot = new PIXI.Graphics();
                dot.beginFill(0Xffffff, 0);
                dot.drawCircle(0, 0, this.bulletRadius);
                dot.endFill();
                this.bullets.push(dot);
                this.level.addChild(dot);
            }
            this.player.isSlashing = true;
        }
    }

    set slash(shooting) {
        if(shooting) {
            this.fire();
            this.interval = setInterval(() => this.fire(), 500);
        } else {
            clearInterval(this.interval);
            this.player.isSlashing = false;
        }
    }

    update(delta) {

        this.theta += this.bulletVelocity * delta;


        this.bullets.forEach((bullet, bulletIndex) => {

            const distance = (bulletIndex + this.bulletVelocity) * (this.circleRadius / this.maxBullets);
            let x, y = 0;

            // Right
            if (this.player.direction === 'right') {
                x = this.player.position.x + distance * Math.sin(this.theta);
                y = this.player.position.y - distance * Math.cos(this.theta);
            }
            else
            // Top
            if (this.player.direction === 'top') {
                x = this.player.position.x - distance * Math.cos(this.theta);
                y = this.player.position.y - distance * Math.sin(this.theta);
            }
            else
            // Bottom
            if (this.player.direction === 'bottom') {
                x = this.player.position.x + distance * Math.cos(this.theta);
                y = this.player.position.y + distance * Math.sin(this.theta);
            }
            else
            // Left
            if (this.player.direction === 'left') {
                x = this.player.position.x - distance * Math.sin(this.theta);
                y = this.player.position.y + distance * Math.cos(this.theta);
            }
            else {
                x = this.player.position.x + distance * Math.sin(this.theta);
                y = this.player.position.y - distance * Math.cos(this.theta);
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
