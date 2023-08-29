import * as PIXI from 'pixi.js';
import Victor from 'victor';

export default class Zombie {
    constructor(app, level, player, allowedDimensions) {
        this.app = app;
        this.level = level;
        this.player = player;
        this.allowedDimensions = allowedDimensions;

        let radius = 16;
        this.speed = 2;
        this.zombie = new PIXI.Graphics();
        let r  = this.randomSpawnPoint();
        this.zombie.position.set(r.x, r.y);
        this.zombie.beginFill(0xFF0000, 1);
        this.zombie.drawCircle(0, 0, radius);
        this.zombie.endFill();
        this.level.addChild(this.zombie);
    }

    randomSpawnPoint() {
        let edge = Math.floor(Math.random() * 4);
        let spawnPoint = new Victor(0, 0);

        // console.log(this.level.width, this.app.stage.width)

        switch (edge) {
            case 0://top
                spawnPoint.x = this.allowedDimensions.width * Math.random() - this.zombie.width;
                spawnPoint.y = 0;
                break;
            case 1://right
                spawnPoint.x = this.allowedDimensions.width - this.zombie.width;
                spawnPoint.y = this.allowedDimensions.height * Math.random() - this.zombie.height;
                break;
            case 2://bottom
                spawnPoint.x = this.allowedDimensions.width * Math.random()  - this.zombie.height;
                spawnPoint.y = this.allowedDimensions.height;
                break;
            case 3://left
                spawnPoint.x = 0;
                spawnPoint.y = this.allowedDimensions.height * Math.random();
                break;
            default:
                break;
        }

        return spawnPoint;
    }

    attackPlayer() {
        if (this.attacking) return;

        this.attacking = true;
        this.interval = setInterval(() => this.player.attacked(), 500);
    }

    update(delta) {
        let e = new Victor(this.zombie.position.x, this.zombie.position.y);
        let s = new Victor(this.player.position.x, this.player.position.y);

        if (e.distance(s) < this.player.width / 2) {
            this.attackPlayer();
            return;
        }

        let d = s.subtract(e);
        let v = d.normalize().multiplyScalar(this.speed * delta);
        this.zombie.position.set(this.zombie.position.x + v.x, this.zombie.position.y + v.y);
    }

    kill() {
        this.level.removeChild(this.zombie);
        clearInterval(this.interval);
        this.player.kills++;
    }

    get position() {
        return this.zombie.position;
    }
}
