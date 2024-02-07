
import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { gameData } from '../main.js';

export default class Tray {
    constructor() {
        this.rectangleMesh = null;
        this.createOrUpdateRectangle();
    }
    createOrUpdateRectangle() {
        const rectangleShape = new CANNON.Box(new CANNON.Vec3(gameData.params.rectangle.width * 0.5, gameData.params.rectangle.height * 0.5, 0.05));
    
        if (!this.rectangleMesh) {
            const geometry = new THREE.BoxGeometry(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff0000
            });
    
            this.rectangleMesh = new THREE.Mesh(geometry, material);
            var rectangleMesh2 = new THREE.Mesh(geometry, material);
            var rectangleMesh3 = new THREE.Mesh(geometry, material);
            this.rectangleMesh.receiveShadow = true;
            this.rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
            rectangleMesh2.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, -gameData.params.rectangle.positionZ);
            gameData.scene.add(this.rectangleMesh);
            gameData.scene.add(rectangleMesh2);
    
            const rectangleBody = new CANNON.Body({
                mass: 0, // Masse nulle pour un objet statique (mur, sol, etc.)
                shape: rectangleShape,
                position: new CANNON.Vec3(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ),
                quaternion: new CANNON.Quaternion()
            });
            gameData.physicsWorld.addBody(rectangleBody);
        } else {
            this.rectangleMesh.scale.set(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
            this.rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
        }
    }

    updateRectangle() {
        this.rectangleMesh.scale.set(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
        this.rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
    }
    
}