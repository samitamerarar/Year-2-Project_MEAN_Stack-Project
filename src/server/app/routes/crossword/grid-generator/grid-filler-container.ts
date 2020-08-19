import { GridFiller } from './grid-filler';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export class GridFillerContainer extends GridFiller {

    private readonly fillers: GridFiller[];

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.fillers = [
            new GridFillerFirstSection (difficulty),
            new GridFillerSecondSection(difficulty),
            new GridFillerThirdSection (difficulty),
            new GridFillerFourthSection(difficulty)
        ];
    }

    public get acrossPlacement(): WordPlacement[] {
        let placement: WordPlacement[] = [];
        this.fillers.forEach(filler => {
            placement = placement.concat(filler.acrossPlacement);
        });
        return placement;
    }

    public get verticalPlacement(): WordPlacement[] {
        let placement: WordPlacement[] = [];
        this.fillers.forEach(filler => {
            placement = placement.concat(filler.verticalPlacement);
        });
        return placement;
    }

    public cancelFilling(): void {
        this.fillers.forEach(filler => {
            filler.cancelFilling();
        });
    }

    public async fill(grid: Grid): Promise<void> {
        for (let i = 0; i < this.fillers.length; ++i) {
            const filler = this.fillers[i];
            try {
                await filler.fill(grid);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
    }

}
