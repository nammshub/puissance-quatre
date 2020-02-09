import { PlayMode } from "../models/PlayMode";
import { Player } from "../models/Player";
import { IAPlayer } from "../models/IAPlayer";
import { Color } from "../models/Color";
import { Play } from "../models/Play";
import { Grille } from "../models/Grille";
import { DBUtils } from "./DBUtils";

export class PlayUtils {
    static isWinner(grille: Grille, player: Player): boolean {
        let lettreJoueur = player.color === Color.ROUGE ? 'R' : 'J';

        // horizontalCheck 
        for (let ligne = 0; ligne < 6; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] === lettreJoueur && grille.valeurs[ligne][colonne + 1] == lettreJoueur && grille.valeurs[ligne][colonne + 2] == lettreJoueur && grille.valeurs[ligne][colonne + 3] == lettreJoueur) {
                    return true;
                }
            }
        }
        // verticalCheck
        for (let ligne = 0; ligne < 6 - 3; ligne++) {
            for (let colonne = 0; colonne < 7; colonne++) {
                if (grille.valeurs[ligne][colonne] == lettreJoueur && grille.valeurs[ligne + 1][colonne] == lettreJoueur && grille.valeurs[ligne + 2][colonne] == lettreJoueur && grille.valeurs[ligne + 3][colonne] == lettreJoueur) {
                    return true;
                }
            }
        }
        // ascendingDiagonalCheck 
        for (let ligne = 3; ligne < 6; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] == lettreJoueur && grille.valeurs[ligne - 1][colonne + 1] == lettreJoueur && grille.valeurs[ligne - 2][colonne + 2] == lettreJoueur && grille.valeurs[ligne - 3][colonne + 3] == lettreJoueur)
                    return true;
            }
        }
        // descendingDiagonalCheck
        for (let ligne = 0; ligne < 6 - 3; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] == lettreJoueur && grille.valeurs[ligne + 1][colonne + 1] == lettreJoueur && grille.valeurs[ligne + 2][colonne + 2] == lettreJoueur && grille.valeurs[ligne + 3][colonne + 3] == lettreJoueur)
                    return true;
            }
        }
        return false;
    }

    static lancePartie(mode: PlayMode) {
        switch (mode) {
            case PlayMode.TRAINING:
                let lettreJoueur1: IAPlayer = new IAPlayer(1, true, Color.ROUGE);
                let lettreJoueur2: IAPlayer = new IAPlayer(1, true, Color.JAUNE);
                for (let iter: number = 0; iter < 300; iter++) {
                    // a chaque partie les joueurs vont moins explorer et plus exploiter
                    lettreJoueur1.explorationPart -= 0.001;
                    lettreJoueur2.explorationPart -= 0.001;
                    let playTraining = new Play(PlayMode.TRAINING, lettreJoueur1, lettreJoueur2)
                    playTraining.launchPlay();
                    DBUtils.mapToJson();
                }
                break;

            case PlayMode.DUEL_IA:
                let lettreJoueur3: IAPlayer = new IAPlayer(0.05, true, Color.ROUGE);
                let lettreJoueur4: IAPlayer = new IAPlayer(0.05, true, Color.JAUNE);
                let playTraining = new Play(PlayMode.DUEL_IA, lettreJoueur3, lettreJoueur4)
                playTraining.launchPlay();
                DBUtils.mapToJson();
                break;

            case PlayMode.DUEL_IA_HUMAIN:
                console.log('inside PlayMode.DUEL_IA_HUMAIN');


                break;
        }
    }

    static sleep(milliseconds:number) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
}