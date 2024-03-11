export default class Sound {
    constructor() {
        window.addEventListener("DOMContentLoaded", this.createMusic(this));

        this.toggleBtnSoundMenu()
        this.soundEnabled = localStorage.getItem("soundEnabled") === "true";
    }

    toggleBtnSoundMenu() {
        let element = document.getElementById("btn-audio");
        element.addEventListener('click', (e) => {

            element.classList.toggle("active");
            this.soundEnabled = !this.soundEnabled;
            console.log(this.soundEnabled)
            localStorage.setItem("soundEnabled", this.soundEnabled);
            if (this.soundEnabled) {
                this.audioElement.play();
            } else {
                this.audioElement.pause();
            }
        })
    }
    createMusic() {
        this.audioElement = document.createElement("audio");
        this.audioElement.setAttribute("src", "./assets/songs/music.mp3");
        this.audioElement.setAttribute("preload", "auto");
        this.audioElement.setAttribute("loop", "");

        if (this.soundEnabled) {
            this.audioElement.play();
        }

        let container = document.querySelector("header");
        container.appendChild(this.audioElement);
    }
}
