import { Grid } from './grid';
import { GridFiller } from './grid-filler';
import { GridFillerContainer } from './grid-filler-container';
import { Word } from '../word';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

interface GenerationData {
    isScheduled: boolean;
    isCancelled: boolean;
    grid: Grid;
    filler: GridFiller;
    promise: Promise<Grid>;
}

export abstract class AbstractGridGenerator {

    private latestGeneration: GenerationData;

    protected get latestGrid(): Promise<Grid> {
        return this.latestGeneration.promise;
    }

    protected constructor() {
        const EMPTY_GRID = new Grid();
        this.latestGeneration = {
            isScheduled: false,
            isCancelled: false,
            filler: null,
            grid: EMPTY_GRID,
            promise: Promise.resolve(EMPTY_GRID)
        };
    }

    protected gridGenerationBase(wordsToInclude: Word[], difficulty: Difficulty): Promise<Grid> {
        if (this.latestGeneration.isScheduled) {
            // Just update the generation parameters.
            this.latestGeneration.grid = new Grid(wordsToInclude);
            this.latestGeneration.filler = new GridFillerContainer(difficulty);
        }
        else {
            this.scheduleGeneration(wordsToInclude, difficulty);
        }
        return this.latestGeneration.promise;
    }

    protected cancelLatestGeneration(): void {
        this.latestGeneration.isScheduled = false;
        this.latestGeneration.isCancelled = true;
        this.latestGeneration.filler.cancelFilling();
    }

    private scheduleGeneration(wordsToInclude: Word[], difficulty: Difficulty): void {

        const generationData: GenerationData = {
            isScheduled: true,
            isCancelled: false,
            grid: new Grid(wordsToInclude),
            filler: new GridFillerContainer(difficulty),
            promise: null
        };

        const startGeneration: () => Promise<Grid> = () => {
            if (generationData.isScheduled) {
                // Start next generation if still scheduled.
                generationData.isScheduled = false;
                return generationData.grid.fillUsing(generationData.filler)
                    .then(() => {
                        if (!generationData.isCancelled) {
                            return generationData.grid;
                        }
                        else {
                            return null;
                        }
                    })
                    .catch(() => null);
            }
            else {
                // Generation cancelled.
                return Promise.resolve(null);
            }
        };

        generationData.promise = startGeneration();

        this.latestGeneration = generationData;
    }

}
