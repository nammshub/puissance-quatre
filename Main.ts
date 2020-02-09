import { PlayMode } from "./models/PlayMode";
import { PlayUtils } from "./utils/PlayUtils";
import { DBUtils } from "./utils/DBUtils";

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('Bienvenu au puissance 4, ');
console.log('1: entrainement IAs');
console.log('2: duel IAs');
console.log('3: duel Humain - IA');

readline.question(`choisissez une option :`, (option: string) => {
  let numberOption: number = Number(option);
  if ([1, 2, 3].indexOf(Number(option)) !== -1) {
    // on charge la base de donnees depuis le fichier JSON
    DBUtils.jsonToMap();
    lancerPartie(numberOption);
    readline.close();
  } else {
    console.log('Veuillez entrer un nombre entre 1 et 3 !');
  }
});

function lancerPartie(choix: number) {
  switch (choix) {
    case 1:
      PlayUtils.lancePartie(PlayMode.TRAINING);
      break;
    case 2:
      PlayUtils.lancePartie(PlayMode.DUEL_IA);
      break;
    case 3:
      PlayUtils.lancePartie(PlayMode.DUEL_IA_HUMAIN);
      break;
    default: {
      console.log('vous avez choisi l option ' + choix);
    }
  }
}