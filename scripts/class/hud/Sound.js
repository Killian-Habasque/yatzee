const src = "./assets/songs/"


export default class Sound {
    static soundList = [];

    constructor(filename, volume, loop) {
        this.audio = new Audio(src + filename);
        volume ? this.audio.volume = volume : '';
        loop ? this.audio.loop = loop : '';

        this.audio.addEventListener('playing', () => {
           
            setTimeout(() => {
                if (!this.audio.loop) { 
                    console.log('"____before')
                    console.log(Sound.soundList)
                    this.removeFromList();
                    console.log('"____after')
                    console.log(Sound.soundList)
                }
            }, this.audio.duration * 1000);
        });
        Sound.soundList.push(this);
    }
    playSound() {
        let soundEnabled = localStorage.getItem("soundEnabled") === "true";
        console.log(soundEnabled)
        if (soundEnabled) {
            this.audio.play()
        }
    }
    pauseSound() {
        this.audio.pause()
    }
    removeFromList() {
        const index = Sound.soundList.indexOf(this);
        if (index !== -1) {
            Sound.soundList.splice(index, 1);
        }
    }
    static pauseAllSound() {
        console.log(Sound.soundList)
        Sound.soundList.forEach(sound => {
            sound.pauseSound();
        });
    }
    static playAllSound() {
        console.log(Sound.soundList)
        Sound.soundList.forEach(sound => {
            sound.playSound();
        });
    }
}
