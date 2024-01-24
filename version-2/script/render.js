import * as THREE from 'three';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';

import { gameData } from './main.js';

/*
Rendu de la scene
*/
export function render() {
    gameData.physicsWorld.fixedStep();

    for (const dice of gameData.diceArray) {
        dice.mesh.position.copy(dice.body.position)
        dice.mesh.quaternion.copy(dice.body.quaternion)
    }
    for (const dice of gameData.diceArraySelected) {
        dice.mesh.position.copy(dice.body.position)
        dice.mesh.quaternion.copy(dice.body.quaternion)
    }

    TWEEN.update();
    gameData.renderer.render(gameData.scene, gameData.camera);
    requestAnimationFrame(render);
}


