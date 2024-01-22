import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';

import { gameData } from '../main.js';

var rectangleMesh;

/*
Création de rectangle pour collision
*/
export function createOrUpdateRectangle() {

    const rectangleShape = new CANNON.Box(new CANNON.Vec3(gameData.params.rectangle.width * 0.5, gameData.params.rectangle.height * 0.5, 0.05));

    if (!rectangleMesh) {
        const geometry = new THREE.BoxGeometry(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000
        });

        rectangleMesh = new THREE.Mesh(geometry, material);
        var rectangleMesh2 = new THREE.Mesh(geometry, material);
        var rectangleMesh3 = new THREE.Mesh(geometry, material);
        rectangleMesh.receiveShadow = true;
        rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
        rectangleMesh2.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, -gameData.params.rectangle.positionZ);
        gameData.scene.add(rectangleMesh);
        gameData.scene.add(rectangleMesh2);
        //colision cannon
        // const body = new CANNON.Body({
        //     mass: 1,
        //     shape: new CANNON.Box(new CANNON.Vec3(params.rectangle.width, params.rectangle.height, 0.1)),
        //     sleepTimeLimit: .1
        // });
        // physicsWorld.addBody(body);

        const rectangleBody = new CANNON.Body({
            mass: 0, // Masse nulle pour un objet statique (mur, sol, etc.)
            shape: rectangleShape,
            position: new CANNON.Vec3(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ),
            quaternion: new CANNON.Quaternion()
        });
        gameData.physicsWorld.addBody(rectangleBody);
    } else {
        rectangleMesh.scale.set(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
        rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
    }
}

export function updateRectangle() {
    rectangleMesh.scale.set(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
    rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
}
