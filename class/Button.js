export default class Button {
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
