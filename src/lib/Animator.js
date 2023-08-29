import * as PIXI from 'pixi.js';

export default class Animator {
    constructor() {
        this.animations = {};
        this.runningAnimation = null;
    }

    async loadAssets(spritesheet) {
        await PIXI.Assets.load(spritesheet);
    }

    createAnimation(prefix, frameCount, speed) {
        const frames = [];

        for (let i = 1; i < frameCount; i++) {
            frames.push(PIXI.Texture.from(`${prefix}_${i}.png`));
        }

        const anim = new PIXI.AnimatedSprite(frames);
        anim.zIndex = 10;

        anim.anchor.set(0.5);
        anim.animationSpeed = speed;
        anim.renderable = false;
        this.animations[prefix] = anim;
    }

    parseAnimation(name) {
        if (this.animations[name]) {
            return this.animations[name];
        }
    }

    playAnimation(name, opts = false, cb) {
        const anim = this.animations[name];

        if (anim) {
            // Stop the currently running animation
            if (this.runningAnimation) {
                this.stopAnimation(this.runningAnimation);
            }

            anim.play();
            anim.renderable = true;
            this.runningAnimation = name;

            if (opts) {
                this.applyOptions(anim, opts);
            }

            if (cb) {
                anim.onComplete = cb;
            }

            // console.log('playing: ', name);
        }
    }

    stopAnimation(name) {
        const anim = this.animations[name];

        if (anim) {
            anim.stop();
            anim.renderable = false;
            this.runningAnimation = null;

            // console.log('stopping: ', name);
        }
    }

    pauseAnimation(name) {
        if (this.animations[name]) {
            this.animations[name].stop();
            this.animations[name].renderable = false;
        }
    }

    resumeAnimation(name) {
        if (this.animations[name]) {
            this.animations[name].play();
            this.animations[name].renderable = true;
        }
    }

    pauseCurrent() {
        this.pauseAnimation(this.runningAnimation);
    }

    resumeCurrent() {
        this.playAnimation(this.runningAnimation);
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
