import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from '../word-position';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export class GridFillerThirdSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossPlacement = [
            new WordPlacement(new WordPosition(7, 6), 3, 4),
            new WordPlacement(new WordPosition(8, 6), 3, 3),
            new WordPlacement(new WordPosition(9, 0), 4, 5),
        ];
        this.verticalPlacement = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(7, 7), 3, 3),
            new WordPlacement(new WordPosition(6, 8), 3, 3)
        ];
    }

}
