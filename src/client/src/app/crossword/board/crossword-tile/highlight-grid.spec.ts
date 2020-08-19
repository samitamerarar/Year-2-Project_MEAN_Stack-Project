import { HighlightGrid, WhoIsSelecting } from './highlight-grid';
import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction, Owner } from '../../../../../../common/src/crossword/crossword-enums';

function highlightGridForEach(highlightGrid: HighlightGrid,
    callback: (isHighlighted: WhoIsSelecting, row: number, col: number) => void) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            callback(highlightGrid.isSelected(row, column), row, column);
        }
    }
}

function filledGridForEach(highlightGrid: HighlightGrid,
    callback: (isFilled: WhoIsSelecting, row: number, col: number) => void) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            callback(highlightGrid.hasBeenFound(row, column), row, column);
        }
    }
}

describe('HighlightGrid', () => {

    it('should be created', () => {
        expect(new HighlightGrid()).toBeTruthy();
    });

    it('should tell that nothing is selected when constructed with null', () => {
        const HIGHLIGHT_GRID = new HighlightGrid();
        highlightGridForEach(
            HIGHLIGHT_GRID,
            (isHighlighted) => {
                expect(isHighlighted).toBe(WhoIsSelecting.noOne);
            }
        );
    });

    it('should tell which tiles are selected for a horizontal selection', () => {
        const ROW = 3;
        const COL_MIN = 2;
        const COL_MAX = 5;
        const HIGHLIGHT_GRID = new HighlightGrid(
            {
                player: new GridWord(0, ROW, COL_MIN, COL_MAX - COL_MIN + 1, Direction.horizontal),
                opponent: null
            }
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (row === ROW && col >= COL_MIN && col <= COL_MAX) {
                return WhoIsSelecting.player;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };
        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are selected for a vertical selection', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const HIGHLIGHT_GRID = new HighlightGrid(
            {
                player: new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical),
                opponent: null
            }
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (col === COLUMN && row >= ROW_MIN && row <= ROW_MAX) {
                return WhoIsSelecting.player;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are selected by both players', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const HIGHLIGHT_GRID = new HighlightGrid(
            {
                player: new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical),
                opponent: new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical)
            }
        );
        const SHOULD_BE_HIGHLIGHTED = (row: number, col: number) => {
            if (col === COLUMN && row >= ROW_MIN && row <= ROW_MAX) {
                return WhoIsSelecting.both;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        highlightGridForEach(HIGHLIGHT_GRID, (isHighlighted, row, col) => {
            expect(isHighlighted).toEqual(SHOULD_BE_HIGHLIGHTED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are filled', () => {
        const ROW_MIN = 2;
        const ROW_MAX = 5;
        const COLUMN = 3;
        const FOUND_WORDS: GridWord[] = [
            new GridWord(0, ROW_MIN, COLUMN, ROW_MAX - ROW_MIN + 1, Direction.vertical, Owner.player, 'allo')
        ];
        const FILLED_GRID = new HighlightGrid(
            {player: null, opponent: null},
            FOUND_WORDS
        );

        const SHOULD_BE_FILLED = (row: number, col: number) => {
            if (col === COLUMN && row >= ROW_MIN && row <= ROW_MAX) {
                return WhoIsSelecting.player;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        filledGridForEach(FILLED_GRID, (isFilled, row, col) => {
            expect(isFilled).toEqual(SHOULD_BE_FILLED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

    it('should tell which tiles are filled both players have played', () => {
        const ROW_MIN_WORD1 = 0;
        const ROW_MAX_WORD1 = 5;
        const COLUMN_WORD1 = 0;

        const COLUMN_MIN_WORD2 = 0;
        const COLUMN_MAX_WORD2 = 5;
        const ROW_WORD2 = 0;

        const FOUND_WORDS: GridWord[] = [
            new GridWord(0, ROW_MIN_WORD1, COLUMN_WORD1, ROW_MAX_WORD1 - ROW_MIN_WORD1 + 1, Direction.vertical, Owner.player),
            new GridWord(1, COLUMN_MIN_WORD2, ROW_WORD2, COLUMN_MAX_WORD2 - COLUMN_MIN_WORD2 + 1, Direction.horizontal, Owner.opponent)
        ];

        const FILLED_GRID = new HighlightGrid(
            {player: null, opponent: null},
            FOUND_WORDS
        );

        const SHOULD_BE_FILLED = (row: number, col: number) => {
            if (row === ROW_WORD2 && col === COLUMN_WORD1) {
                return WhoIsSelecting.both;
            }
            else if (col === COLUMN_WORD1 && row >= ROW_MIN_WORD1 && row <= ROW_MAX_WORD1) {
                return WhoIsSelecting.player;
            }
            else if (row === ROW_WORD2 && col >= COLUMN_MIN_WORD2 && col <= COLUMN_MAX_WORD2) {
                return WhoIsSelecting.opponent;
            }
            else {
                return WhoIsSelecting.noOne;
            }
        };

        filledGridForEach(FILLED_GRID, (isFilled, row, col) => {
            expect(isFilled).toEqual(SHOULD_BE_FILLED(row, col), 'Problem at ' + row + ',' + col);
        });
    });

});
