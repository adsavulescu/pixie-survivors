import * as PIXI from 'pixi.js';
import Shooting from "./Shooting.js";
import Slashing from "./Slashing.js";
import Controls from "./Controls.js";
import Animator from "./Animator.js";

class Character {
    constructor(app, level, allowedDimensions) {
        this.app = app;
        this.level = level;
        this.allowedDimensions = allowedDimensions;

        const playerWidth = 26;
        const playerHeight = 32;

        this.player = new PIXI.Container();
        // this.player.anchor.set(0.5);

        this.player.position.set(level.width / 2, allowedDimensions.height / 2);
        this.player.prevPosition = { x: this.player.position.x, y: this.player.position.y };
        this.player.width = playerWidth;
        this.player.height = playerHeight;
        this.player.speed = 5;
        this.controls = new Controls();

        this.level.addChild(this.player);
        this.shooting = new Shooting({app:this.app, level:this.level, player:this, allowedDimensions});
        this.slashing = new Slashing({app:this.app, level:this.level, player:this, allowedDimensions});
        this.lastMouseButton = 0;
        this.lastKeyButton = 0;

        this.player.maxHealth = 100;
        this.player.health = this.player.maxHealth;

        this.player.kills = 0;


        this.walkAnim = null;
        this.idleAnim = null;

        this.animator = new Animator();
        this.animator.loadAssets('../assets/wizard.json').then(r => {
            this.animator.createAnimation('idle', '6', 0.1);
            this.animator.createAnimation('jump', '11', 0.2);
            this.animator.createAnimation('walk', '7', 0.2);
            this.animator.createAnimation('run', '8', 0.2);
            this.animator.createAnimation('attack', '10', 0.2);
            this.animator.createAnimation('dead', '5', 0.1);
            this.animator.createAnimation('hurt', '4', 0.1);


            this.player.addChild(this.animator.parseAnimation('idle'));
            this.player.addChild(this.animator.parseAnimation('jump'));
            this.player.addChild(this.animator.parseAnimation('walk'));
            this.player.addChild(this.animator.parseAnimation('run'));
            this.player.addChild(this.animator.parseAnimation('attack'));
            this.player.addChild(this.animator.parseAnimation('dead'));
            this.player.addChild(this.animator.parseAnimation('hurt'));

            this.animator.playAnimation('idle');
        });
    }

    get kills() {
        return this.player.kills;
    }

    set kills(kills) {
        this.player.kills = kills;
    }


    get maxHealth() {
        return this.player.maxHealth;
    }

    get health() {
        return this.player.health;
    }

    get position() {
        return this.player.position;
    }

    get prevPosition() {
        return this.player.prevPosition;
    }

    get width() {
        return this.player.width;
    }

    get height() {
        return this.player.height;
    }

    attacked() {
        this.player.health -= 1;

        // this.animator.pauseCurrent();
        // this.animator.playAnimation('hurt', false, () => {
        //     setTimeout(() => {
        //         this.animator.stopAnimation('hurt');
        //         this.animator.resumeCurrent();
        //         console.log('???');
        //     }, 500);
        // });

        if(this.player.health <= 0) {
            this.dead = true;
        }
    }

    move(delta) {
        const keys = this.controls.getInput();
        const velocity = this.player.speed * delta;

        this.player.prevPosition = this.player.position.clone();

        if (keys.w && (this.player.position.y - this.player.height / 2) > 0) {
            this.player.position.y -= velocity;
        }
        if (keys.a && (this.player.position.x - this.player.width / 2) > 0) {
            this.player.position.x -= velocity;
        }
        if (keys.s && (this.player.position.y + this.player.height / 2) < this.allowedDimensions.height) {
            this.player.position.y += velocity;
        }
        if (keys.d && (this.player.position.x + this.player.width / 2) < this.allowedDimensions.width) {
            this.player.position.x += velocity;
        }
    }

    updateAnimations(delta){
        if (this.player.position.x !== this.player.prevPosition.x || this.player.position.y !== this.player.prevPosition.y) {

            this.animator.stopAnimation('idle');


            if (this.player.position.x > this.player.prevPosition.x) {
                this.animator.playAnimation('walk', {
                    scale: {
                        x: 1
                    }
                });
            }

            if (this.player.position.x < this.player.prevPosition.x) {
                this.animator.playAnimation('walk', {
                    scale: {
                        x: -1
                    }
                });
            }

            if (this.player.position.y > this.player.prevPosition.y) {
                this.animator.playAnimation('walk');
            }

            if (this.player.position.y < this.player.prevPosition.y) {
                this.animator.playAnimation('walk');
            }

        } else {
            this.animator.stopAnimation('walk');
            this.animator.playAnimation('idle');
        }
    }
    getDirection() {
        let playerStatus = {
            moving:false,
            direction:null,
        }
        if (this.player.position.x !== this.player.prevPosition.x || this.player.position.y !== this.player.prevPosition.y) {

            playerStatus.moving = true;

            if (this.player.position.x > this.player.prevPosition.x) {
                playerStatus.direction = 'right';
            }

            if (this.player.position.x < this.player.prevPosition.x) {
                playerStatus.direction = 'left';
            }

            if (this.player.position.y > this.player.prevPosition.y) {
                playerStatus.direction = 'bottom';
            }

            if (this.player.position.y < this.player.prevPosition.y) {
                playerStatus.direction = 'top';
            }
        }

        return playerStatus;
    }
    update(delta) {

        this.move(delta);

        this.updateAnimations(delta);

        const mouse = this.app.renderer.plugins.interaction.pointer;
        // const cusorPosition = mouse.global;
        //
        // let angle = Math.atan2(
        //     cusorPosition.y - this.player.position.y,
        //     cusorPosition.x - this.player.position.x,
        // ) +
        // Math.PI / 2;
        //
        // this.player.rotation = angle;

        if(mouse.buttons !== this.lastMouseButton){
            this.shooting.shoot = mouse.buttons !== 0;
            this.lastMouseButton = mouse.buttons;
        }
        this.shooting.update(delta);



        const keys = this.controls.getInput();

        if(keys.space !== this.lastKeyButton){
            this.slashing.slash = keys.space;
            this.lastKeyButton = keys.space;
        }
        this.slashing.update(delta);
    }
}

export default Character;
