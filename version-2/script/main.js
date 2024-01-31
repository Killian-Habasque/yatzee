import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import { initPhysics, initScene, updateSceneSize } from './gameLogic.js';
import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, reloadDice, throwDice, alignDiceInLine } from './model/diceLogic.js';

// import { throwDice } from './model/diceLogic.js';
import { render } from './render.js';
import Sheet from './model/Sheet.js';

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
    tour: 0,
    canSelect: false,
    canRoll: true,
    sheet: new Sheet(() => { reloadDice();}),

    params: {
        numberOfDice: 5,
        segments: 40,
        edgeRadius: .07,
        notchRadius: .12,
        notchDepth: .1,
        rectangle: {
            width: 10,
            height: 2,
            positionX: 2,
            positionY: -6,
            positionZ: -5,
        },
    },
};



initPhysics();
initScene();

window.addEventListener('resize', updateSceneSize);
document.getElementById('roll-btn').addEventListener('click', throwDice);

render();