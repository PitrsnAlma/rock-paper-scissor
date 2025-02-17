import Phaser from "phaser";
import {TYPE_AUDIO_PAPER, TYPE_AUDIO_ROCK, TYPE_AUDIO_SCISSOR} from "../plugins/AudioManager.js";
const TYPE_ROCK = "rock";
const TYPE_PAPER = "paper";
const TYPE_SCISSOR = "scissor";

const ENEMY_SIZE = 40;
const MIN_DISTANCE = 20;

const MASK_ROCK = 0x0001;    // Rock má vlastní masku
const MASK_PAPER = 0x0002;   // Paper má vlastní masku
const MASK_SCISSOR = 0x0004; // Scissors má vlastní masku

const generateRandomPosition = (scene) => {
    let x, y;
    let safePositionFound = false;
    let attempts = 0;

    while (!safePositionFound && attempts < 100) {
        x = Phaser.Math.Between(0,800);
        y = Phaser.Math.Between(0,600);

        safePositionFound = true;

        for (const otherEnemy of scene.enemies) {
            const dx = otherEnemy.object.x - x;
            const dy = otherEnemy.object.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MIN_DISTANCE) {
                safePositionFound = false;
                break;
            }
        }
        attempts++;
    }

    return { x, y };
};
const createEnemy = (scene, type, position) => {
    let x, y = 0;

    if (!position) {
        const randomPosition = generateRandomPosition(scene);
        x = randomPosition.x;
        y = randomPosition.y;
    } else {
        x = position.x;
        y = position.y;
    }

    let enemy = null;

    if (type === TYPE_ROCK) {
        const width = ENEMY_SIZE;
        const height = ENEMY_SIZE;
        enemy = scene.matter.add.image(x, y, type);
        enemy.setDisplaySize(width, height);
        enemy.setBody({
            type: "circle",
            radius: width / 2,
            restitution: 0.6,
            frictionAir: 0.05,
            friction: 0.2
        });
        // Nastavení category a masky pro rock
        enemy.body.collisionFilter.category = MASK_ROCK;
        enemy.body.collisionFilter.mask = MASK_PAPER | MASK_SCISSOR; // Může kolidovat s paper a scissors

    } else if (type === TYPE_PAPER) {
        const width = ENEMY_SIZE;
        const height = ENEMY_SIZE;
        enemy = scene.matter.add.image(x, y, type);
        enemy.setDisplaySize(width, height);
        enemy.setBody({
            type: "rectangle",
            width: width,
            height: height,
            restitution: 0.6,
            frictionAir: 0.05,
            friction: 0.2
        });
        // Nastavení category a masky pro paper
        enemy.body.collisionFilter.category = MASK_PAPER;
        enemy.body.collisionFilter.mask = MASK_ROCK | MASK_SCISSOR; // Může kolidovat s rock a scissors

    } else if (type === TYPE_SCISSOR) {
        const width = ENEMY_SIZE;
        const height = width * 0.55;
        enemy = scene.matter.add.image(x, y, type);
        enemy.setDisplaySize(width, height);
        enemy.setBody({
            type: "rectangle",
            width: width,
            height: height,
            restitution: 0.6,
            frictionAir: 0.05,
            friction: 0.2
        });
        // Nastavení category a masky pro scissors
        enemy.body.collisionFilter.category = MASK_SCISSOR;
        enemy.body.collisionFilter.mask = MASK_ROCK | MASK_PAPER; // Může kolidovat s rock a paper
    }

    const uuid = Phaser.Utils.String.UUID();

    enemy.uuid = uuid;
    enemy.type = type;

    return {
        uuid: uuid,
        object: enemy,
        type: type
    };
};



const isRock = (type) => {
    return type === TYPE_ROCK
}

const isPaper = (type) => {
    return type === TYPE_PAPER
}

const isScissors = (type) => {
    return type === TYPE_SCISSOR
}

const moveTowardsNearestEnemy = (scene, enemy, enemies) => {
    let nearestEnemy = getNearestEnemy(enemy, enemies);

    if (nearestEnemy) {
        const dx = nearestEnemy.object.x - enemy.object.x;
        const dy = nearestEnemy.object.y - enemy.object.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const directionX = dx / distance;
        const directionY = dy / distance;

        const smoothSpeed = 0.3;
        const maxSpeed = 2;
        const rotateVelocity = isPaper(enemy.type) || isRock(enemy.type) ? 0.02 : -0.02;

        enemy.object.setVelocityX(Phaser.Math.Linear(enemy.object.body.velocity.x, directionX * maxSpeed, smoothSpeed));
        enemy.object.setVelocityY(Phaser.Math.Linear(enemy.object.body.velocity.y, directionY * maxSpeed, smoothSpeed));

        enemy.object.setAngularVelocity(rotateVelocity);

    }
};


const getNearestEnemy = (currentEnemy, enemies) => {
    let closestDistance = Infinity;
    let closestEnemy = null;

    enemies.forEach(enemy => {
        if (enemy.uuid !== currentEnemy.uuid && isEnemy(currentEnemy, enemy)) {
            const dx = enemy.object.x - currentEnemy.object.x;
            const dy = enemy.object.y - currentEnemy.object.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
    });

    return closestEnemy;
}

const isEnemy = (currentEnemy, potentialEnemy) => {
    const enemyTypes = {
        rock: TYPE_SCISSOR,
        scissor: TYPE_PAPER,
        paper: TYPE_ROCK
    };

    return potentialEnemy && enemyTypes[currentEnemy.type] === potentialEnemy.type;
}

const isNotSameType = (objA, objB) =>{
    return objA.type !== objB.type;
}

const resolveCollision = (objA, objB, enemies, scene) => {
    if (isNotSameType(objA, objB)) {
        let winner = null;
        let loser = null;

        if ((isRock(objA.type) && isScissors(objB.type)) ||
            (isScissors(objA.type) && isPaper(objB.type)) ||
            (isPaper(objA.type) && isRock(objB.type))) {
            winner = objA;
            loser = objB;
        } else if ((isRock(objB.type) && isScissors(objA.type)) ||
            (isScissors(objB.type) && isPaper(objA.type)) ||
            (isPaper(objB.type) && isRock(objA.type))) {
            winner = objB;
            loser = objA;
        }

        if (!winner || !loser) {
            return enemies;
        }

        const index = enemies.findIndex(enemy => enemy.uuid === loser.uuid);
        winner.setTint(0x00ff00);
        loser.setTint(0xff0000);

        setTimeout(() => {
            winner.setTint(0xffffff);
        }, 20);

        if (index !== -1) {
            enemies.splice(index, 1);
            const newEnemy = createEnemy(scene, winner.type, { x: loser.x, y: loser.y });
            enemies.push(newEnemy);
            loser.destroy();

            if(isRock(winner.type)){
                scene.AudioManager.play(TYPE_AUDIO_ROCK, { loop: false });
            }else if(isPaper(winner.type)){
                scene.AudioManager.play(TYPE_AUDIO_PAPER, { loop: false });
            }else if(isScissors(winner.type)){
                scene.AudioManager.play(TYPE_AUDIO_SCISSOR, { loop: false });
            }
        }
    }

    return enemies;
};

const addForceIfStuck = (enemy) => {
    if (Math.abs(enemy.object.body.velocity.x) < 0.5 && Math.abs(enemy.object.body.velocity.y) < 0.5) {
        const stuckForce = 0.05;

        enemy.object.applyForce({
            x: Phaser.Math.FloatBetween(-stuckForce, stuckForce),
            y: Phaser.Math.FloatBetween(-stuckForce, stuckForce)
        });
    }
};

const constrainToBounds = (enemy, scene) => {
    const margin = 20;
    const stuckForce = 0.002;

    if (enemy.object.x < margin) {
        enemy.object.applyForce({
            x: stuckForce,
            y: 0
        });
    }

    if (enemy.object.x > scene.cameras.main.width - margin) {
        enemy.object.applyForce({
            x: -stuckForce,
            y: 0
        });
    }

    if (enemy.object.y < margin) {
        enemy.object.applyForce({
            x: 0,
            y: stuckForce
        });
    }

    if (enemy.object.y > scene.cameras.main.height - margin) {
        enemy.object.applyForce({
            x: 0,
            y: -stuckForce
        });
    }
};

export {
    TYPE_ROCK,
    TYPE_PAPER,
    TYPE_SCISSOR,
    createEnemy,
    isRock,
    isPaper,
    isScissors,
    moveTowardsNearestEnemy,
    resolveCollision,
    addForceIfStuck,
    constrainToBounds
};