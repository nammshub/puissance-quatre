import { Color } from "./Color";

export class Grille {

    valeurs: Array<Array<string>>;

    constructor() {
        this.valeurs = new Array<Array<string>>();
        for (let ligne: number = 0; ligne < 6; ligne++) {
            this.valeurs.push([]);
            this.valeurs[ligne].push('0', '0', '0', '0', '0', '0', '0');
        }
    }

    hardCopyGrille(grille: Grille): Grille {
        for (let ligne: number = 0; ligne < 6; ligne++) {
            for (let colonne: number = 0; colonne < 7; colonne++) {
                this.valeurs[ligne][colonne] = grille.valeurs[ligne][colonne];
            }
        }
        return this;
    }

    isRemplie(): boolean {
        // la ligne superieure ne contient plus aucune case vide
        return this.valeurs[5].indexOf('0') === -1;
    }

    insereJeton(colonneCible: number, color: Color) {
        let ligne: number = 0
        while (this.valeurs[ligne][colonneCible] !== '0') {
            ligne++;
        }
        console.log(color + ' insere jeton en colonne ' + (colonneCible + 1));
        this.valeurs[ligne][colonneCible] = (color === Color.ROUGE ? 'R' : 'J');
    }
    isColonneRemplie(colonneCible: number) {
        return this.valeurs[5][colonneCible] !== '0';
    }

    describe() {
        for (let ligne: number = 5; ligne >= 0; ligne--) {
            console.log(this.valeurs[ligne][0] + ' | '
                + this.valeurs[ligne][1] + ' | '
                + this.valeurs[ligne][2] + ' | '
                + this.valeurs[ligne][3] + ' | '
                + this.valeurs[ligne][4] + ' | '
                + this.valeurs[ligne][5] + ' | '
                + this.valeurs[ligne][6]);
        }
    }
} 