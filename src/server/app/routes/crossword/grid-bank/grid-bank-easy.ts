import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';

export class GridBankEasy extends GridBank {

    constructor() {
        super(new DifficultyEasy());
    }

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithDifficulty(new DifficultyEasy());
    }

}
