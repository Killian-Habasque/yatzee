

class Game {

    constructor() {
        this.des = this.genereDes(5);
        this.desSelec = [];
        this.genereButton();
        this.afficherDes(this.des);
        this.essai = 0
    }

    genereDes(nbrDes) {
        let desLancer = [];
        for (let i = 0; i < nbrDes; i++) {
            desLancer.push(Math.floor(Math.random() * 6) + 1);
        }
        return desLancer;
    }
    genereButton() {
        const button = document.createElement("button");
        button.className = "submit";
        button.innerHTML = "Lancer les dés";
        button.onclick = () => {
            this.relancerDes();
        };
        document.body.appendChild(button);
    }

    creerBoutonDe(valeur, index, isSelected, onclick = true) {
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
    afficherDesSelec(desAfficher, onclick) {
        let diceContainer = document.getElementById("diceContainerSelected");
        diceContainer.innerHTML = "";
        desAfficher.forEach((valeur, index) => {
            const diceButton = this.creerBoutonDe(valeur, index, true, onclick);
            diceContainer.appendChild(diceButton);
        });
    }

    afficherDes(desAfficher) {
        if(desAfficher) {
            let diceContainer = document.getElementById("diceContainerPending");
            diceContainer.innerHTML = "";
            desAfficher.forEach((valeur, index) => {
                const diceButton = this.creerBoutonDe(valeur, index, false);
                diceContainer.appendChild(diceButton);
            });
        }
    }

    selectionDe(diceButton, index) {
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        diceButton.classList.add("selected");
        this.desSelec.push(this.des[index]);
        this.des.splice(index, 1);
        diceContainerSelected.appendChild(diceButton);
        this.afficherDes(this.des);
        this.afficherDesSelec(this.desSelec);
        console.log("Des:", this.des);
        console.log("Des sélectionnés:", this.desSelec);
    }

    selectionDeSelected(diceButton, index) {
        const diceContainerPending = document.getElementById("diceContainerPending");
        diceButton.classList.remove("selected");
        this.des.push(this.desSelec[index]);
        this.desSelec.splice(index, 1);
        diceContainerPending.appendChild(diceButton);
        this.afficherDes(this.des);
        this.afficherDesSelec(this.desSelec);

        console.log("Des:", this.des);
        console.log("Des sélectionnés:", this.desSelec);
    }
    removeButton() {
        const button = document.querySelector(".submit");
        document.body.removeChild(button);
    }
    relancerDes() {
        const diceContainerPending = document.getElementById("diceContainerPending");
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        
        diceContainerPending.innerHTML = "";
        diceContainerSelected.innerHTML = "";
        if(this.essai < 2) {
            this.des = this.genereDes(this.des.length);
            this.afficherDes(this.des);
            this.afficherDesSelec(this.desSelec);
            this.essai++;
        } else {
            console.log("Plus de 3 essais")
            this.removeButton();
            const finaldices = this.desSelec.concat(this.des);
            console.log(finaldices)
            this.afficherDes();
            this.afficherDesSelec(finaldices, false);
        }

    }

}
