import { GridFiller } from './grid-filler';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from '../word-position';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export class GridFillerFourthSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossPlacement = [];
        this.verticalPlacement = [
            new WordPlacement(new WordPosition(1, 9), 4, 5)
        ];
    }

}
