

export default class Sheet {
    constructor(callback) {
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
        this.callback = callback;
        this.score = null;
    }

    /*
    Comparer les valeurs du tableau de score à partir des dés
    */
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
                    if (fourOfAKindValue) {
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

    /*
    Afficher le tableau des scores
    */
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
                    this.callback();
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
