
class Sheet {
    constructor() {
        this.sheet = [
            { label: 1, value: null, checked: false },
            { label: 2, value: null, checked: false },
            { label: 3, value: null, checked: false },
            { label: 4, value: null, checked: false },
            { label: 5, value: null, checked: false },
            { label: 6, value: null, checked: false },
            { label: "Chance", value: null, checked: false },
            { label: "Petite suite", value: null, checked: false },
            { label: "Grande suite", value: null, checked: false },
            { label: "Full", value: null, checked: false },
            { label: "Carré", value: null, checked: false },
            { label: "Yam's", value: null, checked: false }
        ];

        this.score = null;
    }

    compare(dice) {
        dice.sort((a, b) => a.value - b.value);
        const counts = {};
        dice.forEach((die) => {
            counts[die.value] = (counts[die.value] || 0) + 1;
        });
        console.log(counts)
        switch (true) {
            case Object.values(counts).includes(5):
                // Yam's
                // this.sheet.find(item => item.label === "Yam's").checked = true;
                if (!this.sheet.find(item => item.label === "Yam's").checked) {
                    this.sheet.find(item => item.label === "Yam's").value = 50;
                } else {
                    this.sheet.find(item => item.label === "Yam's").value = null;
                }
            case Object.values(counts).includes(4):
                // Carré
                if (!this.sheet.find(item => item.label === "Carré").checked) {
                    const fourOfAKindValue = Object.keys(counts).find(key => counts[key] === 4);
                    console.log(fourOfAKindValue)
                    if(fourOfAKindValue) {
                        const sumOfDice = dice.reduce((acc, curr) => acc + curr.value, 0);
                        this.sheet.find(item => item.label === "Carré").value = parseInt(fourOfAKindValue) * 4 + sumOfDice;
                    } else {
                        this.sheet.find(item => item.label === "Carré").value = null;
                    }
                    // this.sheet.find(item => item.label === "Carré").checked = true;                   
                } 
            case Object.values(counts).includes(3) && Object.values(counts).includes(2):
                // Full
                if (!this.sheet.find(item => item.label === "Full").checked) {
                    const threeOfAKindValue = Object.keys(counts).find(key => counts[key] === 3);
                    const twoOfAKindValue = Object.keys(counts).find(key => counts[key] === 2);
                    if (threeOfAKindValue !== twoOfAKindValue) {
                        this.sheet.find(item => item.label === "Full").value = 25;
                    } else {
                        this.sheet.find(item => item.label === "Full").value = null;
                    }
                }
            case Object.values(counts).includes(1):
                // Chiffres
                for (let i = 1; i <= 6; i++) {
                    const count = dice.filter(die => die.value === i).length;
                    if (!this.sheet.find(item => item.label === i).checked) {
                        this.sheet.find(item => item.label == i).value = count * i;
                    }

                }

                const isSmallStraight = () => {
                    let diceValue = [];
                    dice.forEach((die) => {
                        diceValue.push(die.value);
                    });
                    const diceSort = [...new Set(diceValue)];
                    return diceSort.length >= 4 && (diceSort[3] - diceSort[0] === 3);
                };

                const isLargeStraight = () => {
                    let diceValue = [];
                    dice.forEach((die) => {
                        diceValue.push(die.value);
                    });
                    const diceSort = [...new Set(diceValue)];
                    return diceSort.length === 5 && (diceSort[4] - diceSort[0] === 4);
                };

                // Petite suite
                if (!this.sheet.find(item => item.label === "Petite suite").checked) {
                    if (isSmallStraight()) {
                        // this.sheet.find(item => item.label === "Petite suite").checked = true;
                        this.sheet.find(item => item.label === "Petite suite").value = 30;
                    } else {
                        this.sheet.find(item => item.label === "Petite suite").value = null;
                    }
                }


                // Grande suite
                if (!this.sheet.find(item => item.label === "Grande suite").checked) {
                    if (isLargeStraight()) {
                        // this.sheet.find(item => item.label === "Grande suite").checked = true;
                        this.sheet.find(item => item.label === "Grande suite").value = 40;
                    } else {
                        this.sheet.find(item => item.label === "Grande suite").value = null;
                    }
                }

        }
    }


    displaySheet() {
        const table = document.getElementById('sheetTable');
        table.innerHTML = '';

        const tbody = document.createElement('tbody');
        for (const key in this.sheet) {
            const row = document.createElement('tr');
            const cellKey = document.createElement('td');
            cellKey.textContent = this.sheet[key].label;

            const cellValue = document.createElement('td');

            cellValue.textContent = this.sheet[key].value !== null ? this.sheet[key].value : '-';

            cellValue.dataset.key = key;

            if (!this.sheet[key].checked) {
                cellValue.onclick = () => {
                    this.sheet[key].checked = true;
                    console.log("--------")
                    console.log(this.sheet[key].value)
                    console.log("--------")
                    console.log(this.sheet)
                    cellValue.className = "selected";


                    const allCells = document.querySelectorAll('td');
                    allCells.forEach(cell => {
                        cell.onclick = null;
                    });
                    game.reinitialize();
                };
            }

            if (this.sheet[key].checked) {
                cellValue.className = "selected";
            }
            row.appendChild(cellKey);
            row.appendChild(cellValue);
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }

}


class Button {
    constructor(className, innerHTML, callback) {
        const diceContainer = document.getElementById("diceContainer");
        this.button = document.createElement("button");
        this.button.className = className;
        this.button.innerHTML = innerHTML;
        this.button.onclick = callback;
        diceContainer.appendChild(this.button);
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
    createDie() {
        const dieButton = document.createElement("button");
        dieButton.className = "dice" + (this.selected ? " selected" : "");
        dieButton.textContent = this.value;
        if (!this.selected) {
            dieButton.onclick = () => {
                this.selected = !this.selected;
                this.displayDice(this.selected, dieButton)
                game.toggleDice(this);
            };
        }

        this.displayDice(this.selected, dieButton)
    }
    displayDice(selected, dieButton) {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        if (selected) {
            diceContainerSelected.appendChild(dieButton);
        } else {
            diceContainerPending.appendChild(dieButton);
        }
    }
    changeSelectedDie() {
        this.selected = true;
    }
}


class Game {

    constructor() {
        this.dice = [];
        this.selectedDice = [];
        this.maxAttempts = 3;
        this.attempts = 0;
        this.turn = 0;
        this.sheet = [];
        this.initialize();
    }

    initialize() {
        this.dice = this.generateDice(5);
        this.displayAllDice(this.dice);
        this.button = new Button("submit", "Lancer les dés", () => this.rollDice())
        this.sheet = new Sheet()
    }
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
    generateDice(numDice) {
        return Array.from({ length: numDice }, (value, index) => new Die(Math.floor(Math.random() * 6) + 1, index));
    }
    toggleDice(die) {
        this.dice.push(die);
        this.dice = this.dice.filter(die => !die.selected);
        this.selectedDice.push(die);
        this.selectedDice = this.selectedDice.filter(die => die.selected);

        console.log(this.selectedDice)
        console.log(this.dice)
    }
    displayAllDice(dice) {
        dice.forEach(die => {
            die.createDie();
        });
    }


    rollDice() {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        // if (this.attempts == 0 && this.turn == 0) {
        //     this.dice = this.generateDice(5);
        //     this.displayAllDice(this.dice);
        // }
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
    }


}
const game = new Game();
