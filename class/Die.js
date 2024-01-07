export default class Die {
    constructor(value, index, game) {
        this.value = value;
        this.index = index;
        this.selected = false;
        this.game = game;
    }
    createDie() {
        const dieButton = document.createElement("button");
        dieButton.className = "dice" + (this.selected ? " selected" : "");
        dieButton.textContent = this.value;
        if (!this.selected) {
            dieButton.onclick = () => {
                this.selected = !this.selected;
                this.displayDice(this.selected, dieButton)
                this.game.toggleDice(this);
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