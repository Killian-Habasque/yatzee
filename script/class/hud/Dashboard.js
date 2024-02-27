
export default class Dashboard {
    constructor() {
        this.scoreResult = document.querySelector('#score-result')
        this.attemps = document.querySelector('#nb-attempts')
    }
    clearScore() {
        this.scoreResult.innerHTML = '';
    }
    changeAttemps(attemps) {
        this.attemps.innerHTML = attemps;
    }
    addScore(score) {
        if (this.scoreResult.innerHTML === '') {
            this.scoreResult.innerHTML += score;
        } else {
            this.scoreResult.innerHTML += (' - ' + score);
        }
    }
}
