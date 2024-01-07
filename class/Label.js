export default class Label {
    constructor(slug, innerHTML) {
        const diceContainer = document.getElementById("diceContainer");
        this.label = document.createElement("p");
        this.label.className = slug;
        this.label.innerHTML = innerHTML;
        diceContainer.appendChild(this.label);
    }

    /*
    Modifier le contenu du label à partir du slug
    */
    changeInnerHtml(slug, innerHTML) {
    }
    
    /*
    Supprimer le label à partir du slug
    */
    remove(slug) {
    }
}
