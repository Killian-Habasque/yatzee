

class Game {

    constructor() {
        this.des = this.genereDes(5);
        this.desSelec = [];
        this.genereButton();
        this.afficherDes(this.des, this.desSelec);
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
        button.innerHTML = "Lancer les dés";
        button.onclick = () => {
            this.relancerDes();
        };
        document.body.appendChild(button);
    }

    afficherDes(desAfficher, desSelec) {
        // let diceContainer = document.getElementById("diceContainer");

        let diceContainerSelect = document.getElementById("diceContainerSelected");
        let diceContainer = document.getElementById("diceContainerPending");

        diceContainer.innerHTML = "";
        desAfficher.forEach((valeur, index) => {
            const diceButton = document.createElement("button");
            diceButton.className = "dice";
            diceButton.textContent = valeur;
            diceButton.onclick = () => {
                this.selectionDe(diceButton, index);
            };
            diceContainer.appendChild(diceButton);
        });

        desSelec.forEach((valeur, index) => {
            const diceButton = document.createElement("button");
            diceButton.className = "dice";
            diceButton.textContent = valeur;
            diceButton.onclick = () => {
                this.selectionDe(diceButton, index);
            };
            diceContainerSelect.appendChild(diceButton);
        });
    }
    selectionDe(diceButton, index) {
        const diceContainerSelected = document.getElementById("diceContainerSelected");
        const diceContainer = document.getElementById("diceContainerPending");
        const parentContainer = diceButton.parentElement;
        console.log(parentContainer.id)
        if (parentContainer.id === "diceContainerPending") {
            diceContainerSelected.appendChild(diceButton);
            this.desSelec.push(this.des[index]); // Ajoute la valeur dans desSelec
            this.des.splice(index, 1); // Supprime la valeur de des
        } else {
            diceContainer.appendChild(diceButton);
            console.log(index)
            this.des.push(this.desSelec[index]); // Ajoute la valeur dans des
            
            this.desSelec.splice(index, 1); 
            // this.desSelec.push(this.des[index]);
            // const value = this.desSelec.splice(index, 1)[0]; // Récupère la valeur de desSelec
            // this.des.push(value);
        }

        diceButton.classList.toggle("selected");
        console.log("Des:", this.des);
        console.log("Des sélectionnés:", this.desSelec);
    }



    relancerDes() {

        // const diceButtons = document.getElementsByClassName("dice");
        // for (let i = 0; i < diceButtons.length; i++) {
        //     if (diceButtons[i].classList.contains("selected")) {
        //         this.desSelec.push(i);
        //     }
        // }
        console.log("____________")
        console.log(this.des)

        console.log("____________")
        console.log(this.desSelec)


    }


}
