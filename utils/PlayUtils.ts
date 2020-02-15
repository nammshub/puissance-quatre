import { PlayMode } from "../models/PlayMode";
import { Player } from "../models/Player";
import { IAPlayer } from "../models/IAPlayer";
import { Color } from "../models/Color";
import { Play } from "../models/Play";
import { Grille } from "../models/Grille";
import { DBUtils } from "./DBUtils";
import { HumanPlayer } from "../models/HumanPlayer";
import { CONSTANTES } from "../Constantes";

export class PlayUtils {
    static isWinner(grille: Grille, player: Player): boolean {
        let joueur = player.color === Color.ROUGE ? 'R' : 'J';

        // horizontalCheck 
        for (let ligne = 0; ligne < 6; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] === joueur && grille.valeurs[ligne][colonne + 1] == joueur && grille.valeurs[ligne][colonne + 2] == joueur && grille.valeurs[ligne][colonne + 3] == joueur) {
                    return true;
                }
            }
        }
        // verticalCheck
        for (let ligne = 0; ligne < 6 - 3; ligne++) {
            for (let colonne = 0; colonne < 7; colonne++) {
                if (grille.valeurs[ligne][colonne] == joueur && grille.valeurs[ligne + 1][colonne] == joueur && grille.valeurs[ligne + 2][colonne] == joueur && grille.valeurs[ligne + 3][colonne] == joueur) {
                    return true;
                }
            }
        }
        // ascendingDiagonalCheck 
        for (let ligne = 3; ligne < 6; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] == joueur && grille.valeurs[ligne - 1][colonne + 1] == joueur && grille.valeurs[ligne - 2][colonne + 2] == joueur && grille.valeurs[ligne - 3][colonne + 3] == joueur)
                    return true;
            }
        }
        // descendingDiagonalCheck
        for (let ligne = 0; ligne < 6 - 3; ligne++) {
            for (let colonne = 0; colonne < 7 - 3; colonne++) {
                if (grille.valeurs[ligne][colonne] == joueur && grille.valeurs[ligne + 1][colonne + 1] == joueur && grille.valeurs[ligne + 2][colonne + 2] == joueur && grille.valeurs[ligne + 3][colonne + 3] == joueur)
                    return true;
            }
        }
        return false;
    }

    static lancePartie(mode: PlayMode) {
        switch (mode) {
            case PlayMode.TRAINING:
                let joueur1: IAPlayer = new IAPlayer(CONSTANTES.EXPLORATION_TRAINING, Color.ROUGE);
                let joueur2: IAPlayer = new IAPlayer(CONSTANTES.EXPLORATION_TRAINING, Color.JAUNE);
                const nbrPartiesTraining = CONSTANTES.NBR_PARTIES_TRAINING;
                const reductionExploration = (CONSTANTES.EXPLORATION_TRAINING - 0.05 )/ nbrPartiesTraining;
                for (let iter: number = 0; iter < nbrPartiesTraining; iter++) {
                    // a chaque partie les joueurs vont moins explorer et plus exploiter
                    // on reduit l'exploration pour parvenir au final a 95% d'exploitation et 5% d'exploration => toujours garder un peu d'exploration !!
                    joueur1.explorationPart -= reductionExploration;
                    joueur2.explorationPart -= reductionExploration;
                    let playTraining = new Play(PlayMode.TRAINING, joueur1, joueur2)
                    console.log(' partie training numero ' + iter);
                    playTraining.launchPlay();
                    DBUtils.mapToJson();
                }
                break;

            case PlayMode.DUEL_IA:
                let joueur3: IAPlayer = new IAPlayer(CONSTANTES.EXPLORATION_DUEL, Color.ROUGE);
                let joueur4: IAPlayer = new IAPlayer(CONSTANTES.EXPLORATION_DUEL, Color.JAUNE);
                let playTDuelIA = new Play(PlayMode.DUEL_IA, joueur3, joueur4)
                playTDuelIA.launchPlay();
                DBUtils.mapToJson();
                break;

            case PlayMode.DUEL_IA_HUMAIN:
                let joueur5: IAPlayer = new IAPlayer(CONSTANTES.EXPLORATION_DUEL, Color.ROUGE);
                let joueur6: HumanPlayer = new HumanPlayer(Color.JAUNE);
                let playDuelIAHumain= new Play(PlayMode.DUEL_IA_HUMAIN, joueur5, joueur6)
                playDuelIAHumain.launchPlay();
                DBUtils.mapToJson();
                break;
        }
    }

    static sleep(milliseconds: number) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}