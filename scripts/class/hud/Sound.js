const src = "./assets/songs/"

export default class Sound {
    constructor() {
        this.toggleBtnSoundMenu()
        this.soundEnabled = localStorage.getItem("soundEnabled") === "true";

        this.music = Sound.createSound("music.mp3", 0.05, true)
        // Sound.playSound(this.music)
    }

    toggleBtnSoundMenu() {
        let element = document.getElementById("btn-audio");
        element.addEventListener('click', (e) => {
            if (!this.soundEnabled) {
                element.classList.add("active");
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem("soundEnabled", this.soundEnabled);
                Sound.playSound(this.music)
            } else {     
                element.classList.remove("active");
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem("soundEnabled", this.soundEnabled);
                Sound.pauseSound(this.music)
            }
            
        })
    }
    static createSound(filename, volume, loop) {
        let audio = new Audio(src + filename);
        volume ? audio.volume = volume : '';
        loop ? audio.loop = loop : '';
        return audio
    }

    static playSound(audio) {
        let soundEnabled = localStorage.getItem("soundEnabled") === "true";
        console.log(soundEnabled)
        soundEnabled ? audio.play() : '';
    }
    static pauseSound(audio) {
        let soundEnabled = localStorage.getItem("soundEnabled") === "true";
        !soundEnabled ? audio.pause() : '';
    }
}
