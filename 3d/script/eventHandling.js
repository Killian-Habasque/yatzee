
import * as THREE from 'three';

import { gameData } from './main.js';

/*
Evenement click sur la scene
*/
export function onDocumentMouseDown(event) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    event.preventDefault();
    mouse.x = (event.clientX / gameData.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / gameData.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, gameData.camera);
    // console.log(scene.children);
    var intersects = raycaster.intersectObjects(gameData.scene.children);
    // console.log(intersects);
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object.parent;
        // console.log(selectedObject)
        if (selectedObject.type === "Group") {
            selectedObject.callback()
            // Vérification si l'objet parent a des enfants
            if (selectedObject.children.length > 0) {
                // Parcourir tous les enfants de l'objet parent
                selectedObject.children.forEach(child => {
                    selectedObject.rotation.set(0, 0, 0);
                    if (child.scale.x === 1.2) {
                        child.scale.set(1, 1, 1); // Changer l'échelle de l'enfant à 1
                    } else {
                        // console.log(selectedObject)

                        child.scale.set(1.2, 1.2, 1.2); // Changer l'échelle de l'enfant à 1.2
                    }
                });
            }
        }
    }
}
