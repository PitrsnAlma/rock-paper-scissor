import {isRock, isPaper, isScissors} from "./Enemy.js";
import {Capitalize} from "./Text.js";

class Stats {
    teamElm = null;
    papersElm = null;
    rocksElm = null;
    scissorsElm = null;
    statsElm = null;

    score = {};
    winningTeam = "None";

    constructor() {
        this.loadElements();
    }

    loadElements(){
        this.teamElm = document.getElementById("team") || null;
        this.papersElm = document.getElementById("papers") || null;
        this.rocksElm = document.getElementById("rocks") || null;
        this.scissorsElm = document.getElementById("scissors") || null;
        this.statsElm = document.getElementById("statistics") || null;
    }

    createDefaultScore(){
        this.score = {
            rocks: 0,
            papers : 0,
            scissors : 0
        };
    }

    fillStatistics(){
        if(this.teamElm){
            this.teamElm.innerHTML = this.winningTeam;
        }

        if(this.scissorsElm){
            this.scissorsElm.innerHTML = this.score.scissors;
        }

        if(this.rocksElm){
            this.rocksElm.innerHTML = this.score.rocks;
        }

        if(this.papersElm){
            this.papersElm.innerHTML = this.score.papers;
        }

    }

    determineWinningTeam(maxScore){
        if (maxScore.length === 1) {
            return `${Capitalize(maxScore[0])}`;
        }
        return `${maxScore.map(Capitalize).join("/")}`;
    }

    update(enemies){
        this.createDefaultScore();

        enemies.forEach( enemy => {
            if(isScissors(enemy.type)){
                this.score.scissors++;
            }else if(isRock(enemy.type)){
                this.score.rocks++;
            }else if(isPaper(enemy.type)){
                this.score.papers++;
            }
        });

        const maxScore = Math.max(...Object.values(this.score));
        const result = Object.keys(this.score).filter(key => this.score[key] === maxScore);
        this.winningTeam = this.determineWinningTeam(result);

        this.fillStatistics();
    }

    enableStatistics(){
        this.statsElm.classList.remove("is-empty");
    }

    getWinningTeam(){
        return this.winningTeam;
    }
}

export default Stats;