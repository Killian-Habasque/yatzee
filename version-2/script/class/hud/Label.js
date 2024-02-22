export default class Label {
    constructor(slug, innerHTML, time) {
        this.label = document.createElement("p");
        this.label.className = slug;
        this.label.innerHTML = innerHTML;

        const diceContainer = document.querySelector(".game__main");
        diceContainer.appendChild(this.label);
        if(time) {
            setTimeout(() => {
                diceContainer.removeChild(this.label);
            }, time);
        }
    }
}
