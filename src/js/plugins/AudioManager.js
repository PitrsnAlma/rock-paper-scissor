import LocalStorageHelper from "../helpers/LocalStorage.js";

const TYPE_AUDIO_BACKGROUND = "backgroundMusic";
const TYPE_AUDIO_ROCK = "rock";
const TYPE_AUDIO_PAPER = "paper";
const TYPE_AUDIO_SCISSOR = "scissor";
class AudioManagerPlugin extends Phaser.Plugins.BasePlugin {

    speakerElm = null;
    volumeElm = null;

    controlsElm = null;

    speakerControlClass = ["on", "is-muted"];
    audioFiles = [];

    volumeLocalStorageKey = "prs-volume";

    constructor(pluginManager) {
        super(pluginManager);

        this.speakerElm = document.querySelector(".speaker") || null;
        this.volumeElm = document.querySelector("#volume") || null;
        this.controlsElm = document.querySelector("#controls") || null;
    }

    start() {
        this.initSpeakerButton();
        this.handleMuteButton();
        this.initVolumeButton();
        this.handleVolumeChange();

        this.game.sound.volume = this.getVolumeFromLocalStorage();
    }

    addSounds() {
        const audioTypes = [TYPE_AUDIO_BACKGROUND, TYPE_AUDIO_ROCK, TYPE_AUDIO_PAPER, TYPE_AUDIO_SCISSOR];

        audioTypes.forEach((audioType) => {
            if(!this.audioFiles[audioType]){
                this.audioFiles[audioType] = this.pluginManager.game.sound.add(audioType);
            }
        });
    }

    initSpeakerButton() {
        if (this.game.sound.mute) {
            this.muteSpeaker();
        } else {
            this.unMuteSpeaker();
        }
    }

    initVolumeButton() {
        setTimeout(() => {
            if (this.volumeElm) {
                this.volumeElm.value = this.game.sound.volume * 100;
            }
        }, 300);
    }

    handleMuteButton() {
        if (this.speakerElm) {
            this.speakerElm.addEventListener("click", () => {
                if (this.game.sound.mute) {
                    this.pluginManager.game.sound.setMute(false);
                    this.unMuteSpeaker();
                } else {
                    this.game.sound.setMute(true);
                    this.muteSpeaker();
                }
            });
        }
    }

    handleVolumeChange() {
        if (this.volumeElm) {
            this.volumeElm.addEventListener("change", () => {
                const value = this.volumeElm.value;
                this.pluginManager.game.sound.setVolume(this.volumeElm.value / 100);
                this.saveVolumeToLocalStorage();

                if(value === "0") {
                    this.muteSpeaker();
                } else {
                    this.unMuteSpeaker();
                };
            });
        }
    }

    muteSpeaker() {
        this.speakerElm.classList.add(...this.speakerControlClass);
    }

    unMuteSpeaker() {
        this.speakerElm.classList.remove(...this.speakerControlClass);
    }

    play(type, config = {}) {
        this.addSounds();

        if(this.audioFiles[type]){
            this.audioFiles[type].loop = config.loop || false;
            this.audioFiles[type].volume = config.volume || 1;
            this.audioFiles[type].play();
        }
    }

    stop() {
        this.bgMusic.stop();
    }

    saveVolumeToLocalStorage() {
        LocalStorageHelper.setItem(this.volumeLocalStorageKey, parseFloat(this.game.sound.volume.toFixed(2)));
    }

    getVolumeFromLocalStorage() {
        return LocalStorageHelper.getItem(this.volumeLocalStorageKey) || 0.5;
    }
}

export default AudioManagerPlugin;
export { TYPE_AUDIO_BACKGROUND, TYPE_AUDIO_ROCK, TYPE_AUDIO_PAPER, TYPE_AUDIO_SCISSOR };
