import * as PIXI from 'pixi.js';
import Victor from 'victor';

export default class Shooting {
    constructor({app, level, player, allowedDimensions}) {
        this.app = app;
        this.level = level;
        this.player = player;
        this.allowedDimensions = allowedDimensions;
        this.bulletSpeed = 4;
        this.bullets = [];
        this.bulletRadius = 8;
        this.maxBullets = 3;
    }

    fire() {
        const bullet = new PIXI.Graphics();
        bullet.position.set(this.player.position.x, this.player.position.y);
        bullet.beginFill(0X0000ff, 1);
        bullet.drawCircle(0, 0, this.bulletRadius);
        bullet.endFill();

        let dx = this.player.position.x - this.player.prevPosition.x;
        let dy = this.player.position.y - this.player.prevPosition.y;

        let angle = Math.atan2(dy, dx);
        bullet.velocity = new Victor(Math.cos(angle), Math.sin(angle)).multiplyScalar(this.bulletSpeed);
        this.bullets.push(bullet);
        this.level.addChild(bullet);
    }

    set shoot(shooting) {
        if(shooting) {
            this.fire();
            this.interval = setInterval(() => this.fire(), 500);
        } else {
            clearInterval(this.interval);
        }
    }

    update(delta) {
        this.bullets.forEach((bullet, bulletIndex) => {

            bullet.position.set(bullet.position.x + bullet.velocity.x * delta, bullet.position.y + bullet.velocity.y * delta)

            // out of bounds checks
            if ((bullet.position.y - bullet.height / 2) < 0) {
                this.level.removeChild(bullet);
                this.bullets.splice(bulletIndex, 1);
            }

            if ((bullet.position.x - bullet.width / 2) < 0) {
                this.level.removeChild(bullet);
                this.bullets.splice(bulletIndex, 1);
            }

            if ((bullet.position.y + bullet.height / 2) > this.allowedDimensions.height) {
                this.level.removeChild(bullet);
                this.bullets.splice(bulletIndex, 1);
            }

            if ((bullet.position.x + bullet.width / 2) > this.allowedDimensions.width) {
                this.level.removeChild(bullet);
                this.bullets.splice(bulletIndex, 1);
            }

        });
    }
}
