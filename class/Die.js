export default class Die {
    constructor(value, index, callback) {
        this.value = value;
        this.index = index;
        this.selected = false;
        this.callback = callback;
    }

    /*
    Créer un dé
    */
    createDie() {
        const dieButton = document.createElement("button");
        dieButton.className = "dice" + (this.selected ? " selected" : "");
        dieButton.textContent = this.value;
        if (!this.selected) {
            dieButton.onclick = () => {
                this.selected = !this.selected;
                this.displayDice(this.selected, dieButton)
                this.callback(this);
            };
        }

        this.displayDice(this.selected, dieButton)
    }

    /*
    Afficher un dé en fonction de son état
    */
    displayDice(selected, dieButton) {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        if (selected) {
            diceContainerSelected.appendChild(dieButton);
        } else {
            diceContainerPending.appendChild(dieButton);
        }
    }

    /*
    Changer l'état d'un dé
    */
    changeSelectedDie() {
        this.selected = true;
    }
}