import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyHard } from '../../../../../common/src/crossword/difficulty-hard';

export class GridBankHard extends GridBank {

    constructor() {
        super(new DifficultyHard());
    }

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithDifficulty(new DifficultyHard());
    }

}
