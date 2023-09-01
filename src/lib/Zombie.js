import * as PIXI from 'pixi.js';
import Victor from 'victor';
import Animator from "./Animator.js";

export default class Zombie {
    constructor(app, level, player, allowedDimensions) {
        this.app = app;
        this.level = level;
        this.player = player;
        this.allowedDimensions = allowedDimensions;

        this.zombie = new PIXI.Graphics();
        this.zombie.radius = 16;
        this.zombie.speed = 2;
        let r  = this.randomSpawnPoint();
        this.zombie.position.set(r.x, r.y);
        this.zombie.prevPosition = { x: this.zombie.position.x, y: this.zombie.position.y };
        this.zombie.beginFill(0xffffff, 0);
        this.zombie.drawCircle(0, 0, this.zombie.radius);
        this.zombie.endFill();
        this.level.addChild(this.zombie);


        this.animations = {};

        this.animator = new Animator();


        PIXI.Assets.load('../assets/fairy.json').then(sheet => {

            this.animations['fairy-top'] = this.animator.createAnimation('fairy-top', 0.1, sheet);
            this.animations['fairy-down'] = this.animator.createAnimation('fairy-down', 0.1, sheet);
            this.animations['fairy-left'] = this.animator.createAnimation('fairy-left', 0.1, sheet);
            this.animations['fairy-right'] = this.animator.createAnimation('fairy-right', 0.1, sheet);

            this.zombie.addChild(this.animations['fairy-top']);
            this.zombie.addChild(this.animations['fairy-down']);
            this.zombie.addChild(this.animations['fairy-left']);
            this.zombie.addChild(this.animations['fairy-right']);

        });
    }

    get radius() {
        return this.zombie.radius;
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

    get prevPosition() {
        return this.zombie.prevPosition;
    }

    attackPlayer() {
        if (this.attacking) return;

        this.attacking = true;
        this.interval = setInterval(() => this.player.attacked(), 500);
    }

    update(delta) {

        this.zombie.prevPosition = this.zombie.position.clone();

        let e = new Victor(this.zombie.position.x, this.zombie.position.y);
        let s = new Victor(this.player.position.x, this.player.position.y);

        if (e.distance(s) - this.zombie.radius < this.player.radius) {
            this.attackPlayer();
            return;
        } else {
            this.attacking = false;
            clearInterval(this.interval);
        }

        let d = s.subtract(e);
        let v = d.normalize().multiplyScalar(this.zombie.speed * delta);
        this.zombie.position.set(this.zombie.position.x + v.x, this.zombie.position.y + v.y);


        if (this.zombie.position.x > this.zombie.prevPosition.x) {
            this.zombie.direction = 'right';

            this.animator.play(this.animations['fairy-right']);
        } else if (this.zombie.position.x < this.zombie.prevPosition.x) {
            this.zombie.direction = 'left';

            this.animator.play(this.animations['fairy-left']);
        } else if (this.zombie.position.y > this.zombie.prevPosition.y) {
            this.zombie.direction = 'bottom';
            this.animator.play(this.animations['fairy-down']);
        } else if (this.zombie.position.y < this.zombie.prevPosition.y) {
            this.zombie.direction = 'top';
            this.animator.play(this.animations['fairy-top']);
        }

        // console.log(this.zombie.direction);
    }

    touched() {
        this.killed();
    }

    killed() {
        this.level.removeChild(this.zombie);
        clearInterval(this.interval);
        this.player.kills++;
    }

    get position() {
        return this.zombie.position;
    }
}
