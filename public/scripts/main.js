import { GameInstance } from './gameLogic.js';

import * as THREE from 'three';
import Label from './class/hud/Label.js';
import * as TWEEN from 'tween';

export let gameData = {
    renderer: null,
    scene: null,
    camera: null,
    physicsWorld: null,

    diceArray: [],
    diceArraySelected: [],
    dicePositionSelected: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
    },
    scoreSelected: [],
    scoreGlobal: [],
    maxAttempts: 3,
    attempts: 0,
    turn: 1,
    brake: null,

    dashboard: null,
    sheet: null,
    button: null,
    dice: null,
    models: null,
    cup: null,
    landing: null,
    music: null,
};


export function initGame() {
    const content = document.querySelector(".content");
    content.style.display = "none";

    const header = document.querySelector(".header");
    header.classList.toggle('in-game')

    const quitButtons = document.querySelectorAll('#quitButton');

    quitButtons.forEach(quitButton => {
        quitButton.addEventListener('click', () => {
            gameData.landing.reshowLanding(removeGame);
            // removeGame();
        });
    });

    const retryButtons = document.querySelectorAll('#retryButton');

    retryButtons.forEach(retryButton => {
        retryButton.addEventListener('click', () => {
            removeGame()
            gameData.landing.removeFinalScore()
            initGame()
        });
    });

    GameInstance();
}


function removeGame() {
    const header = document.querySelector(".header");
    header.classList.remove('in-game')

    clearTimeout()

    // Stop all TWEEN animations
    TWEEN.removeAll();

    // Dispose and remove all objects from the scene
    while (gameData.scene.children.length > 0) {
        const obj = gameData.scene.children[0];
        gameData.scene.remove(obj);

        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (obj.material instanceof Array) {
                obj.material.forEach(material => material.dispose());
            } else {
                obj.material.dispose();
            }
        }
    }

    // Remove all physics bodies
    gameData.physicsWorld.bodies.forEach(body => {
        gameData.physicsWorld.removeBody(body);
    });

    // Reset game data
    gameData.diceArray = [];
    gameData.diceArraySelected = [];
    gameData.dicePositionSelected = {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
    };
    gameData.scoreSelected = [];
    gameData.scoreGlobal = [];
    gameData.maxAttempts = 3;
    gameData.attempts = 0;
    gameData.turn = 1;
    gameData.brake = null;
    Label.remove();
    gameData.button.removeButton()
    gameData.dashboard = null;
    if (gameData.sheet) gameData.sheet.clearSheet();

    gameData.dice = null;
    gameData.models = null;
    gameData.cup = null;
    gameData.music = null;


}

