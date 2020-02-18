import { Player } from "./Player";
import { Action } from "./Action";
import { Color } from "./Color";
import { Grille } from "./Grille";
import { RandomUtils } from "../utils/RandomUtils";
import { DBUtils } from "../utils/DBUtils";


export class IAPlayer extends Player {

    listActions: Array<Action>;
    // le facteur d'exploration/exploitation au debut de la partie ex: 0.85 veut dire 85% d'exploration et 15% d'exploitation
    explorationPart: number;

    constructor(explorationPart: number, color: Color) {
        super(color);
        this.explorationPart = explorationPart;
        this.listActions = new Array<Action>();
    }

    play(grille: Grille) {
        // on verifie si on va explorer ou exploiter
        let isExploring = Math.random() <= this.explorationPart;
        let colonneJouee: number;
        if (isExploring) {
            console.log('on explore')
            colonneJouee = this.explorePlay(grille);
        }
        else {
            console.log('on exploite')
            colonneJouee = this.exploitPlay(grille, this.color);
        }
        // on insere l'action que l'on va prendre dans notre liste d'actions
        const action: Action = new Action(new Grille().hardCopyGrille(grille), this.color, colonneJouee);
        this.listActions.push(action);

        // on insere notre jeton dans la grille
        grille.insereJeton(colonneJouee, this.color);
    }


    learnWinner(winner?: Player) {
        let isWinner: boolean = false;
        if (winner && winner.color === this.color) {
            isWinner = true;
        }
        this.gereFinPartie(isWinner);
    }

    gereFinPartie(isWinner: boolean) {
        let recompense: number = isWinner ? 1 : -1;
        this.listActions.slice().reverse().forEach(action => {
            // on donne une recompense de 1 a la derniere action (si  victoire)  et -1 si defaite
            // et on divise cette valeur par 2 pour chaque action precedente
            action.reward = recompense;
            recompense /= 2;
        });
        DBUtils.updateDatabase(this.listActions);
    }

    explorePlay(grille: Grille): number {
        let colonneCible = RandomUtils.getRandomInt(7);
        while (grille.isColonneRemplie(colonneCible)) {
            colonneCible = RandomUtils.getRandomInt(7);
        }
        return colonneCible;
    }

    exploitPlay(grille: Grille, couleur: Color): number {
        let colonneCible: number = -1;
        // on regarde dans notre base de donnees si on a deja observe cette grille pour ce joueur et si oui on prend la colonne avec le plus haut taux de reward
        if (DBUtils.mapGrilleJoueur.has(JSON.stringify({ grille: grille, couleur: couleur }))) {
            let listColonnesRewardSorted: Array<{ colonne: number, reward: number }> = DBUtils.mapGrilleJoueur.get(JSON.stringify({ grille: grille, couleur: couleur }))
                // on doit garder les experiences negatives pour ne pas les reproduire par hasard
                // .filter(colonneReward => colonneReward.reward > 0)
                .sort((result1, result2) => result1.reward > result2.reward ? -1 : 1);
            if (listColonnesRewardSorted.length > 0) {
                console.log("resultats dans exploitations")
                listColonnesRewardSorted.forEach(colonneReward => {
                    console.log("colonne : " + colonneReward.colonne + " reward : " + colonneReward.reward);
                })
                // si on a au moins une action avec reward positive, on va la jouer.
                // Ou alors on a teste les 7 colonnes et toutes ont des rewards negatives => on prend la moins mauvaise
                if (listColonnesRewardSorted[0].reward > 0 || listColonnesRewardSorted.length === 7) {
                    // on insere l'action que l'on va prendre dans notre liste d'actions
                    colonneCible = listColonnesRewardSorted[0].colonne
                }
                else {
                    // sinon on a eu que des experiences negatives mais il reste des colonnes non testees => on va tester au hasard une de ces colonnes
                    colonneCible = RandomUtils.getRandomInt(7);
                    let iterTentatives = 0;
                    while (iterTentatives < 20 && (grille.isColonneRemplie(colonneCible)
                        || listColonnesRewardSorted.map(element => element.colonne).indexOf(colonneCible)) !== -1
                    ) {
                        colonneCible = RandomUtils.getRandomInt(7);
                        iterTentatives++;
                    }
                }
            }
        }
        if (colonneCible === -1) {
            console.log('on a tente d exploite mais pas de configuration trouve donc on va explorer');
            colonneCible = this.explorePlay(grille);
        }
        return colonneCible;
    }

}