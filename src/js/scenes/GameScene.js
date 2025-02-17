import {
    createEnemy,
    moveTowardsNearestEnemy,
    TYPE_ROCK,
    TYPE_PAPER,
    TYPE_SCISSOR,
    resolveCollision,
    addForceIfStuck,
    constrainToBounds
} from "../helpers/Enemy.js";
import Stats from "../helpers/Stats.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    enemies = [];
    Stats = new Stats();
    MAKE_UPDATE = true;

    async create() {
        this.enemies = [];
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.game.config.width, this.game.config.height);
        this.Stats.enableStatistics();

        const totalTimeToSpawn = 1000;
        const enemiesCountPerType = 20;
        const spawnDelay = totalTimeToSpawn / (enemiesCountPerType * 3);
        this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height);
        this.scene.pause("GameScene");

        for (let i = 0; i < enemiesCountPerType; i++) {
            this.enemies.push(createEnemy(this, TYPE_ROCK));
            await new Promise(resolve => setTimeout(resolve, spawnDelay));
            this.enemies.push(createEnemy(this, TYPE_PAPER));
            await new Promise(resolve => setTimeout(resolve, spawnDelay));
            this.enemies.push(createEnemy(this, TYPE_SCISSOR));
            await new Promise(resolve => setTimeout(resolve, spawnDelay));
        }

        this.scene.resume("GameScene");

        this.matter.world.on("collisionstart", (event, killer, victim) => {
            if(!this.MAKE_UPDATE) return;
            if(killer.gameObject === null || victim.gameObject === null) return;

            this.enemies = resolveCollision(killer.gameObject, victim.gameObject, this.enemies, this);
        });

        this.matter.world.on("collisionactive", (event, killer, victim) => {
            if(!this.MAKE_UPDATE) return;
            if(killer.gameObject === null || victim.gameObject === null) return;

            this.enemies = resolveCollision(killer.gameObject, victim.gameObject, this.enemies, this);
        });
    }

    update() {
        if(!this.MAKE_UPDATE) return;
        this.Stats.update(this.enemies);

        this.enemies.forEach(enemy => {
            moveTowardsNearestEnemy(this, enemy, this.enemies);
            addForceIfStuck(enemy);
            constrainToBounds(enemy, this);
        });

        const countRocks = this.enemies.filter(enemy => enemy.type === TYPE_ROCK).length;
        const countPapers = this.enemies.filter(enemy => enemy.type === TYPE_PAPER).length;
        const countScissors = this.enemies.filter(enemy => enemy.type === TYPE_SCISSOR).length;

        if (
            (countRocks === 0 && countPapers === 0) ||
            (countRocks === 0 && countScissors === 0) ||
            (countPapers === 0 && countScissors === 0)
        ) {
            this.scene.stop();
            this.scene.start("GameRestart", {winner : this.Stats.getWinningTeam()});
        }

    }
}
