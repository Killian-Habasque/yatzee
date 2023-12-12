// class Dice {
//     constructor(value, index) {
//         this.value = value;
//         this.index = index;
//         this.selected = false;
//     }

//     toggleSelection() {
//         this.selected = !this.selected;
//     }
// }


// class DiceManager {
//     constructor() {
//         this.dice = [];
//         this.selectedDice = [];
//         this.maxAttempts = 3;
//         this.attempts = 0;

//         this.initialize();
//     }


//    initialize() {
//     this.genereButton();
//         this.generateDice(5);
//         this.displayDice();
//     }
//     genereButton() {
//         const button = document.createElement("button");
//         button.className = "submit";
//         button.innerHTML = "Lancer les dés";
//         button.onclick = () => {
//             this.rollDice();
//         };
//         document.body.appendChild(button);
//     }


//     generateDice(numDice) {
//         this.dice = Array.from({ length: numDice }, () => new Dice(Math.floor(Math.random() * 6) + 1));
//     }

//     displayDice() {
//         const selectedContainer = document.getElementById("diceContainerSelected");
//         const pendingContainer = document.getElementById("diceContainerPending");

//         selectedContainer.innerHTML = "";
//         pendingContainer.innerHTML = "";

//         this.dice.forEach(die => {
//             const diceButton = this.createDiceButton(die);
//             if (die.selected) {
//                 selectedContainer.appendChild(diceButton);
//             } else {
//                 pendingContainer.appendChild(diceButton);
//             }
//         });
//     }

//     createDiceButton(die) {
//         const diceButton = document.createElement("button");
//         diceButton.className = `dice ${die.selected ? 'selected' : ''}`;
//         diceButton.textContent = die.value;
//         diceButton.onclick = () => this.toggleDiceSelection(die);
//         return diceButton;
//     }
//     toggleDiceSelection(die) {
//         die.toggleSelection();
//         this.updateSelectedDice();
//         this.displayDice();
//     }
//     updateSelectedDice() {
//         this.selectedDice = this.dice.filter(die => die.selected);
//     }
//     rollDice() {
//         const selectedContainer = document.getElementById("diceContainerSelected");
//         const pendingContainer = document.getElementById("diceContainerPending");

//         pendingContainer.innerHTML = "";
//         selectedContainer.innerHTML = "";

//         if (this.attempts < this.maxAttempts) {
//             this.generateDice(this.dice.length);
//             this.displayDice();
//             this.attempts++;
//         } else {
//             console.log("No more attempts");
//             this.removeButton();
//             const finalDice = this.selectedDice.concat(this.dice);
//             this.displayFinalDice(finalDice);
//         }
//     }
//     removeButton() {
//         const button = document.getElementById("submitButton");
//         button.parentNode.removeChild(button);
//     }

//     displayFinalDice(finalDice) {
//         console.log(finalDice);
//         // Display final dice logic here
//     }
// }




class Button {
    constructor(className, innerHTML, callback) {
        this.button = document.createElement("button");
        this.button.className = className;
        this.button.innerHTML = innerHTML;
        this.button.onclick = callback;
        document.body.appendChild(this.button);
    }
    remove() {
        this.button.parentNode.removeChild(this.button);
        this.button.onclick = null; 
    }
}



class Game {

    constructor() {
        this.dice = [];
        this.selectedDice = [];
        this.maxAttempts = 3;
        this.attempts = 0;

        this.initialize();
    }


    initialize() {
        this.dice = this.generateDice(5);
        this.afficherDes(this.dice);
        this.button = new Button("submit", "Lancer les dés", () => this.rollDice())
    }

    generateDice(nbrDice) {
        let dice = [];
        for (let i = 0; i < nbrDice; i++) {
            dice.push(Math.floor(Math.random() * 6) + 1);
        }
        return dice;
    }


    createDice(valeur, index, isSelected, onclick = true) {
        const diceButton = document.createElement("button");
        diceButton.className = "dice" + (isSelected ? " selected" : "");
        diceButton.textContent = valeur;
        if(onclick){
            diceButton.onclick = () => {
                isSelected ? this.selectionDeSelected(diceButton, index) : this.selectionDe(diceButton, index);
            };
        }
        return diceButton;
    }

    displayDice(dice, selectedDice) {

    }


    afficherDesSelec(desAfficher, onclick) {
        let diceContainer = document.getElementById("diceContainerSelected");
        diceContainer.innerHTML = "";
        desAfficher.forEach((valeur, index) => {
            const diceButton = this.createDice(valeur, index, true, onclick);
            diceContainer.appendChild(diceButton);
        });
    }

    afficherDes(desAfficher) {
        if(desAfficher) {
            let diceContainer = document.getElementById("diceContainerPending");
            diceContainer.innerHTML = "";
            desAfficher.forEach((valeur, index) => {
                const diceButton = this.createDice(valeur, index, false);
                diceContainer.appendChild(diceButton);
            });
        }
    }

    selectionDe(diceButton, index) {
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        diceButton.classList.add("selected");
        this.selectedDice.push(this.dice[index]);
        this.dice.splice(index, 1);
        diceContainerSelected.appendChild(diceButton);
        this.afficherDes(this.dice);
        this.afficherDesSelec(this.selectedDice);

        console.log("Des:", this.dice);
        console.log("Des sélectionnés:", this.selectedDice);
    }

    selectionDeSelected(diceButton, index) {
        const diceContainerPending = document.getElementById("diceContainerPending");
        diceButton.classList.remove("selected");
        this.dice.push(this.selectedDice[index]);
        this.selectedDice.splice(index, 1);
        diceContainerPending.appendChild(diceButton);
        this.afficherDes(this.dice);
        this.afficherDesSelec(this.selectedDice);

        console.log("Des:", this.dice);
        console.log("Des sélectionnés:", this.selectedDice);
    }

    rollDice() {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        
        diceContainerPending.innerHTML = "";
        diceContainerSelected.innerHTML = "";
        if(this.attempts < 2) {
            this.dice = this.generateDice(this.dice.length);
            this.afficherDes(this.dice);
            this.afficherDesSelec(this.selectedDice);
            this.attempts++;
        } else {
            console.log("Plus de 3 essais")
            this.button.remove();
            const finaldices = this.selectedDice.concat(this.dice);
            console.log(finaldices)
            this.afficherDes();
            this.afficherDesSelec(finaldices, false);
        }

    }

}


window.onload = function () {
    let dees = new Game()
};