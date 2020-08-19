import { AbstractGridGenerator } from './abstract-grid-generator';
import { Grid } from './grid';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { Logger } from '../../../../../common/src/index';

/**
 * @class GridGenerator
 * @description Manages the creation of Grids from scratch.
 */
export class GridGenerator extends AbstractGridGenerator {

    private static readonly INSTANCE = new GridGenerator();
    private static count = 0;

    private logger = Logger.getLogger('GridGenerator');

    public static getInstance(): GridGenerator {
        return GridGenerator.INSTANCE;
    }

    protected constructor() {
        super();
    }

    public async gridGeneration(difficulty: Difficulty): Promise<Grid> {
        const grid = await super.gridGenerationBase([], difficulty);
        this.logger.log(`Number of grid generated so far: ${++GridGenerator.count}`);
        this.logger.log(`This grid\'s difficulty: ${difficulty.toString()}\n${grid.toString()}`);
        return grid;
    }

}
