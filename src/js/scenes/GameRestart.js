import {COLOR_PRIMARY, COLOR_STROKE, COLOR_WHITE} from "./Colors";
export default class GameRestart extends Phaser.Scene {
    constructor() {
        super("GameRestart");
    }

    create(data) {
        this.add.image(400, 300, "background").setDisplaySize(this.game.config.width, this.game.config.height);


        this.add.text(400, 150, "Winner is: " + data.winner, {
            fontSize: "42px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: COLOR_PRIMARY,
            stroke: COLOR_STROKE,
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 200, "Cool? Huh?", {
            fontSize: "42px",
            fontFamily: "SpaceNova",
            fontWeight: "bold",
            color: COLOR_PRIMARY,
            stroke: COLOR_STROKE,
            strokeThickness: 6
        }).setOrigin(0.5);

        this.createStartButton();
    }

    createStartButton() {
        let startButton = this.add.text(400, 450, "Again!", {
            fontSize: "32px",
            fontWeight: "bold",
            fontFamily: "SpaceNova",
            color: COLOR_STROKE,
            backgroundColor: COLOR_PRIMARY,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on("pointerover", () => startButton.setBackgroundColor(COLOR_STROKE).setColor(COLOR_WHITE));
        startButton.on("pointerout", () => startButton.setBackgroundColor(COLOR_PRIMARY).setColor(COLOR_STROKE));
        startButton.on("pointerdown", () => this.scene.start("GameScene"));
    }
}
