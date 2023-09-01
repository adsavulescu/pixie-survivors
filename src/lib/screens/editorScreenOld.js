import * as PIXI from 'pixi.js';

export default class StartScreen {

    constructor(coordinator) {
        this.app = coordinator.app;
        this.coordinator = coordinator;
    }

    onStart(container) {

        this.allowedDimensions = {
            width: window.innerWidth,
            height: window.innerHeight - window.innerHeight / 4
        }

        this.texturesAreaDimensions = {
            width: window.innerWidth,
            height: window.innerHeight / 4
        }


        this.app.renderer.view.width = 800;
        this.app.renderer.view.height = 600;

        this.playArea = new PIXI.Container();
        container.addChild(this.playArea);


        // this.playArea.backgroundColor = 0xffffff;


        // this.playArea = new PIXI.Graphics();
        // this.playArea.width = this.allowedDimensions.width;
        // this.playArea.height = this.allowedDimensions.height;
        this.playArea.x = 0;
        this.playArea.y = 0;
        // this.playArea.lineStyle(2, 0x000000, 1);
        // this.playArea.drawRect(0, 0, this.playArea.width, this.playArea.height);

        // this.texturesArea = new PIXI.Container();
        // this.texturesArea.width = this.texturesAreaDimensions.width;
        // this.texturesArea.height = this.texturesAreaDimensions.height;
        // this.texturesArea.x = 0;
        // this.texturesArea.y = window.innerHeight - window.innerHeight / 4;

        container.addChild(this.playArea);
        // container.addChild(this.texturesArea);

        PIXI.Assets.load('../assets/tiles.json').then(sheet => {

            // const sheet = resources['../assets/tiles.json'].spritesheet;
            const tileSize = 32;
            const rows = this.texturesAreaDimensions.height / tileSize;
            const cols = this.texturesAreaDimensions.width / tileSize;
            let selectedTile = null;

            // for (let i = 0; i < rows; i++) {
            //     for (let j = 0; j < cols; j++) {
            //
            //         const randomNumber = Math.floor(Math.random() * Object.keys(sheet.textures).length) + 1;
            //         const numberWithLeadingZero = randomNumber < 10 ? '0' + randomNumber : randomNumber;
            //
            //         let name = `Tileset_${numberWithLeadingZero}.png`;
            //         let tile = new PIXI.Sprite(sheet.textures[name]);
            //         tile.name = name;
            //
            //         tile.interactive = true;
            //         tile.buttonMode = true;
            //
            //         tile.on('pointerdown', (event) => {
            //             const tile = event.currentTarget;
            //
            //             if (selectedTile && selectedTile.border) {
            //                 selectedTile.removeChild(selectedTile.border);
            //                 selectedTile.borderShown = false;
            //             }
            //
            //             const border = new PIXI.Graphics();
            //             border.lineStyle(2, 0xFF0000, 1);
            //             border.drawRect(0, 0, tile.width, tile.height);
            //             tile.addChild(border);
            //             tile.border = border;
            //             tile.borderShown = true;
            //
            //             selectedTile = tile;
            //         });
            //
            //         tile.x = j * tileSize;
            //         tile.y = i * tileSize;
            //
            //         this.texturesArea.addChild(tile);
            //     }
            // }

            const rows2 = this.allowedDimensions.height / tileSize;
            const cols2 = this.allowedDimensions.width / tileSize;

            for (let i = 0; i < rows2; i++) {
                for (let j = 0; j < cols2; j++) {

                    let tile = new PIXI.Graphics();
                    tile.lineStyle(1, 0x000000, 1);
                    tile.drawRect(0, 0, tileSize, tileSize);

                    tile.interactive = true;
                    tile.buttonMode = true;

                    tile.hitArea = new PIXI.Rectangle(0, 0, tileSize, tileSize);

                    tile.x = j * tileSize;
                    tile.y = i * tileSize;

                    this.playArea.addChild(tile);

                    tile.on('pointerdown', (event) => {

                        if (!selectedTile) return;

                        if (tile.spriteAdded) {
                            tile.removeChild(tile.spriteAdded);
                            tile.spriteAdded = null;
                        } else {
                            const sprite = new PIXI.Sprite(sheet.textures[selectedTile.name]);
                            tile.addChild(sprite);
                            tile.spriteAdded = sprite;
                        }
                    });
                }
            }

        });

        window.addEventListener('keydown', this.onKeyDown.bind(this));

    }


    onKeyDown(event) {
        const speed = 5;
        switch (event.key) {
            case 'ArrowUp':
                this.playArea.y += speed;
                break;
            case 'ArrowDown':
                this.playArea.y -= speed;
                break;
            case 'ArrowLeft':
                this.playArea.x += speed;
                break;
            case 'ArrowRight':
                this.playArea.x -= speed;
                break;
        }
    }

    onUpdate(delta) {

    }

    onFinish() {

    }
}
