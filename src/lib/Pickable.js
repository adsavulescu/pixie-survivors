import * as PIXI from 'pixi.js';
import Animator from "./Animator.js";

class Pickable {
    constructor(app, level, allowedDimensions) {
        this.app = app;
        this.level = level;
        this.allowedDimensions = allowedDimensions;
        this.pickables = [];
        this.pickable = new PIXI.Graphics();
        this.pickable.position.set(this.randomPoint().x, this.randomPoint().y);
        this.pickable.radius = 10;
        this.pickable.lineStyle(0);
        this.pickable.beginFill(0xfff00, 0);
        this.pickable.drawCircle(0, 0, this.pickable.radius);
        this.pickable.endFill();
        this.pickable.zIndex = 2;
        this.level.addChild(this.pickable);


        this.animations = {};

        this.animator = new Animator();

        PIXI.Assets.load('../assets/coin.json').then(sheet => {

            this.animations['coin'] = this.animator.createAnimation('coin',0.3, sheet);

            this.pickable.addChild(this.animations['coin']);
            this.animator.play(this.animations['coin']);
        });
    }

    update(delta) {

    }

    get position () {
        return this.pickable.position;
    }

    touched() {
        this.level.removeChild(this.pickable);
    }

    update(delta) {

    }

    randomPoint() {
        let coords = {
            x:Math.floor(Math.random() * this.allowedDimensions.width) + 1,
            y:Math.floor(Math.random() * this.allowedDimensions.height) + 1,
        }
        return coords;
    }
}

export default Pickable;
