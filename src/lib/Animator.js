import * as PIXI from 'pixi.js';

export default class Animator {
    constructor() {

    }

    createAnimation(name, speed, sheet) {
        let anim = new PIXI.AnimatedSprite(sheet.animations[name]);

        anim.anchor.set(0.5);
        anim.animationSpeed = speed;
        anim.renderable = false;
        return anim;
    }


    play(anim, opts = false, cb) {
        if (anim) {
            // Stop the current animation
            if (this.currentAnimation) {
                this.currentAnimation.stop();
                this.currentAnimation.renderable = false;
            }

            anim.play();
            anim.renderable = true;
            this.currentAnimation = anim;

            if (opts) {
                this.applyOptions(anim, opts);
            }

            if (cb) {
                anim.onComplete = cb();
            }
        }
    }

    applyOptions(target, opts) {
        for (const key in opts) {
            if (opts.hasOwnProperty(key)) {
                if (typeof opts[key] === 'object' && !Array.isArray(opts[key])) {
                    this.applyOptions(target[key], opts[key]);
                } else {
                    target[key] = opts[key];
                }
            }
        }
    }
}
