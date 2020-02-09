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
    // joueur en mode training ou duel officiel
    training: boolean;

    constructor(explorationPart: number, training: boolean, color: Color) {
        super(color);
        this.explorationPart = explorationPart;
        this.training = training;
        this.listActions = new Array<Action>();
    };

    play(grille: Grille) {
        // on verifie si on va explorer ou exploiter
        let isExploring = Math.random()<=this.explorationPart;
        if(isExploring){
            console.log('on explore')
            this.explorePlay(grille);
        }
        else{
            console.log('on exploite')
            this.exploitPlay(grille, this.color);
        }
        grille.describe();
    }


    learnWinner(winner?: Player) {
        let isWinner: boolean = false;
        if (winner && winner.color === this.color) {
            isWinner = true;
        }
        
        this.gereFinPartie(isWinner);
    };

    gereFinPartie(isWinner: boolean){
        let recompense: number = isWinner?1:-1;
        this.listActions.slice().reverse().forEach(action => {
            // on donne une recompense de 1 a la derniere action (si  victoire)  et -1 si defaite
            // et on divise cette valeur par 2 pour chaque action precedente
            action.reward = recompense;
            recompense/=2;
        });
        // on met à jour la DB commune en aditionnant les rewards aux rewards existantes ou en ajoutant l'action si elle n'existe pas
        DBUtils.updateDatabase(this.listActions);
    }

    explorePlay(grille: Grille){
        let colonneCible = RandomUtils.getRandomInt(7);
        while(grille.isColonneRemplie(colonneCible)){
            colonneCible = RandomUtils.getRandomInt(7);
        }
        // on insere l'action que l'on va prendre dans notre liste d'actions
        const action:Action = new Action(new Grille().hardCopyGrille(grille),this.color,colonneCible);
        this.listActions.push(action);

        // on insere notre jeton dans la grille
        grille.insereJeton(colonneCible, this.color);
    }

    exploitPlay(grille: Grille, couleur:Color) {
        let meilleurCoupTrouve: boolean = false;
        // on regarde dans notre base de donnees si on a deja observe cette grille pour ce joueur et si oui on prend la colonne avec le plus haut taux de reward
        if (DBUtils.mapGrilleJoueur.has(JSON.stringify({grille: grille, couleur: couleur}))) {
            let listColonnesRewardSorted: Array<{colonne: number, reward: number}> = DBUtils.mapGrilleJoueur.get(JSON.stringify({grille: grille, couleur: couleur}))
            .filter( colonneReward => colonneReward.reward > 0)
            .sort((result1, result2) => result1.reward > result2.reward?1:-1);
            if(listColonnesRewardSorted.length > 0){
                console.log("exploitation reussie => meilleur coup trouve ")
                meilleurCoupTrouve = true;
                // si colonne trouvee on la joue
                grille.insereJeton(listColonnesRewardSorted[0].colonne, this.color);
            }
        }

        if(!meilleurCoupTrouve) {
            console.log('on a tente d exploite mais pas de meilleur coup trouve donc on va explorer');
            // sinon on explore (on joue au hasard)
            this.explorePlay(grille);
        }
    }

}