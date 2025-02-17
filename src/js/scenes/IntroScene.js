import {COLOR_PRIMARY, COLOR_STROKE, COLOR_WHITE} from "./Colors";
import {TYPE_AUDIO_BACKGROUND} from "../plugins/AudioManager";
export default class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }

    create() {
        this.add.image(400, 300, "background").setDisplaySize(this.game.config.width, this.game.config.height);

        this.add.text(400, 150, "ROCK PAPER SCISSORS", {
            fontSize: "42px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: COLOR_PRIMARY,
            stroke: COLOR_STROKE,
            strokeThickness: 6
        }).setOrigin(0.5);

        let whoText = this.createFallingText("WHO", 250);
        let willText = this.createFallingText("WILL", 310);
        let prevailText = this.createFallingText("PREVAIL???", 370);

        this.animateText(whoText, 600, () => {
            this.animateText(willText, 200, () => {
                this.animateText(prevailText, 200, () => {
                    this.createStartButton();
                });
            });
        });

        this.AudioManager.play(TYPE_AUDIO_BACKGROUND, { loop: true, volume: 0.1 });
    }

    createFallingText(text, targetY) {
        return this.add.text(400, -100, text, {
            fontSize: "48px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: COLOR_PRIMARY,
            stroke: COLOR_STROKE,
            strokeThickness: 6
        }).setOrigin(0.5).setData("targetY", targetY);
    }

    animateText(textObj, delay, onComplete = null) {
        this.tweens.add({
            targets: textObj,
            y: textObj.getData("targetY"),
            duration: 800,
            delay: delay,
            ease: "Bounce.easeOut",
            onComplete: onComplete
        });
    }

    createStartButton() {
        let startButton = this.add.text(400, 450, "LET'S FIND OUT", {
            fontSize: "32px",
            fontWeight: "bold",
            fontFamily: "SpaceNova",
            color: COLOR_STROKE,
            backgroundColor: COLOR_PRIMARY,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on("pointerover", () => startButton.setBackgroundColor(COLOR_STROKE).setColor(COLOR_WHITE));
        startButton.on("pointerout", () => startButton.setBackgroundColor(COLOR_PRIMARY).setColor(COLOR_STROKE));
        startButton.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }
}
