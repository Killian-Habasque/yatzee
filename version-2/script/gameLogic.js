import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


import { gameData } from './main.js';

import { initDatGui } from './datGui.js';
import { onDocumentMouseDown } from './eventHandling.js';
// import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, reloadDice, throwDice, alignDiceInLine } from './model/diceLogic.js';
import { render } from './render.js';

const canvasEl = document.querySelector('#canvas');
export let tray = null;
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


    gameData.button = new Button("btn-throw__primary", 'Lancer <svg class="dice one" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.45172" y="0.935488" width="28.0645" height="29" rx="5.6129" fill="white" stroke="#9D301D" stroke-width="1.87097" /><circle cx="15" cy="14.9355" r="3" fill="#9D301D" /><circle cx="9" cy="20.9355" r="3" fill="#9D301D" /><circle cx="21" cy="8.93555" r="3" fill="#9D301D" /></svg ><svg class="dice two" width="31" height="31" viewBox="0 0 31 31" fill="none"xmlns="http://www.w3.org/2000/svg"><rect x="1.45172" y="0.935488" width="28.0645" height="29" rx="5.6129" fill="white" stroke="#9D301D"stroke-width="1.87097" /><circle cx="15" cy="14.9355" r="3" fill="#9D301D" /></svg>', () => { gameData.dice.throwDice();})
    gameData.sheet = new Sheet(() => { gameData.dice.reloadDice(); })
    gameData.tray = new Tray();
    new Floor();
    gameData.dice = new Dice();
    gameData.button.addButton();
    // initDatGui();
    const controls = new OrbitControls(gameData.camera, gameData.renderer.domElement)
    controls.enableDamping = true
    controls.target.y = 0.5

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
                console.log("_____CHARGEMENT DES");
                console.log("_____Attemps :" + gameData.attempts)
                gameData.attempts = gameData.attempts - 1;
                gameData.canRoll = true;
                gameData.button.addButton();
            }
        }, 3000);
    }
    if (gameData.scoreResult.innerHTML === '') {
        gameData.scoreResult.innerHTML += score;
    } else {
        gameData.scoreResult.innerHTML += ('+' + score);
    }
}
