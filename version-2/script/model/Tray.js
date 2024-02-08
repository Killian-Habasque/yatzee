
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
    }


    createTrayModel() {
        this.loader.load(
            '/version-2/models/food_tray.glb',
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
            '/version-2/models/pen(1).glb',
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