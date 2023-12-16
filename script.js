
class Sheet {
    constructor() {
        this.sheet = {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
            "Bonus": null,
            "Chance": null,
            "Petite suite": null,
            "Grande suite": null,
            "Full": null,
            "Carré": null,
            "Yam's": null
        };
        this.score = null;

        this.initialize();
        this.displaySheet();
    }
    initialize() {
        console.log(this.sheet)
    }

    compare(dice) {
        dice.sort((a, b) => a.value - b.value);
        const counts = {};
        dice.forEach((die) => {
            counts[die.value] = (counts[die.value] || 0) + 1;
        });
        console.log(dice)
        switch (true) {
            case (Object.values(counts).includes(5)):
                // Yam's
                this.sheet["Yam's"] = dice.reduce((acc, curr) => acc + curr, 0); // Score = somme de tous les dés
                break;
            case (Object.values(counts).includes(4)):
                // Carré
                const fourOfAKindValue = Object.keys(counts).find(key => counts[key] === 4);
                this.sheet["Carré"] = dice.reduce((acc, curr) => curr === parseInt(fourOfAKindValue) ? acc + curr : acc, 0); // Score = somme des dés du Carré
                break;
            case (Object.values(counts).includes(3) && Object.values(counts).includes(2)):
                // Full
                this.sheet["Full"] = 25;
                break;
            case (Object.values(counts).includes(1)):
                console.log(Object.values(counts).includes(1))
                // Chiffres
                for (let i = 1; i <= 6; i++) {
                    const count = dice.filter(die => die.value === i).length;
                    this.sheet[i] = count * i;
                }

                const isSmallStraight = (arr) => {
                    const uniqueValues = [...new Set(arr)]; // Récupère les valeurs uniques des dés
                    return uniqueValues.length >= 4 && (uniqueValues[3] - uniqueValues[0] === 3);
                };

                const isLargeStraight = (arr) => {
                    const uniqueValues = [...new Set(arr)]; // Récupère les valeurs uniques des dés
                    return uniqueValues.length === 5 && (uniqueValues[4] - uniqueValues[0] === 4);
                };

                // Petite suite
                if (isSmallStraight(dice)) {
                    this.sheet["Petite suite"] = 30;
                }

                // Grande suite
                if (isLargeStraight(dice)) {
                    this.sheet["Grande suite"] = 40; // Score pour une grande suite
                }
                break;


        }
        console.log(this.sheet);
        // calcul  des dés
        // comparaison 
    }
    displaySheet() {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        for (const key in this.sheet) {
            const row = document.createElement('tr');
            const cellKey = document.createElement('td');
            cellKey.textContent = key;

            const cellValue = document.createElement('td');
            cellValue.textContent = this.sheet[key] !== null ? this.sheet[key] : '-'; // Affiche le score ou '-' si null

            cellValue.dataset.key = key; // Ajoute une propriété dataset pour identifier la cellule

            cellValue.addEventListener('click', () => {
                if (this.sheet[key] === null) {
                    // Si la case est cliquée et est null, tu peux ajouter ici la logique pour affecter un score à cette catégorie.
                    // Par exemple, tu peux ouvrir une fenêtre modale pour saisir le score.
                    const score = prompt(`Entrez le score pour ${key}:`);
                    this.sheet[key] = parseInt(score); // Convertis en nombre si nécessaire
                    cellValue.textContent = this.sheet[key];
                } else {
                    // Logique supplémentaire si tu veux gérer le clic sur une case déjà remplie
                    console.log(`La case ${key} est déjà remplie avec le score ${this.sheet[key]}`);
                }
            });

            row.appendChild(cellKey);
            row.appendChild(cellValue);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        document.body.appendChild(table);
    }


}


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


class Die {
    constructor(value, index) {
        this.value = value;
        this.index = index;
        this.selected = false;
    }
    displayDice() { 
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        const diceButton = document.createElement("button");
        diceButton.className = "dice" + (this.selected ? " selected" : "");
        diceButton.textContent = this.value;
        diceButton.onclick = () => {
            this.selected = !this.selected;
            console.log(this.selected)
            // game.displayAllDice();
            if(this.selected ) {
                // this.selectedDice.push(die);
                diceContainerSelected.appendChild(diceButton); 
            } else {
                diceContainerPending.appendChild(diceButton);  
            } 
        };
        // return diceButton;
        if(this.selected ) {
            // this.selectedDice.push(die);
            diceContainerSelected.appendChild(diceButton); 
        } else {

            diceContainerPending.appendChild(diceButton);  
        } 
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
        this.displayAllDice();
        this.button = new Button("submit", "Lancer les dés", () => this.rollDice())
        this.sheet = new Sheet()

    }

    generateDice(numDice) {
        return Array.from({ length: numDice }, (value, index) => new Die(Math.floor(Math.random() * 6) + 1, index));
    }

    displayAllDice() {
        // const diceContainerPending = document.getElementById("diceContainerPending");
        // const diceContainerSelected = document.getElementById("diceContainerSelected");
        // diceContainerPending.innerHTML = ""; 
        // diceContainerSelected.innerHTML = "";
        // this.selectedDice = [];

        this.dice.forEach(die => {
            console.log(die)
            die.displayDice();
            // if(die.selected) {
            //     this.selectedDice.push(die);
            //     diceContainerSelected.appendChild(diceButton); 
            // } else {

            //     diceContainerPending.appendChild(diceButton);  
            // } 
        });
        // const deselectedDice = this.dice.filter(die => !die.selected);
        // this.dice = [...deselectedDice, ...this.selectedDice];
        // console.log(this.selectedDice)
        // console.log(this.dice)
    }
    
    // displayDice(dice) {
    //     let diceContainer = document.getElementById("diceContainerPending");
    //     diceContainer.innerHTML = "";
    //     if (dice) {
    //         dice.forEach((die) => {
    //             const diceButton = this.createDice(die.value, die.index, false);
    //             diceContainer.appendChild(diceButton);
    //         });
    //     }
    // }
    // displayDiceSelected(dice) {
    //     let diceContainer = document.getElementById("diceContainerSelected");
    //     diceContainer.innerHTML = "";
    //     dice.forEach((die) => {
    //         const diceButton = this.createDice(die.value, die.index, true);
    //         diceContainer.appendChild(diceButton);
    //     });
    // }

    // createDice(valeur, index, isSelected) {
    //     const diceButton = document.createElement("button");
    //     diceButton.className = "dice" + (isSelected ? " selected" : "");
    //     diceButton.textContent = valeur;
    //     diceButton.onclick = () => {
    //         isSelected ? this.toggleDieSelected(diceButton, index) : this.toggleDie(diceButton, index);
    //     };
    //     return diceButton;
    // }

    // toggleDie(diceButton, index) {
    //     const diceContainerSelected = document.getElementById("diceContainerSelected");
    //     diceButton.classList.toggle("selected");
    //     this.dice[index].selected = !this.dice[index].selected;

    //     const selectedDie = this.dice.splice(index, 1)[0];
    //     selectedDie.index = this.selectedDice.length;
    //     this.selectedDice.push(selectedDie);

    //     this.dice.forEach((die, idx) => {
    //         die.index = idx;
    //     });

    //     diceContainerSelected.appendChild(diceButton);
    //     this.displayDice(this.dice);
    //     this.displayDiceSelected(this.selectedDice);

    //     console.log("Des:", this.dice);
    //     console.log("Des sélectionnés:", this.selectedDice);
    // }

    // toggleDieSelected(diceButton, index) {
    //     const diceContainerPending = document.getElementById("diceContainerPending");
    //     diceButton.classList.toggle("selected");
    //     this.dice[index].selected = !this.dice[index].selected;

    //     const unselectedDie = this.selectedDice.splice(index, 1)[0];
    //     unselectedDie.index = this.dice.length;
    //     this.dice.push(unselectedDie);

    //     this.selectedDice.forEach((die, idx) => {
    //         die.index = idx;
    //     });

    //     diceContainerPending.appendChild(diceButton);
    //     this.displayDice(this.dice);
    //     this.displayDiceSelected(this.selectedDice);

    //     console.log("Des:", this.dice);
    //     console.log("Des sélectionnés:", this.selectedDice);
    // }



    rollDice() {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");

        diceContainerPending.innerHTML = "";
        diceContainerSelected.innerHTML = "";
        const finaldices = this.selectedDice.concat(this.dice);

        if (this.attempts < 2) {
            this.dice = this.generateDice(this.dice.length);
            this.displayDice(this.dice);
            this.displayDiceSelected(this.selectedDice);
            this.attempts++;
        } else {
            console.log("Plus de 3 essais")
            this.button.remove();


            this.displayDice();
            this.displayDiceSelected(finaldices);
        }

        this.sheet.compare(finaldices)
    }

}
const game = new Game();
