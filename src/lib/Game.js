import * as PIXI from 'pixi.js';
import startScreen from './screens/startScreen.js';

export default class Game {

    constructor(window, body) {
        // Adjust the resolution for retina screens; along with
        // the autoDensity this transparently handles high resolutions
        PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

        this.stageWidth = window.innerWidth;
        this.stageHeight = window.innerHeight;


        // The PixiJS application instance
        this.app = new PIXI.Application({
            width: this.stageWidth,
            height: this.stageHeight,
            resizeTo: false,
            // resizeTo: window, // Auto fill the screen
            // autoDensity: true, // Handles high DPI screens
            backgroundColor: 0xffffff
        });


        // Add application canvas to body
        body.appendChild(this.app.view);

        // Add a handler for the updates
        this.app.ticker.add((delta) => {
            this.update(delta)
        });

        this.gotoScene(new startScreen(this))
    }


    gotoScene(newScene) {
        if (this.currentScene !== undefined) {
            this.currentScene.onFinish();
            this.app.stage.removeChildren();
        }

        // This is the stage for the new scene
        const container = new PIXI.Container();
        container.width = this.stageWidth;
        container.height = this.stageHeight;

        // Start the new scene and add it to the stage
        newScene.onStart(container);
        this.app.stage.addChild(container);
        this.currentScene = newScene;
    }


    update(delta) {
        if (this.currentScene !== undefined) {
            this.currentScene.onUpdate(delta);
        }
    }
}
