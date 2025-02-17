import { TYPE_ROCK, TYPE_SCISSOR, TYPE_PAPER } from "../helpers/Enemy.js";
import { TYPE_AUDIO_BACKGROUND, TYPE_AUDIO_ROCK, TYPE_AUDIO_SCISSOR, TYPE_AUDIO_PAPER } from "../plugins/AudioManager.js";

export default class PreloadScene extends Phaser.Scene {
    ASSETS = [
        { key: TYPE_PAPER, value: "./src/assets/paper.png", type: "image" },
        { key: TYPE_ROCK, value: "./src/assets/rock.png", type: "image" },
        { key: TYPE_SCISSOR, value: "./src/assets/scissor.png", type: "image" },
        { key: "background", value: "./src/assets/background.jpg", type: "image" },
        { key: TYPE_AUDIO_BACKGROUND, value: './src/audio/background.mp3', type: "audio"},
        { key: TYPE_AUDIO_ROCK, value: './src/audio/rock.ogg', type: "audio"},
        { key: TYPE_AUDIO_PAPER, value: './src/audio/paper.ogg', type: "audio"},
        { key: TYPE_AUDIO_SCISSOR, value: './src/audio/scissor.ogg', type: "audio"},
    ];
    constructor() {
        super("PreloadScene");
    }

    async preload() {
        // Přidání textu pro loading stav
        let loadingText = this.add.text(400, 500, "Loading: 0%", {
            fontSize: "24px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: "#ffffff",
        }).setOrigin(0.5);

        let loadingTextProgress = this.add.text(400, 520, "0/" + this.ASSETS.length, {
            fontSize: "20px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: "#ffffff",
        }).setOrigin(0.5);



        let loadedAssets = 0;
        this.load.on("filecomplete", () => {
            loadedAssets++;
            loadingText.setText(`Loading: ${Math.floor(((loadedAssets + 1) / this.ASSETS.length) * 100)}%`);
            loadingTextProgress.setText(`${loadedAssets + 1}/${this.ASSETS.length}`);
        });

        for (const asset of this.ASSETS) {
            if (asset.type === "image") {
                this.load.image(asset.key, asset.value);
            } else if (asset.type === "audio") {
                this.load.audio(asset.key, asset.value);
            }
        }
    }

    create() {
        this.scene.start("IntroScene");
        //this.scene.start("GameScene");
    }
}
