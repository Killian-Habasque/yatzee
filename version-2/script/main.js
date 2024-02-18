import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import { initPhysics, initScene, updateSceneSize } from './gameLogic.js';
// import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, reloadDice, throwDice, alignDiceInLine } from './model/diceLogic.js';

// import { throwDice } from './model/diceLogic.js';
import { render } from './render.js';

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
    turn: 0,
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



initPhysics();
initScene();

window.addEventListener('resize', updateSceneSize);


render();