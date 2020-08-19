import { GameData } from './game-data';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';

export class GameDataClassic extends GameData {

    constructor(difficulty: Difficulty) {
        super(difficulty);
    }

}
