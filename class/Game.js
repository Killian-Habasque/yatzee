import Button from './Button.js';
// import Label from './Label.js';
import Die from './Die.js';
import Sheet from './Sheet.js';

export default class Game {

    constructor() {
        this.dice = [];
        this.selectedDice = [];
        this.maxAttempts = 3;
        this.attempts = 0;
        this.turn = 0;
        this.sheet = [];
        this.initialize();
    }
 
    /*
    Lancer un tour
    */   
    initialize() {
        this.dice = this.generateDice(5);
        this.displayAllDice(this.dice);
        this.button = new Button("submit", "Lancer les dés", () => this.rollDice())
        // this.label = new Label("final", "Lancer les dés")
        this.sheet = new Sheet(() => this.reinitialize());
        this.sheet.compare(this.dice);
        this.sheet.displaySheet();
    }
     
    /*
    Relancer un tour
    */   
    reinitialize() {
        this.turn++;
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        diceContainerPending.innerHTML = "";
        diceContainerSelected.innerHTML = "";
        if (this.sheet.sheet.length > this.turn) {
            this.dice = this.generateDice(5);
            this.displayAllDice(this.dice);
        } else {
            this.button.remove();
        }
        if (this.attempts >= this.maxAttempts) {
            this.button = new Button("submit", "Lancer les dés", () => this.rollDice())
        }
        this.attempts = 0;
        this.selectedDice = [];

        this.sheet = this.sheet;
        this.sheet.compare([...this.selectedDice, ...this.dice]);
        this.sheet.displaySheet();
    }

    /*
    Générer des dés aléatoirement
    */   
    generateDice(numDice) {
        return Array.from({ length: numDice }, (value, index) => new Die(Math.floor(Math.random() * 6) + 1, index, () => this.toggleDice));
    }

    /*
    Mettre à jour les tableaux de dés
    */   
    toggleDice(die) {
        this.dice.push(die);
        this.dice = this.dice.filter(die => !die.selected);
        this.selectedDice.push(die);
        this.selectedDice = this.selectedDice.filter(die => die.selected);

        console.log(this.selectedDice)
        console.log(this.dice)
    }

    /*
    Afficher les dés
    */  
    displayAllDice(dice) {
        dice.forEach(die => {
            die.createDie();
        });
    }

    /*
    Relancer les dés
    */  
    rollDice() {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");

        this.attempts++;
        console.log(this.attempts)
        console.log(this.maxAttempts)

        diceContainerPending.innerHTML = "";
        const nonSelectedDice = this.dice.filter(die => !die.selected);

        nonSelectedDice.forEach(die => {
            die.value = Math.floor(Math.random() * 6) + 1;
            if (this.attempts != this.maxAttempts) {
            die.createDie();
            }
        });

        if (this.attempts >= this.maxAttempts) {
            console.log("Plus de 3 essais");
            diceContainerSelected.innerHTML = "";
            this.dice = [...this.selectedDice, ...this.dice];
            this.dice.forEach(die => {
                die.changeSelectedDie();
                die.createDie()
            });
            this.button.remove();
            console.log(this.dice)
            this.sheet.compare(this.dice);
        } else {
            this.sheet.compare([...this.selectedDice, ...this.dice]);
        }
        
        this.sheet.displaySheet();
        this.sheet.updateBonus();
    }
}
