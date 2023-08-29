import  * as PIXI from 'pixi.js';

export function bulletHitTest({bullets, zombies, bulletRadius, zombieRadius}) {
    bullets.forEach(bullet => {
        zombies.forEach((zombie, index) => {
            let dx = zombie.position.x - bullet.position.x;
            let dy = zombie.position.y - bullet.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bulletRadius + zombieRadius) {
                zombies.splice(index, 1);
                zombie.kill();
            }
        })
    })
}

// export function createScene(sceneText, app) {
//     const sceneContainer = new PIXI.Container();
//     const text = new PIXI.Text(sceneText)
//     text.x = app.screen.width / 2;
//     text.y = 0;
//     text.anchor.set(0, 5, 0);
//     sceneContainer.zIndex = 1;
//     sceneContainer.addChild(text);
//     app.stage.addChild(sceneContainer);
//     return sceneContainer;
// }
