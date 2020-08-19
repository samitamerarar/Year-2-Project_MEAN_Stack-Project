import { GridFiller } from './grid-filler';
import { Grid } from './grid';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

/**
 * @class GridFillerTransposer
 * @description Has the responsibility of transposing objects,
 * such as GridFillers and Grids.
 */
export class Transposer {

    public transposeFiller(filler: GridFiller): void {
        const acrossPlacement = filler.verticalPlacement;
        const verticalPlacement = filler.acrossPlacement;
        acrossPlacement.forEach(placement => {
            [placement.position.row, placement.position.column] =
                [placement.position.column, placement.position.row];
        });
        verticalPlacement.forEach(placement => {
            [placement.position.row, placement.position.column] =
                [placement.position.column, placement.position.row];
        });
        filler.acrossPlacement = acrossPlacement;
        filler.verticalPlacement = verticalPlacement;
    }

    public transposeGrid(grid: Grid): void {
        grid.words.forEach(word => {
            word.direction = (word.direction === Direction.horizontal)
                           ? Direction.vertical
                           : Direction.horizontal;
            [word.position.row, word.position.column] =
                [word.position.column, word.position.row];
        });
    }

}
