import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyNormal } from '../../../../../common/src/crossword/difficulty-normal';

export class GridBankNormal extends GridBank {

    constructor() {
        super(new DifficultyNormal());
    }

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithDifficulty(new DifficultyNormal());
    }

}
