import * as PIXI from 'pixi.js';
import gameScreen from './gameScreen.js';

export default class StartScreen {

    constructor(coordinator) {
        this.app = coordinator.app;
        this.coordinator = coordinator;
    }

    onStart(container) {
        const titleText = new PIXI.Text('Pixie Survivors', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 62
        });
        titleText.x = window.innerWidth / 2 - titleText.width / 2;
        titleText.y = 90;

        // Text button to go to gameplay screen
        const gameplayText = new PIXI.Text('Start a new game', {
            fontFamily: 'Roboto Mono',
            fill: 0x000000,
            fontSize: 24
        });
        gameplayText.x = window.innerWidth / 2 - gameplayText.width / 2;
        gameplayText.y = window.innerHeight / 2 - gameplayText.height / 2;
        // These options make the text clickable
        gameplayText.buttonMode = true;
        gameplayText.interactive = true;
        // Go to the gameplay scene when clicked
        gameplayText.on('pointerup', () => {
            this.coordinator.gotoScene(new gameScreen(this.coordinator));
        });

        // Finally we add these elements to the new
        // container provided by the coordinator
        container.addChild(titleText);
        container.addChild(gameplayText);
    }

    // The menu is static so there's not
    // any need for changes on update
    onUpdate(delta) {

    }

    // There isn't anything to teardown
    // when the menu exits
    onFinish() {

    }
}
