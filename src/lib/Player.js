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

        // const playerWidth = 52;
        // const playerHeight = 64;


        this.player = new PIXI.Container();
        this.player.radius = 30;
        this.player.zIndex = 2;

        this.circle = new PIXI.Graphics();

        this.circle.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.circle.beginFill(0xfff00, 1);
        this.circle.drawCircle(0, 0, this.player.radius);
        this.circle.endFill();

        this.player.addChild(this.circle);
        // this.player.anchor.set(0.5);

        this.player.position.set(level.width / 2, allowedDimensions.height / 2);
        this.player.prevPosition = { x: this.player.position.x, y: this.player.position.y };
        // this.player.width = playerWidth;
        // this.player.height = playerHeight;
        this.player.speed = 3;
        this.player.runSpeed = 1;
        this.controls = new Controls();

        this.level.addChild(this.player);
        this.shooting = new Shooting({app:this.app, level:this.level, player:this, allowedDimensions});
        this.slashing = new Slashing({app:this.app, level:this.level, player:this, allowedDimensions});
        this.lastMouseButton = 0;
        this.lastKeyButton = 0;

        this.player.maxHealth = 100;
        this.player.health = this.player.maxHealth;

        this.player.kills = 0;


        this.animations = {};

        this.animator = new Animator();


        PIXI.Assets.load('../assets/archer.json').then(sheet => {

            this.animations['idle'] = this.animator.createAnimation('idle', 0.1, sheet);
            this.animations['jump'] = this.animator.createAnimation('jump',0.2, sheet);
            this.animations['walk'] = this.animator.createAnimation('walk',0.2, sheet);
            this.animations['run'] = this.animator.createAnimation('run',0.2, sheet);
            this.animations['attack'] = this.animator.createAnimation('attack',0.15, sheet);
            this.animations['shot'] = this.animator.createAnimation('shot',0.4, sheet);
            this.animations['shot2'] = this.animator.createAnimation('shot2',0.4, sheet);
            this.animations['dead'] = this.animator.createAnimation('dead',0.1, sheet);
            this.animations['hurt'] = this.animator.createAnimation('hurt',0.001, sheet);

            this.player.addChild(this.animations['idle']);
            this.player.addChild(this.animations['jump']);
            this.player.addChild(this.animations['walk']);
            this.player.addChild(this.animations['run']);
            this.player.addChild(this.animations['attack']);
            this.player.addChild(this.animations['shot']);
            this.player.addChild(this.animations['shot2']);
            this.player.addChild(this.animations['dead']);
            this.player.addChild(this.animations['hurt']);
        });

    }

    get kills() {
        return this.player.kills;
    }

    get radius() {
        return this.player.radius;
    }

    set kills(kills) {
        this.player.kills = kills;
    }

    set isSlashing(status) {
        this.player.isSlashing = status;
    }

    set isShooting(status) {
        this.player.isShooting = status;
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

    get direction() {
        return this.player.direction;
    }

    get moving() {
        return this.player.moving;
    }

    attacked() {
        this.player.health -= 1;
        this.player.hurt = true;

        if(this.player.health <= 0) {
            this.dead = true;
        }
    }

    move(delta) {
        const keys = this.controls.getInput();
        // console.log(keys);

        let velocity = this.player.speed * delta;

        if (keys.shift) {
            velocity = this.player.speed + this.player.runSpeed * delta;
            this.player.running = true;
        } else {
            this.player.running = false;
        }

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

        //determine moving state and direction
        if (this.player.position.x !== this.player.prevPosition.x || this.player.position.y !== this.player.prevPosition.y) {

            this.player.moving = true;

            if (this.player.position.x > this.player.prevPosition.x) {
                this.player.direction = 'right';
            }

            if (this.player.position.x < this.player.prevPosition.x) {
                this.player.direction = 'left';
            }

            if (this.player.position.y > this.player.prevPosition.y) {
                this.player.direction = 'bottom';
            }

            if (this.player.position.y < this.player.prevPosition.y) {
                this.player.direction = 'top';
            }
        } else {
            this.player.moving = false;
        }
    }

    updateAnimations() {

        if(this.player.isShooting){

            if (this.player.direction === 'left') {
                this.animator.play(this.animations['shoot'], {
                    scale: {
                        x: -1
                    }
                });
            } else if (this.player.direction === 'right') {
                this.animator.play(this.animations['shoot'], {
                    scale: {
                        x: 1
                    }
                });
            } else if (this.player.direction === 'top' || this.player.direction === 'bottom') {
                this.animator.play(this.animations['shoot']);
            }

        } else if(this.player.isSlashing){

            if (this.player.direction === 'left') {
                this.animator.play(this.animations['attack'], {
                    scale: {
                        x: -1
                    }
                });
            } else if (this.player.direction === 'right') {
                this.animator.play(this.animations['attack'], {
                    scale: {
                        x: 1
                    }
                });
            } else if (this.player.direction === 'top' || this.player.direction === 'bottom') {
                this.animator.play(this.animations['attack']);
            }

        } else if (this.player.hurt) {
            this.animator.play(this.animations['hurt']);
            setTimeout(() => {
                this.player.hurt = false;
            }, 200);
        } else if (this.player.health <= 0) {
            this.animator.play(this.animations['dead']);
        } else if (this.player.running && this.player.moving) {
            if (this.player.direction === 'left') {
                this.animator.play(this.animations['run'], {
                    scale: {
                        x: -1
                    }
                });
            } else if (this.player.direction === 'right') {
                this.animator.play(this.animations['run'], {
                    scale: {
                        x: 1
                    }
                });
            } else if (this.player.direction === 'top' || this.player.direction === 'bottom') {
                this.animator.play(this.animations['run']);
            }
        } else if (this.player.moving) {
            if (this.player.direction === 'left') {
                this.animator.play(this.animations['walk'], {
                    scale: {
                        x: -1
                    }
                });
            } else if (this.player.direction === 'right') {
                this.animator.play(this.animations['walk'], {
                    scale: {
                        x: 1
                    }
                });
            } else if (this.player.direction === 'top' || this.player.direction === 'bottom') {
                this.animator.play(this.animations['walk']);
            }
        } else {
            this.animator.play(this.animations['idle']);
        }
    }
    update(delta) {

        if (!this.dead) {
            this.move(delta);
        }

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





        this.updateAnimations(delta);

    }
}

export default Character;
