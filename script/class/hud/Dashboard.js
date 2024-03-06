import { gameData } from "../../main";

export default class Dashboard {
    constructor() {
        this.attemps = document.querySelector('#nb-attempts')
        this.attemps.innerHTML = gameData.maxAttemps
    }
    changeAttemps(attemps) {
        this.attemps.innerHTML = gameData.maxAttemps - attemps;
    }

}
