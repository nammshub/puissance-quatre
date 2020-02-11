import { Player } from "./Player";
import { PlayMode } from "./PlayMode";
import { Grille } from "./Grille";
import { PlayUtils } from "../utils/PlayUtils";
import { RandomUtils } from "../utils/RandomUtils";

export class Play {

    player1: Player;
    player2: Player;
    playMode: PlayMode;
    grille: Grille;
    winner: boolean;
    nbrTour: number;
    currentPlayer: Player;
    partieTerminee: boolean;

    constructor(playMode: PlayMode, player1: Player, player2: Player) {
        this.playMode = playMode;
        this.player1 = player1;
        this.player2 = player2;
        this.grille = new Grille;
        this.winner = false;
        this.partieTerminee = false;
        this.nbrTour = 0;
    }

    launchPlay() {
        switch (this.playMode) {
            case PlayMode.TRAINING:
                this.launchDuel(false);
                break;
            case PlayMode.DUEL_IA:
            case PlayMode.DUEL_IA_HUMAIN:
                this.launchDuel(true);
                break;
        }
    }

    launchDuel(observateurHumain: boolean) {
        let randomPremierJoueur = RandomUtils.getRandomInt(2);
        while (!(this.winner || this.grille.isRemplie())) {
            this.nbrTour++;
            this.currentPlayer = (this.nbrTour + randomPremierJoueur) % 2 === 0 ? this.player1 : this.player2;
            this.currentPlayer.play(this.grille);

            // on laisse quelques secondes à un observateur humain pour voir les modifs de grille
            if (observateurHumain) {
                console.log('l IA ' + this.currentPlayer.color + ' a joue ')
                PlayUtils.sleep(5000);
            }

            this.winner = PlayUtils.isWinner(this.grille, this.currentPlayer);
        }
        if (this.winner) {
            console.log('there is a winner')
            this.player1.learnWinner(this.currentPlayer);
            this.player2.learnWinner(this.currentPlayer);
        }
        else {
            console.log('grille remplie')
            this.player1.learnWinner(null);
            this.player2.learnWinner(null);
        }
    }
}