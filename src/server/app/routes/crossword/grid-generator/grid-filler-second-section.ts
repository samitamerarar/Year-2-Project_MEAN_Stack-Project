import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from '../word-position';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export class GridFillerSecondSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossPlacement = [
            new WordPlacement(new WordPosition(3, 3), 3, 5),
            new WordPlacement(new WordPosition(4, 3), 3, 3),
            new WordPlacement(new WordPosition(5, 5), 3, 3),
            new WordPlacement(new WordPosition(6, 3), 3, 3)
        ];
        this.verticalPlacement = [
            new WordPlacement(new WordPosition(3, 3), 4, 5),
            new WordPlacement(new WordPosition(2, 4), 3, 3),
            new WordPlacement(new WordPosition(3, 5), 4, 4)
        ];
    }

}
