import { throwDice } from '../model/diceLogic.js';

export default class Button {
    constructor(slug, innerHTML) {
        this.button = document.createElement("button");
        this.button.className = slug;
        this.button.id = slug;
        this.button.innerHTML = innerHTML;
        this.button.addEventListener('click', throwDice);
    }
    existButton() {
        const button = document.querySelector("." + this.button.className);
        return button ? true : false
    }
    addButton() {
        const controls = document.querySelector(".ui-controls");
        controls.appendChild(this.button);
    }
    removeButton() {
        const controls = document.querySelector(".ui-controls");
        controls.removeChild(this.button);
    }
}
