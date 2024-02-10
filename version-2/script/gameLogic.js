import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as THREE from 'three';



import { gameData } from './main.js';

import { initDatGui } from './datGui.js';
import { onDocumentMouseDown } from './eventHandling.js';
// import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, reloadDice, throwDice, alignDiceInLine } from './model/diceLogic.js';
import { render } from './render.js';

const canvasEl = document.querySelector('#canvas');
export let tray =  null;
import Tray from './class/Tray.js';
import Floor from './class/Floor.js';
import Dice from './class/Dice.js';
import Sheet from './class/Sheet.js';
import Button from './class/Button.js';

/*
Création de la scène
*/
export function initScene() {



    gameData.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvasEl
    });
    gameData.renderer.shadowMap.enabled = true
    gameData.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    gameData.scene = new THREE.Scene();

    gameData.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 300)
    gameData.camera.position.set(0, 7, 10);
    gameData.camera.rotation.set(18, 0, 0);

    gameData.dice = new Dice();
    gameData.button = new Button("roll-btn", "Throw the dice", () => { gameData.dice.throwDice();})
    gameData.sheet = new Sheet(() => { gameData.dice.reloadDice();})
    gameData.tray = new Tray();
    new Floor();
    gameData.dice.throwDice();



    initDatGui();

    updateSceneSize();

    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    gameData.scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xffffff, .5);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;
    gameData.scene.add(topLight);

 
    // gameData.diceMesh = createDiceMesh();
    // for (let i = 0; i < gameData.params.numberOfDice; i++) {
    //     gameData.diceArray.push(createDice());
    //     addDiceEvents(gameData.diceArray[i]);
    // }

    // throwDice();
    gameData.sheet.displaySheet();
    window.addEventListener('click', onDocumentMouseDown, false);

    render();
}

/*
Responsive scene
*/
export function updateSceneSize() {
    gameData.camera.aspect = window.innerWidth / window.innerHeight;
    gameData.camera.updateProjectionMatrix();
    gameData.renderer.setSize(window.innerWidth, window.innerHeight);
}


/*
Initialisation de la physique
*/
export function initPhysics() {
    gameData.physicsWorld = new CANNON.World({
        allowSleep: true,
        gravity: new CANNON.Vec3(0, -50, 0),
    })
    gameData.physicsWorld.defaultContactMaterial.restitution = .3;
}


/*
Résultats score en texte
*/
export function showRollResults(score) {
    // console.log("------global")
    // console.log(gameData.scoreGlobal)
    // console.log("------selected")
    // console.log(gameData.scoreSelected)
    gameData.scoreGlobal.push(score)

    clearTimeout(gameData.brake);

    if (gameData.scoreGlobal.length == gameData.diceArray.length) {
        if (gameData.attempts < gameData.maxAttempts) {
            gameData.button.addButton();
        }
        gameData.dice.alignDiceInLine();

    } else {
        gameData.brake = setTimeout(() => {
            if (!gameData.button.existButton() && gameData.scoreGlobal.length !== gameData.diceArray.length) {
                console.log("CHARGEMENT DES");
                gameData.attempts - 1;
                gameData.button.addButton();
            }
        }, 5000);
    }
    if (gameData.scoreResult.innerHTML === '') {
        gameData.scoreResult.innerHTML += score;
    } else {
        gameData.scoreResult.innerHTML += ('+' + score);
    }
}
