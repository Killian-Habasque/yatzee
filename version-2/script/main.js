import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import { initPhysics, initScene, updateSceneSize } from './gameLogic.js';
import { throwDice } from './model/diceLogic.js';
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


// export let renderer, scene, camera, diceMesh, physicsWorld;
// export let diceArray = [];
// export let diceArraySelected = [];

// export const canvasEl = document.querySelector('#canvas');
// export let scoreResult = document.querySelector('#score-result');
// export let scoreGlobal = [];

// // let isRealignmentInProgress = false;
// // let isRealignmentInProgress2 = false;
// export let canSelect = false;


// export const params = {
//     numberOfDice: 5,
//     segments: 40,
//     edgeRadius: .07,
//     notchRadius: .12,
//     notchDepth: .1,
//     rectangle: {
//         width: 10,
//         height: 2,
//         positionX: 2,
//         positionY: -6,
//         positionZ: -5,
//     },
// };


initPhysics();
initScene();

window.addEventListener('resize', updateSceneSize);
document.getElementById('roll-btn').addEventListener('click', throwDice);

render();