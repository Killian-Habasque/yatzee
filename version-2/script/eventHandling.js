
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
  
            // if (selectedObject.children.length > 0) {
            //     // Parcourir tous les enfants de l'objet parent
            //     selectedObject.children.forEach(child => {
            //         selectedObject.rotation.set(0, 0, 0);
            //         if (child.scale.x === 1.2) {
            //             child.scale.set(1, 1, 1); 
            //         } else {
            //             // console.log(selectedObject)

            //             child.scale.set(1.2, 1.2, 1.2); 
            //         }
            //     });
            // }
        }
    }
}

let hoveredObject = null; 

export function onDocumentMouseMove(event) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    event.preventDefault();
    mouse.x = (event.clientX / gameData.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / gameData.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, gameData.camera);
    var intersects = raycaster.intersectObjects(gameData.scene.children, true); 

    // Réinitialiser l'échelle des objets qui ne sont plus survolés
    if (hoveredObject && !intersects.find(intersect => intersect.object === hoveredObject)) {
        hoveredObject.children.forEach(child => {
            if (child.type === "Mesh") {
                child.scale.set(1, 1, 1);
            }
        });
        document.body.style.cursor = 'auto'; 
        hoveredObject = null;
    }

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.parent.type === "Group") {
            object.parent.children.forEach(child => {
                if (child.type === "Mesh") {
                    child.scale.set(1.1, 1.1, 1.1); 
                }
            });
            document.body.style.cursor = 'pointer'; 
            hoveredObject = object.parent;
        }
    } else {
        document.body.style.cursor = 'auto'; 
    }
}


document.addEventListener('mousemove', onDocumentMouseMove, false);
// document.removeEventListener('mousemove', onDocumentMouseMove, false);
