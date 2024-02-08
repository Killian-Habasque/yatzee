import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { gameData } from '../main.js';


export default class Floor {
    constructor() {
        this.createFloor();
        this.createShadow();
    }

    /*
    Création de l'ombre
    */ 
    createShadow() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.ShadowMaterial({
                opacity: .15
            })
        )
        floor.receiveShadow = true;
        floor.position.y = -6.95;
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
    Création du plane
    */ 
    createFloor() {
        var groundTexture = new THREE.TextureLoader().load('/version-2/models/wood_floor_worn_diff_2k.png');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 20, 20 );
        groundTexture.anisotropy = 16;
    
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ map: groundTexture })
        )
    
        floor.receiveShadow = true;
        floor.position.y = -7.1;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
        gameData.scene.add(floor);
    }
    
}