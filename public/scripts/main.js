import { GameInstance } from './gameLogic.js';

import * as THREE from 'three';
import Label from './class/hud/Label.js';

export let gameData = {
    renderer: null,
    scene: null,
    camera: null,
    physicsWorld: null,

    diceArray: [],
    diceArraySelected: [],
    dicePositionSelected: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
    },
    scoreSelected: [],
    scoreGlobal: [],
    maxAttempts: 3,
    attempts: 0,
    turn: 1,
    brake: null,

    dashboard: null,
    sheet: null,
    button: null,
    dice: null,
    models: null,
    cup: null,
    landing: null,
    music: null,
};


const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
    const content = document.querySelector(".content");
    content.style.display = "none";

    const header = document.querySelector(".header");
    header.classList.toggle('in-game')

    GameInstance();
});
// const content = document.querySelector(".content"); 
// content.style.display = "none";
// GameInstance();

const quitButton = document.getElementById('quitButton');

quitButton.addEventListener('click', () => {

    gameData.landing.reshowLanding(removeGame)
    // removeGame()

    function removeGame() {

        const header = document.querySelector(".header");
        header.classList.toggle('in-game')
    


        gameData.button.removeButton()
        
        // Arrêter la boucle de rendu
        cancelAnimationFrame(gameData.animationFrameID);
    

    
        // Supprimer tous les objets de la scène
        while (gameData.scene.children.length > 0) {
            const obj = gameData.scene.children[0];
            gameData.scene.remove(obj);
    
            // Si l'objet est une instance de Mesh, libérer sa géométrie et son matériau
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                if (obj.material instanceof Array) {
                    obj.material.forEach(material => material.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }
    
    
        // Supprimer toutes les données de physique
        gameData.physicsWorld.bodies.forEach(body => {
            gameData.physicsWorld.removeBody(body);
        });
    
        // Réinitialiser les variables de jeu
        gameData.diceArray = [];
        gameData.diceArraySelected = [];
        gameData.dicePositionSelected = {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
        };
        gameData.scoreSelected = [];
        gameData.scoreGlobal = [];
        gameData.maxAttempts = 3;
        gameData.attempts = 0;
        gameData.turn = 1;
        gameData.brake = null;
        Label.remove()
        // Supprimer les références aux objets du jeu
        gameData.dashboard = null;
        gameData.sheet.clearSheet();
        gameData.button = null;
        gameData.dice = null;
        gameData.models = null;
        gameData.cup = null;
        // gameData.landing = null;
        gameData.music = null;
    
        // Réinitialiser le canvas


    }

});