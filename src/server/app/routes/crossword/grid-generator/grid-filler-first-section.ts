import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from '../word-position';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export class GridFillerFirstSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossPlacement = [
            new WordPlacement(new WordPosition(0, 0), 6, 9),
            new WordPlacement(new WordPosition(1, 0), 3, 3),
            new WordPlacement(new WordPosition(2, 0), 3, 3)
        ];
        this.verticalPlacement = [
            new WordPlacement(new WordPosition(0, 0), 4, 8),
            new WordPlacement(new WordPosition(0, 1), 3, 4),
            new WordPlacement(new WordPosition(0, 2), 3, 3)
        ];
    }

}
