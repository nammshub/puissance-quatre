import { Color } from "./Color";
import { Grille } from "./Grille";

export abstract class Player {


    color: Color;

    constructor(color: Color) {
        this.color = color;
    }
    abstract play(grille: Grille): void;
    abstract learnWinner(currentPlayer?: Player): void;



}