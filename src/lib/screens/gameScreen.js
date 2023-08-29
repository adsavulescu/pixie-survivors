import * as PIXI from 'pixi.js';
import Zombie from '../Zombie.js';
import Player from "../Player.js";
import Spawner from "../Spawner.js";
import { bulletHitTest } from "../utils.js";
import EndScreen from './endScreen.js';

export default class GameScreen {

    constructor(coordinator) {
        this.app = coordinator.app;
        this.coordinator = coordinator;
    }

    onStart(container) {

        this.allowedDimensions = {
            width:window.innerWidth,
            height: window.innerHeight
        }

        //top bar
        // - time
        this.timeText = new PIXI.Text('TIME: ', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 20
        });
        this.timeText.x = 20;
        this.timeText.y = 20;
        container.addChild(this.timeText);

        this.startTime = Date.now();
        this.seconds = 0;


        // - points
        this.pointsText = new PIXI.Text('POINTS: ', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 20
        });
        this.pointsText.x = 300;
        this.pointsText.y = 20;
        container.addChild(this.pointsText);
        this.points = 0;


        // - hp
        this.hpText = new PIXI.Text('HP: ', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 20
        });
        this.hpText.x = 600;
        this.hpText.y = 20;
        container.addChild(this.hpText);
        this.hp = 100;

        // - kills
        this.killsText = new PIXI.Text('Kills: ', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 20
        });
        this.killsText.x = 800;
        this.killsText.y = 20;
        container.addChild(this.killsText);

        // - enemies
        this.enemiesText = new PIXI.Text('Enemies: ', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 20
        });
        this.enemiesText.x = 1000;
        this.enemiesText.y = 20;
        container.addChild(this.enemiesText);

        // - health bar
        this.healthBar = new PIXI.Graphics();
        this.healthBar.beginFill(0xff0000);

        const margin = 16;
        const barHeight = 8;

        this.healthBar.initialWidth = window.innerWidth - 2 * margin;
        this.healthBar.drawRect(
            margin,
            window.innerHeight - barHeight - margin / 2,
            this.healthBar.initialWidth,
            barHeight
        );
        this.healthBar.endFill();
        this.healthBar.zIndex = 1;
        this.app.stage.sortableChildren = true;
        container.addChild(this.healthBar);


        //game area
        this.gameArea = new PIXI.Graphics();
        this.gameArea.lineStyle(2, 0x000000, 1);
        this.gameArea.drawRect(0, 0, this.allowedDimensions.width, this.allowedDimensions.height );

        container.addChild(this.gameArea);

        this.player = new Player(this.app, this.gameArea, this.allowedDimensions);
        this.zSpawner = new Spawner({ create: () => new Zombie(this.app, this.gameArea, this.player, this.allowedDimensions)});

    }


    onUpdate(delta) {
        this.player.update(delta);

        this.zSpawner.spawns.forEach((zombie) => zombie.update(delta));

        bulletHitTest({
            bullets:this.player.shooting.bullets,
            zombies: this.zSpawner.spawns,
            bulletRadius: 8,
            zombieRadius: 16
        });

        bulletHitTest({
            bullets:this.player.slashing.bullets,
            zombies: this.zSpawner.spawns,
            bulletRadius: 8,
            zombieRadius: 16
        });

        this.gameArea.pivot.x = this.player.position.x + 26;
        this.gameArea.pivot.y = this.player.position.y + 37;
        this.gameArea.position.x = window.innerWidth / 2;
        this.gameArea.position.y = window.innerHeight / 2;


        this.enemiesText.text = `Enemies: ${this.zSpawner.spawns.length}`;

        this.timeText.text = `Time: ${this.seconds}`;

        let currentTime = Date.now();
        if (currentTime - this.startTime >= 1000) {
            this.seconds++;
            this.startTime = currentTime;
        }

        this.pointsText.text = `Points: ${this.player.kills * 10}`;

        this.hpText.text = `HP: ${this.player.health}`;

        this.killsText.text = `Kills: ${this.player.kills}`;

        this.healthBar.width = (this.player.health / this.player.maxHealth) * this.healthBar.initialWidth;

        if (this.player.dead) {
            setTimeout(() => {
                this.coordinator.gotoScene(new EndScreen(this.coordinator));
            }, 2000)
        }

    }


    onFinish() {

    }
}
