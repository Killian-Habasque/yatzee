import * as THREE from 'three';


import { GameInstance } from './gameLogic.js';


export let gameData = {
    renderer: null,
    scene: null,
    camera: null,
    diceMesh: null,
    physicsWorld: null,

    diceArray: [],
    diceArraySelected: [],

    scoreSelected: [],
    scoreResult: document.querySelector('#score-result'),
    scoreGlobal: [],
    maxAttempts: 3,
    attempts: 0,
    turn: 1,
    canSelect: true,
    canRoll: true,
    sheet: null,
    button: null,
    dice: null,
    tray: null,
    brake: null,
    cup: null,

    params: {
        numberOfDice: 5,
        segments: 40,
        edgeRadius: .07,
        notchRadius: .12,
        notchDepth: .1,
    },
};


GameInstance();