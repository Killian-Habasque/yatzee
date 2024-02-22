
import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gameData } from '../main.js';

export default class Tray {
    constructor() {
        this.loader = new GLTFLoader()
        this.showProgressBar = null
        this.valueProgressBar = 0
        this.createOrUpdateRectangle();
        this.createTrayModel();
        this.createPenModel();
        this.createCupModel();
    }


    createTrayModel() {
        this.loader.load(
            '/version-2/assets/models/food_tray.glb',
            function (gltf) {
                gltf.scene.traverse(function (child) {
                    if (child.type === 'Mesh') {
                        let m = child
                        m.receiveShadow = false
                        m.castShadow = true
                        m.scale.set(8, 8, 8);
                        m.position.set(2, -7.1, 0);

                        let plateauMaterial = m.material;
                        plateauMaterial.color.r = 3;
                        plateauMaterial.color.g = 3;
                        plateauMaterial.color.b = 3;
                        m.material = plateauMaterial;
                    }
                })
                // this.showProgressBar = false
                gameData.scene.add(gltf.scene)

            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    let percentComplete = (xhr.loaded / xhr.total) * 100
                    this.valueProgressBar = percentComplete
                    this.showProgressBar = true
                }
            },
            (error) => {
                console.log(error)
            }
        )
    }

    createPenModel() {
        this.loader.load(
            '/version-2/assets/models/pen(1).glb',
            function (gltf, showProgressBar) {
                gltf.scene.traverse(function (child) {
                    if (child.type === 'Mesh') {
                        let m = child
                        m.receiveShadow = false
                        m.castShadow = true
                        m.scale.set(50, 50, 50);
                        console.log(m)
                        m.position.set(-1100, -670, -2);
                        m.rotateY(Math.PI / 1.2);
                    }
                })
                // showProgressBar = false
                gameData.scene.add(gltf.scene)
            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    let percentComplete = (xhr.loaded / xhr.total) * 100
                    this.valueProgressBar = percentComplete
                    this.showProgressBar = true
                }
            },
            (error) => {
                console.log(error)
            }
        )
    }

    createCupModel() {
        this.loader.load(
            '/version-2/assets/models/simple_paper_cup(1).glb',
            (gltf, showProgressBar) => { // Utilisation d'une fonction fléchée ici
                gltf.scene.traverse((child) => { // Utilisation d'une fonction fléchée ici
                    if (child.type === 'Mesh') {
                        child.receiveShadow = false;
                        child.castShadow = true;
                        child.scale.set(1.3, 1.3, 1.3);
                        child.position.set(17, 4, -6.5);
                        gameData.cup = child;
                    }
                });
                // showProgressBar = false
                gameData.scene.add(gltf.scene);
            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    let percentComplete = (xhr.loaded / xhr.total) * 100;
                    this.valueProgressBar = percentComplete;
                    this.showProgressBar = true;
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    createOrUpdateRectangle() {
        const wall = {
            width: 17,
            height: 6,
            positionX: 2,
            positionY: -4,
            positionZ: -6,
        }
        const geometry = new THREE.BoxGeometry(wall.width, wall.height, 0.1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0
        });
        this.createWallCollision(wall.width, wall.height, geometry, material, wall.positionX, wall.positionY, wall.positionZ, 0)
        this.createWallCollision(wall.width, wall.height, geometry, material, wall.positionX, wall.positionY, -wall.positionZ, 0)
        this.createWallCollision(wall.width, wall.height, geometry, material, -6, wall.positionY, 0, Math.PI / 2)
        this.createWallCollision(wall.width, wall.height, geometry, material, 10, wall.positionY, 0, Math.PI / 2)
    }

    createWallCollision(width, height, geometry, material, x, y, z, rotationY) {
        let rectangleMesh = new THREE.Mesh(geometry, material);
        rectangleMesh.position.set(x, y, z);
        rectangleMesh.rotation.set(0, rotationY, 0)
        gameData.scene.add(rectangleMesh);
        const rectangleShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, 0.05));
        const rectangleBody = new CANNON.Body({
            mass: 0,
            shape: rectangleShape,
            position: new CANNON.Vec3(x, y, z),
            // rotation: new CANNON.Vec3(0, rotationY, 0), 
            quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY)
        });
        gameData.physicsWorld.addBody(rectangleBody);
    }

    updateRectangle() {
        this.rectangleMesh.scale.set(gameData.params.rectangle.width, gameData.params.rectangle.height, 0.1);
        this.rectangleMesh.position.set(gameData.params.rectangle.positionX, gameData.params.rectangle.positionY, gameData.params.rectangle.positionZ);
    }

}