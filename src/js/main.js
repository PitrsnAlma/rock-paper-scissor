import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import PreloadScene from "./scenes/PreloadScene.js";
import IntroScene from "./scenes/IntroScene.js";
import GameRestart from "./scenes/GameRestart.js";
import AudioManagerPlugin from "./plugins/AudioManager.js";

import '../styles/main.scss';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [PreloadScene, IntroScene, GameScene, GameRestart],
    parent: 'game-container',
    plugins: {
        global: [
            { key: 'AudioManagerPlugin', plugin: AudioManagerPlugin, mapping: 'AudioManager' }
        ]
    }
};

new Phaser.Game(config);