import { Player } from "./Player";
import { Color } from "./Color";
import { Grille } from "./Grille";

const readline = require('readline-sync')


export class HumanPlayer extends Player {
    learnWinner(winner?: Player): void {
        if (winner && winner.color === this.color) {
            console.log('Vous avez gagné !!')
        } else {
            console.log('Vous avez perdu !!')
        }
    }

    constructor(color: Color) {
        super(color);
    }

    play(grille: Grille) {
        //on affiche la grille au joueur humain ainsi qu'une ligne avec les nuemrso de colonne à jouer
        grille.describe();
        console.log('1 | 2 | 3 | 4 | 5 | 6 | 7');
        // on attend le coup du joueur
        let choixValide = false;
        while (!choixValide) {
            let choix = readline.question(`choisissez une colonne (entrez le chiffre puis ENTER):`);
            let numberOption: number = Number(choix);
            if ([1, 2, 3, 4, 5, 6, 7].indexOf(numberOption) !== -1 && !grille.isColonneRemplie(numberOption - 1)) {
                choixValide = true;
                console.log('vous avez joue la colonne ' + numberOption);
                let colonneJouee = numberOption - 1;
                grille.insereJeton(colonneJouee, this.color);
            }
            else {
                console.log('entrez une colonne valide !');
            }
        }

    }
}