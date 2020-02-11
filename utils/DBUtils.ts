import { Action } from '../models/Action';
import { Grille } from '../models/Grille';
import { Color } from '../models/Color';

const fs = require('fs');

export class DBUtils {

    // cette map va contenir en clef: une grille et un joueur en cours et en valeur un tableau de colonnes jouees et rewards liees
    static mapGrilleJoueur: Map<string, Array<{ colonne: number, reward: number }>> = new Map();


    static mapToJson() {
        let mapToJSON = JSON.stringify(Array.from(DBUtils.mapGrilleJoueur.entries()));
        fs.writeFileSync('C:/Users/dhain/Documents/DEV/RENFORCEMENT/puissance4.json', mapToJSON);


    }

    static jsonToMap() {
        let rawdata: string = fs.readFileSync('C:/Users/dhain/Documents/DEV/RENFORCEMENT/puissance4.json');
        if (!rawdata || rawdata.length === 0) {
            DBUtils.mapGrilleJoueur = new Map();
        }
        else {
            DBUtils.mapGrilleJoueur = new Map(JSON.parse(rawdata));
        }

    }

    static updateDatabase(listActions: Array<Action>) {
        listActions.forEach(action => {
            if (DBUtils.mapGrilleJoueur.has(JSON.stringify({ grille: action.grille, couleur: action.color }))) {
                // on met à jour la reward pour la colonne jouee par le joueur donne sur la grille donnee
                let listColonneReward: Array<{ colonne: number, reward: number }> = DBUtils.mapGrilleJoueur.get(JSON.stringify({ grille: action.grille, couleur: action.color }));
                let found = false;
                listColonneReward
                    .filter(colonneReward => colonneReward.colonne === action.column)
                    .forEach(colonneReward => {
                        found = true;
                        colonneReward.reward += action.reward;
                    });
                if (!found) {
                    // on ajoute cette colonne - reward aux valeurs de la clef dans la map
                    listColonneReward.push({ colonne: action.column, reward: action.reward });
                }
            }
            else {
                // on injecte dans notre map cette configuration de grille, ce joueur ainsi que la colonne jouee et la reward
                let listColonneReward: Array<{ colonne: number, reward: number }> = new Array<{ colonne: number, reward: number }>();
                // on ajoute cette colonne - reward aux valeurs de la clef dans la map
                listColonneReward.push({ colonne: action.column, reward: action.reward });
                DBUtils.mapGrilleJoueur.set(JSON.stringify({ grille: action.grille, couleur: action.color }), listColonneReward);
            }
        })
    }
}