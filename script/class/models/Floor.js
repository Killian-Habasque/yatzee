import * as THREE from 'three';
import * as CANNON from 'cannon';
import { gameData } from '../../main.js';


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
        var groundTexture = new THREE.TextureLoader().load('/assets/images/textures/wood_floor_worn_diff_2k.png');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(20, 20);
        groundTexture.anisotropy = 16;

        var groundTexture2 = new THREE.TextureLoader().load('/assets/images/textures/wood_floor_worn_nor_gl_2k.jpg');
        groundTexture2.wrapS = groundTexture2.wrapT = THREE.RepeatWrapping;
        groundTexture2.repeat.set(20, 20);


        var groundTexture3 = new THREE.TextureLoader().load('/assets/images/textures/wood_floor_worn_arm_1k.png');
        groundTexture3.wrapS = groundTexture3.wrapT = THREE.RepeatWrapping;
        groundTexture3.repeat.set(20, 20);
        groundTexture3.anisotropy = 16;


        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({
                map: groundTexture,
                normalMap: groundTexture2,
                aoMap: groundTexture3
            })
        )
        floor.geometry.addAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2));
        floor.receiveShadow = true;
        floor.position.y = -7.1;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
        gameData.scene.add(floor);
    }

}