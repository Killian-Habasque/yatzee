import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { gameData } from './main.js';

import { initDatGui } from './datGui.js';
import { onDocumentMouseDown } from './eventHandling.js';
import { createDiceMesh, createDice, createBoxGeometry, createInnerGeometry, addDiceEvents, selectedDice, unselectedDice, realignDiceSelected, realignDice, reloadDice, throwDice, alignDiceInLine } from './model/diceLogic.js';
import { render } from './render.js';

const canvasEl = document.querySelector('#canvas');
export let tray =  null;
import Tray from './model/Tray.js';

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

    gameData.tray = new Tray();
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

    const loader = new GLTFLoader()
    console.log(loader)
    loader.load(
        '/version-2/models/food_tray.glb',
        function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.type === 'Mesh') {
                    let m = child
                    m.receiveShadow = true
                    m.castShadow = false
                    m.scale.set(9, 9, 9);
                    m.position.set(4, -7.1, -2);

                    let plateauMaterial = m.material;
                    plateauMaterial.color.r = 2;
                    plateauMaterial.color.g = 2;
                    plateauMaterial.color.b = 2;
                    m.material = plateauMaterial;
                }
                // if (child.type === 'SpotLight') {
                 
                //     let l = child
                //     l.castShadow = true
                //     l.shadow.bias = -0.003
                //     //l.shadow.mapSize.width = 2048
                //     //l.shadow.mapSize.height = 2048
                // }
            })
            gameData.scene.add(gltf.scene)
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Group
            // gltf.scenes; // Array<THREE.Group>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                var percentComplete = (xhr.loaded / xhr.total) * 100
            }
        },
        (error) => {
            console.log(error)
        }
    )
    loader.load(
        '/version-2/models/pen(1).glb',
        function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.type === 'Mesh') {
                    let m = child
                    m.receiveShadow = false
                    m.castShadow = true
                    m.scale.set(40, 40, 40);
                    console.log(m)
                    m.position.set(-1000, -700, -2);
                    m.rotateY(Math.PI / 1.2);
                }
            })
            gameData.scene.add(gltf.scene)
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                var percentComplete = (xhr.loaded / xhr.total) * 100
            }
        },
        (error) => {
            console.log(error)
        }
    )
    createFloor();
    gameData.diceMesh = createDiceMesh();
    for (let i = 0; i < gameData.params.numberOfDice; i++) {
        gameData.diceArray.push(createDice());
        addDiceEvents(gameData.diceArray[i]);
    }

    throwDice();
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
        alignDiceInLine();

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
