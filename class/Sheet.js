

export default class Sheet {
    constructor(callback) {
        this.sheet = [
            { slug: 1, label: 1, value: null, checked: false },
            { slug: 2, label: 2, value: null, checked: false },
            { slug: 3, label: 3, value: null, checked: false },
            { slug: 4, label: 4, value: null, checked: false },
            { slug: 5, label: 5, value: null, checked: false },
            { slug: 6, label: 6, value: null, checked: false },
            { slug: "chance", label: "Chance", value: null, checked: false },
            { slug: "sm-straight", label: "Petite suite", value: null, checked: false },
            { slug: "lg-straight", label: "Grande suite", value: null, checked: false },
            { slug: "full", label: "Full", value: null, checked: false },
            { slug: "four-kind", label: "Carré", value: null, checked: false },
            { slug: "yams", label: "Yam's", value: null, checked: false }
        ];
        this.callback = callback;
        this.bonus = false;
    }

    /*
    Comparer les valeurs du tableau de score à partir des dés
    */
    compare(dice) {
        dice.sort((a, b) => a.value - b.value);
        const counts = this.countDiceValues(dice);

        // Yam's
        this.updateYamsScore(counts);
        // Carré
        this.updateFourOfAKindScore(counts);
        // Full
        this.updateFullScore(counts);
        // Petite suite
        this.updateStraightScore(dice, "sm-straight");
        // Grande suite
        this.updateStraightScore(dice, "lg-straight");
        // Chance
        this.updateChanceScore(dice);
        // Chiffres
        this.updateNumberScore(dice);

    }

    countDiceValues(dice) {
        const counts = {};
        dice.forEach((die) => {
            counts[die.value] = (counts[die.value] || 0) + 1;
        });
        return counts;
    }

    updateYamsScore(counts) {
        const item = this.sheet.find(item => item.slug === "yams");
        if (!item.checked && Object.values(counts).includes(5)) {
            item.value = 50;
        } else {
            item.value = null;
        }
    }

    updateFourOfAKindScore(counts) {
        const item = this.sheet.find(item => item.slug === "four-kind");
        if (!item.checked) {
            if (Object.values(counts).includes(4)) {
                const fourOfAKindValue = Object.keys(counts).find(key => counts[key] === 4);
                const nonFourOfAKindValue = Object.keys(counts).find(key => counts[key] !== 4);
                if (fourOfAKindValue && nonFourOfAKindValue) {
                    const sumOfDice = parseInt(fourOfAKindValue) * 4 + parseInt(nonFourOfAKindValue);
                    item.value = sumOfDice;
                }
            } else {
                item.value = null;
            }
        }
    }

    updateStraightScore(dice, slug) {
        let diceValue = [];
        dice.forEach((die) => {
            diceValue.push(die.value);
        });
        const diceSort = [...new Set(diceValue)];

        let maxNumber = 0
        let score = 0
        switch (true) {
            case slug == "sm-straight":
                maxNumber = 4
                score = 30
                break;
            case slug == "lg-straight":
                maxNumber = 5
                score = 40
                break;
        }
        const straight = diceSort.length >= maxNumber && (diceSort[maxNumber - 1] - diceSort[0] === maxNumber - 1)
        console.log(straight)
        const item = this.sheet.find(item => item.slug === slug);
        if (!item.checked) {
            if (straight) {
                item.value = score;
            } else {
                item.value = null;
            }
        }
    }

    updateFullScore(counts) {
        const item = this.sheet.find(item => item.slug === "full");
        if (!item.checked) {
            if (Object.values(counts).includes(3) && Object.values(counts).includes(2)) {
                const threeOfAKindValue = Object.keys(counts).find(key => counts[key] === 3);
                const twoOfAKindValue = Object.keys(counts).find(key => counts[key] === 2);
                if (threeOfAKindValue !== twoOfAKindValue) {
                    item.value = 25;
                }
            } else {
                item.value = null;
            }
        }
    }

    updateNumberScore(dice) {
        for (let i = 1; i <= 6; i++) {
            const count = dice.filter(die => die.value === i).length;
            if (!this.sheet.find(item => item.slug === i).checked) {
                this.sheet.find(item => item.slug == i).value = count * i;
            }
        }
    }

    updateChanceScore(dice) {
        const item = this.sheet.find(item => item.slug === "chance");
        if (!item.checked) {
            let sum = 0;
            dice.forEach((die) => {
                sum += die.value;
            });
            item.value = sum;
        }
    }

    updateBonus() {
        let sum = 0;
        for (let i = 1; i <= 6; i++) {
            if (this.sheet.find(item => item.slug === i).checked) {
                const value = this.sheet.find(item => item.slug === i).value;
                if (value !== null) {
                    console.log(sum)
                    sum += value;
                }
            }
        }
        if (sum >= 63) {
            this.bonus = true;
        } else {
            this.bonus = false;
        }
    }

    updateScore() {
        // update score
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
