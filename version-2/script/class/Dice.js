
import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';


import { gameData } from '../main.js';
import { showRollResults } from '../gameLogic.js';


export default class Dice {
    constructor() {
        gameData.diceMesh = this.createDiceMesh();
        this.initDice()
    }
    initDice() {
        for (let i = 0; i < gameData.params.numberOfDice; i++) {
            const dice = this.createDice();
            gameData.diceArray.push(dice);
            // this.addDiceEvents(gameData.diceArray[i]);
        }
    }
    /*
    Création des dés
    */
    createDice() {
        const mesh = gameData.diceMesh.clone();

        const body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
            sleepTimeLimit: .1,
        });

        mesh.visible = true;
        mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
        body.quaternion.copy(mesh.quaternion);
      
        gameData.scene.add(mesh); 
        gameData.physicsWorld.addBody(body);
        return { mesh, body };
    }

    /*
    Maillage du dé en regroupant Plane et Box geometry
    */
    createDiceMesh() {
        const boxMaterialOuter = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
        })
        const boxMaterialInner = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0,
            metalness: 1,
            side: THREE.DoubleSide
        })

        const diceMesh = new THREE.Group();
        const innerMesh = new THREE.Mesh(this.createInnerGeometry(), boxMaterialInner);
        let outerMesh = new THREE.Mesh(this.createBoxGeometry(), boxMaterialOuter);

        outerMesh.castShadow = true;
        diceMesh.add(innerMesh, outerMesh);

        return diceMesh;
    }


    /*
    Box geometry à l'exterieur des dés
    */
    createBoxGeometry() {

        let boxGeometry = new THREE.BoxGeometry(1, 1, 1, gameData.params.segments, gameData.params.segments, gameData.params.segments);

        const positionAttr = boxGeometry.attributes.position;
        const subCubeHalfSize = .5 - gameData.params.edgeRadius;


        for (let i = 0; i < positionAttr.count; i++) {

            let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

            const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
            const addition = new THREE.Vector3().subVectors(position, subCube);

            if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.normalize().multiplyScalar(gameData.params.edgeRadius);
                position = subCube.add(addition);
            } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
                addition.z = 0;
                addition.normalize().multiplyScalar(gameData.params.edgeRadius);
                position.x = subCube.x + addition.x;
                position.y = subCube.y + addition.y;
            } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.y = 0;
                addition.normalize().multiplyScalar(gameData.params.edgeRadius);
                position.x = subCube.x + addition.x;
                position.z = subCube.z + addition.z;
            } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.x = 0;
                addition.normalize().multiplyScalar(gameData.params.edgeRadius);
                position.y = subCube.y + addition.y;
                position.z = subCube.z + addition.z;
            }

            const notchWave = (v) => {
                v = (1 / gameData.params.notchRadius) * v;
                v = Math.PI * Math.max(-1, Math.min(1, v));
                return gameData.params.notchDepth * (Math.cos(v) + 1.);
            }
            const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

            const offset = .23;

            if (position.y === .5) {
                position.y -= notch([position.x, position.z]);
            } else if (position.x === .5) {
                position.x -= notch([position.y + offset, position.z + offset]);
                position.x -= notch([position.y - offset, position.z - offset]);
            } else if (position.z === .5) {
                position.z -= notch([position.x - offset, position.y + offset]);
                position.z -= notch([position.x, position.y]);
                position.z -= notch([position.x + offset, position.y - offset]);
            } else if (position.z === -.5) {
                position.z += notch([position.x + offset, position.y + offset]);
                position.z += notch([position.x + offset, position.y - offset]);
                position.z += notch([position.x - offset, position.y + offset]);
                position.z += notch([position.x - offset, position.y - offset]);
            } else if (position.x === -.5) {
                position.x += notch([position.y + offset, position.z + offset]);
                position.x += notch([position.y + offset, position.z - offset]);
                position.x += notch([position.y, position.z]);
                position.x += notch([position.y - offset, position.z + offset]);
                position.x += notch([position.y - offset, position.z - offset]);
            } else if (position.y === -.5) {
                position.y += notch([position.x + offset, position.z + offset]);
                position.y += notch([position.x + offset, position.z]);
                position.y += notch([position.x + offset, position.z - offset]);
                position.y += notch([position.x - offset, position.z + offset]);
                position.y += notch([position.x - offset, position.z]);
                position.y += notch([position.x - offset, position.z - offset]);
            }

            positionAttr.setXYZ(i, position.x, position.y, position.z);
        }


        boxGeometry.deleteAttribute('normal');
        boxGeometry.deleteAttribute('uv');
        boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

        boxGeometry.computeVertexNormals();

        return boxGeometry;
    }

    /*
    Plane geometry à l'intérieur des dés
    */
    createInnerGeometry() {
        const baseGeometry = new THREE.PlaneGeometry(1 - 2 * gameData.params.edgeRadius, 1 - 2 * gameData.params.edgeRadius);
        const offset = .48;
        return BufferGeometryUtils.mergeBufferGeometries([
            baseGeometry.clone().translate(0, 0, offset),
            baseGeometry.clone().translate(0, 0, -offset),
            baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
            baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
            baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
            baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
        ], false);
    }

    /*
    Résultats en texte
    */
    addDiceEvents(dice) {
        dice.body.addEventListener('sleep', (e) => {

            dice.body.allowSleep = false;

            const euler = new CANNON.Vec3();
            e.target.quaternion.toEuler(euler);

            const eps = .1;
            let isZero = (angle) => Math.abs(angle) < eps;
            let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
            let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
            let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);


            if (isZero(euler.z)) {

                if (isZero(euler.x)) {
                    showRollResults(1);
                    dice.mesh.callback = () => {
                        console.log(1);
                        dice.value = 1;
                        this.selectedDice(dice);
                    }

                } else if (isHalfPi(euler.x)) {
                    showRollResults(4);
                    dice.mesh.callback = () => { console.log(4); dice.value = 4; this.selectedDice(dice); }
                } else if (isMinusHalfPi(euler.x)) {
                    showRollResults(3);
                    dice.mesh.callback = () => { console.log(3); dice.value = 3; this.selectedDice(dice); }
                } else if (isPiOrMinusPi(euler.x)) {
                    showRollResults(6);
                    dice.mesh.callback = () => { console.log(6); dice.value = 6; this.selectedDice(dice); }
                } else {
                    // landed on edge => wait to fall on side and fire the event again
                    dice.body.allowSleep = true;
                }
            } else if (isHalfPi(euler.z)) {
                showRollResults(2);
                dice.mesh.callback = () => { console.log(2); dice.value = 2; this.selectedDice(dice); }
            } else if (isMinusHalfPi(euler.z)) {
                showRollResults(5);
                dice.mesh.callback = () => { console.log(5); dice.value = 5; this.selectedDice(dice); }
            } else {
                // landed on edge => wait to fall on side and fire the event again
                dice.body.allowSleep = true;
            }
        });

    }

    /*
    Sélection/ desélection d'un dé
    */
    selectedDice(dice) {
        console.log(dice);

        if (!gameData.canSelect) {
            return;
        }
        gameData.canSelect = false;
        // gameData.canRoll = false;
        const targetPosition = new CANNON.Vec3(-2 + gameData.diceArraySelected.length * 2, 0, -5);
        const selectedDiceIndex = gameData.diceArray.indexOf(dice);

        gameData.diceArray.splice(selectedDiceIndex, 1);
        gameData.diceArraySelected.push(dice);

        this.moveAndRotateDice(selectedDiceIndex, dice, targetPosition, 0, 500, 0, () => {
            this.realignDice();
            gameData.scoreSelected.push(dice.value);
            gameData.canSelect = true;
        })

        dice.mesh.callback = () => { this.unselectedDice(dice); }
    }
    unselectedDice(dice) {
        if (!gameData.canSelect) {
            return;
        }
        gameData.canSelect = false;
        // gameData.canRoll = false;
        const targetPosition = new CANNON.Vec3(-2 + (gameData.diceArray.length) * 2, 0, 0);
        const selectedDiceIndex = gameData.diceArraySelected.indexOf(dice);
        gameData.diceArraySelected.splice(selectedDiceIndex, 1);
        gameData.diceArray.push(dice);

        this.moveAndRotateDice(selectedDiceIndex, dice, targetPosition, 0, 500, 0, () => {
            this.realignDiceSelected();
            let indexToDelete = gameData.scoreSelected.indexOf(dice.value);
            if (indexToDelete !== -1) {
                gameData.scoreSelected.splice(indexToDelete, 1);
                gameData.canSelect = true;
            }
        })


        dice.mesh.callback = () => { this.selectedDice(dice); };
    }

    /*
    Réalignement des dés
    */
    realignDiceSelected() {
        const alignmentDuration = 0.3 * 1000;
        const delayBetweenDice = 0.1 * 1000;

        let completedDice = 0;
        const totalDice = gameData.diceArraySelected.length;
        gameData.canRoll = false;
        if (totalDice == 0) {
            gameData.canRoll = true;
        } else {
            gameData.diceArraySelected.forEach((dice, index) => {
                const targetPosition = new CANNON.Vec3(-2 + index * 2, 0, -5);

                this.moveAndRotateDice(index, dice, targetPosition, 0, alignmentDuration, delayBetweenDice,
                    () => {
                        completedDice++;
                        if (completedDice === totalDice) {
                            gameData.canRoll = true;
                        }
                    })
            });
        }


    }
    realignDice() {
        const alignmentDuration = 0.3 * 1000;
        const delayBetweenDice = 0.1 * 1000;

        let completedDice = 0;
        const totalDice = gameData.diceArray.length;

        gameData.canRoll = false;

        if (totalDice == 0) {
            gameData.canRoll = true;
        } else {
            gameData.diceArray.forEach((dice, index) => {
                const targetPosition = new CANNON.Vec3(-2 + index * 2, 0, 0);
                this.moveAndRotateDice(index, dice, targetPosition, 0, alignmentDuration, delayBetweenDice,
                    () => {
                        completedDice++;
                        if (completedDice === totalDice) {
                            gameData.canRoll = true;
                        }
                    })
            });
        }
    }

    /*
    Lancer dés 
    */
    throwDice() {
        if (!gameData.canRoll) {
            return;
        }
        if (gameData.turn === 0 && gameData.attempts === 0 && gameData.brake === null) {
            for (let i = 0; i < gameData.params.numberOfDice; i++) {
                this.addDiceEvents(gameData.diceArray[i]);
            }
        }
        gameData.canRoll = false;
        gameData.canSelect = false;
        gameData.attempts++;
        if (gameData.turn != 0 || gameData.attempts != 0) {
            console.log("BUTTTTTON")
            console.log(gameData.turn)
            if (gameData.button.existButton()) {

                gameData.button.removeButton();
            }
        }

        if (gameData.cup) {
            let startPosition = { x: 17, y: 4, z: -6.5 };
            let endPosition = { x: 6.5, y: 0, z: 8.5 };
            let startRotation = { rotationY: 0 };

  
            gameData.diceArray.forEach((d, dIdx) => {

                d.body.velocity.setZero();
                d.body.angularVelocity.setZero();

                d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
                d.mesh.position.copy(d.body.position);
                d.mesh.visible = false;
            
                d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
                d.body.quaternion.copy(d.mesh.quaternion);

            });

            // Tween pour l'animation initiale
            let forwardTween = new TWEEN.Tween({ t: 0 })
                .to({ t: 1 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((obj) => {
                    gameData.cup.rotation.y = startRotation.rotationY + obj.t * (Math.PI * (-5 / 6) - startRotation.rotationY);
                    gameData.cup.position.set(
                        startPosition.x + obj.t * (endPosition.x - startPosition.x),
                        startPosition.y + obj.t * (endPosition.y - startPosition.y),
                        startPosition.z + obj.t * (endPosition.z - startPosition.z)
                    );
                }).onComplete(() => {

                    if (gameData.attempts <= gameData.maxAttempts) {
                        if (gameData.turn != 0 || gameData.attempts != 0) {
                            gameData.sheet.pendingSheet();
                        }

                        gameData.scoreResult.innerHTML = '';
                        gameData.scoreGlobal = [];

                        gameData.diceArray.forEach((d, dIdx) => {

                            d.mesh.visible = true;
                            const force = 3 + 5 * Math.random();
                            d.body.applyImpulse(
                                new CANNON.Vec3(-force, force, 0),
                                new CANNON.Vec3(0, 0, .2)
                            );
                            d.body.allowSleep = true;

                        });

                    }
                });

            // Tween pour l'animation inverse
            let backwardTween = new TWEEN.Tween({ t: 0 })
                .to({ t: 1 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate((obj) => {
                    gameData.cup.rotation.y = startRotation.rotationY + (1 - obj.t) * (Math.PI * (-5 / 6) - startRotation.rotationY);
                    gameData.cup.position.set(
                        startPosition.x + (1 - obj.t) * (endPosition.x - startPosition.x),
                        startPosition.y + (1 - obj.t) * (endPosition.y - startPosition.y),
                        startPosition.z + (1 - obj.t) * (endPosition.z - startPosition.z)
                    );
                })
                .delay(200)
                .onComplete(() => {
                    // Réinitialiser la position et la rotation à la fin de l'animation
                    gameData.cup.rotation.y = 0;
                    gameData.cup.position.set(startPosition.x, startPosition.y, startPosition.z);


                    console.log(gameData.turn)

                });

            // Démarrer la tween de l'animation initiale puis la tween de retour
            forwardTween.chain(backwardTween);
            forwardTween.start();
        }



    }

    /*
    Alignement des dés après le lancer
    */
    alignDiceInLine() {
        const alignmentDuration = 1 * 1000;
        const delayBetweenDice = 0.2 * 1000;
        let completedDice = 0;
        const totalDice = gameData.diceArray.length;
        gameData.canRoll = false;
        gameData.diceArray.forEach((dice, index) => {
            const targetPosition = new CANNON.Vec3(-2 + index * 2, 0, 0);
            this.moveAndRotateDice(index, dice, targetPosition, 0, alignmentDuration, delayBetweenDice, () => {
                gameData.canSelect = true;
                if (gameData.attempts == gameData.maxAttempts) {
                    this.autoSelected()
                }
                completedDice++;
                if (completedDice === totalDice) {
                    gameData.canRoll = true;

                    gameData.sheet.compare([...gameData.scoreSelected, ...gameData.scoreGlobal]);
                    gameData.sheet.updateSheet();
                }
            })
        });

    }

    /*
    Animation de déplacement sur un dé
    */
    moveAndRotateDice(index, dice, targetPosition, targetRotation, duration, delay, callback) {

        delay ? delay = index * delay : 0

        new TWEEN.Tween(dice.mesh.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(delay)
            .onUpdate(() => {
                dice.body.position.copy(dice.mesh.position);
            })
            .start();

        new TWEEN.Tween({ y: dice.mesh.rotation.y })
            .to({ y: targetRotation }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(delay)
            .onUpdate((obj) => {
                dice.mesh.rotation.y = obj.y;
                dice.mesh.rotation.reorder('YXZ');
                dice.body.quaternion.copy(dice.mesh.quaternion);
            })
            .onComplete(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }

    /*
    Relancer les dés du nouveau tour
    */
    reloadDice() {
        gameData.attempts = 0;
        console.log(gameData.turn)
        gameData.sheet.updateTurn(gameData.turn + "/12");

        gameData.diceArraySelected.forEach((dice, index) => {
            gameData.diceArray.push(dice);
            gameData.scoreGlobal.push(dice.value);
        });
        gameData.diceArraySelected = [];
        gameData.scoreSelected = [];

        gameData.canRoll = true;
        this.throwDice();
    }

    /*
    Alignement de tous les dés (sélectionnés/ non-selectionnés)
    */
    autoSelected() {

        gameData.canSelect = false;
        gameData.diceArraySelected.forEach((dice, index) => {
            const targetPosition = new CANNON.Vec3(-2 + gameData.diceArray.length * 2, 0, 0);
            gameData.diceArray.push(dice);
            gameData.scoreGlobal.push(dice.value);
            this.moveAndRotateDice(index, dice, targetPosition, 0, 500, 100)
        });
        gameData.diceArraySelected = [];
        gameData.scoreSelected = [];
    }
}