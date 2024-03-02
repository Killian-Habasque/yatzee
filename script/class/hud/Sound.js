export default class Sound {
    constructor() {
        window.addEventListener("DOMContentLoaded", this.createMusic);
    }

    createMusic() {
            let audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "./assets/songs/music.mp3");
            audioElement.setAttribute("preload", "auto");
            audioElement.setAttribute("autoplay", "");
            // audioElement.setAttribute("controls", "");
            audioElement.setAttribute("loop", "");
            audioElement.textContent = "Your browser does not support the audio element.";
        
            let container = document.querySelector("header");
            container.appendChild(audioElement);
    }

    addSongToLocalStorage() {
        if (!localStorage.getItem("song")) {
            localStorage.setItem("song", "true");
        }
    }
    
}
