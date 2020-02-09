import { Player } from "./Player";
import { Grille } from "./Grille";
import { Color } from "./Color";

export class Action {

    grille: Grille;
    color: Color;
    column: number;
    reward: number;

    constructor(grille: Grille, color: Color, column: number){
        this.grille = grille;
        this.color = color;
        this.column = column;
    }

}