
export default class Dashboard {
    static maxAttemps = 3
    
    constructor() {
        this.scoreResult = document.querySelector('#score-result')
        this.attemps = document.querySelector('#nb-attempts')
        this.attemps.innerHTML = Dashboard.maxAttemps
    }
    clearScore() {
        this.scoreResult.innerHTML = '';
    }
    changeAttemps(attemps) {
        this.attemps.innerHTML = Dashboard.maxAttemps - attemps;
    }
    addScore(score) {
        if (this.scoreResult.innerHTML === '') {
            this.scoreResult.innerHTML += score;
        } else {
            this.scoreResult.innerHTML += (' - ' + score);
        }
    }
}
