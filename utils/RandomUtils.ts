export class RandomUtils {

    //retourne un entier compris entre [0 et max[
    static getRandomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max));
      }
}