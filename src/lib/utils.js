import  * as PIXI from 'pixi.js';

// export function bulletHitTest({bullets, zombies, bulletRadius, zombieRadius}) {
//     bullets.forEach(bullet => {
//         zombies.forEach((zombie, index) => {
//             let dx = zombie.position.x - bullet.position.x;
//             let dy = zombie.position.y - bullet.position.y;
//             let distance = Math.sqrt(dx * dx + dy * dy);
//
//             if (distance < bulletRadius + zombieRadius) {
//                 zombies.splice(index, 1);
//                 zombie.killed();
//             }
//         })
//     })
// }

export function circleHitTest({c1, c2, c1rad, c2rad}) {
    // console.log(c1.length, c2.length);
    if (c1.length && c2.length) {
        c1.forEach(circle1 => {
            c2.forEach((circle2, index) => {
                // console.log(circle2.position, circle1.position.x);
                let dx = circle2.position.x - circle1.position.x;
                let dy = circle2.position.y - circle1.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < c1rad + c2rad) {
                    c2.splice(index, 1);
                    circle2.touched();
                }
            })
        })
    }
}
