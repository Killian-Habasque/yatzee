import { GameInstance } from './gameLogic.js';

export let gameData = {
    renderer: null,
    scene: null,
    camera: null,
    physicsWorld: null,

    diceArray: [],
    diceArraySelected: [],

    scoreSelected: [],
    scoreResult: document.querySelector('#score-result'),
    scoreGlobal: [],
    maxAttempts: 3,
    attempts: 0,
    turn: 1,

    sheet: null,
    button: null,
    dice: null,
    tray: null,

    brake: null,
    cup: null,
};

GameInstance();