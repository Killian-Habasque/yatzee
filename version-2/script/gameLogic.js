import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as THREE from 'three';


import { gameData } from './main.js';

import { initDatGui } from './datGui.js';
import { onDocumentMouseDown } from './eventHandling.js';
import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, throwDice, alignDiceInLine } from './model/diceLogic.js';
import { createOrUpdateRectangle, updateRectangle } from './model/trayModel.js';
import { render } from './render.js';
import Sheet from './model/Sheet.js';

const canvasEl = document.querySelector('#canvas');


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

    createFloor();
    gameData.diceMesh = createDiceMesh();
    for (let i = 0; i < gameData.params.numberOfDice; i++) {
        gameData.diceArray.push(createDice());
        addDiceEvents(gameData.diceArray[i]);
    }


    createOrUpdateRectangle();

    throwDice();

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
Création du plane
*/
export function createFloor() {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.ShadowMaterial({
            opacity: .1
        })
    )
    floor.receiveShadow = true;
    floor.position.y = -7;
    floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
    gameData.scene.add(floor);

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    gameData.physicsWorld.addBody(floorBody);
}


/*
Résultats score en texte
*/
export function showRollResults(score) {
    gameData.scoreGlobal.push(score)

    if (gameData.scoreGlobal.length == gameData.diceArray.length) {
        alignDiceInLine();
        let sheet = new Sheet();
        sheet.compare([...gameData.scoreSelected, ...gameData.scoreGlobal]);
        sheet.displaySheet();
    }
    if (gameData.scoreResult.innerHTML === '') {
        gameData.scoreResult.innerHTML += score;
    } else {
        gameData.scoreResult.innerHTML += ('+' + score);
    }
}
