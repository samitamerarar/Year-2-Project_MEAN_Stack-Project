import { Grid } from './grid';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

function gridCompare(grid: Grid,
                             expected: string[][]) {
    for (let row = 0; row < Grid.DIMENSIONS; ++row) {
        for (let column = 0; column < Grid.DIMENSIONS; ++column) {
            expect(grid.getCharAt(row, column))
                .toEqual(expected[row][column]);
            if (grid.getCharAt(row, column) !== expected[row][column]) {
                console.log('NO', row, column);
            }
        }
    }
}

function horizontalWords(): GridWord[] {
    const DIRECTION = Direction.horizontal;
    const OWNER = Owner.none;
    return [
        new GridWord(0, 0, 0, 5,  DIRECTION, OWNER, ''),
        new GridWord(0, 2, 3, 7,  DIRECTION, OWNER, 'fghijkl'),
        new GridWord(0, 4, 1, 3,  DIRECTION, OWNER, ''),
        new GridWord(0, 4, 6, 1,  DIRECTION, OWNER, 'r'),
        new GridWord(0, 6, 0, 10, DIRECTION, OWNER, ''),
        new GridWord(0, 8, 2, 5,  DIRECTION, OWNER, 'abcde'),
        new GridWord(0, 9, 4, 3,  DIRECTION, OWNER, 'fgh'),
        new GridWord(0, 9, 8, 2,  DIRECTION, OWNER, ''),
    ];
}

function verticalWords(): GridWord[] {
    const DIRECTION = Direction.vertical;
    const OWNER = Owner.none;
    return [
        new GridWord(0, 0, 0, 3,  DIRECTION, OWNER, 'abc'),
        new GridWord(0, 0, 2, 1,  DIRECTION, OWNER, 'c'),
        new GridWord(0, 3, 2, 7,  DIRECTION, OWNER, ''),
        new GridWord(0, 0, 4, 4,  DIRECTION, OWNER, ''),
        new GridWord(0, 7, 5, 3,  DIRECTION, OWNER, ''),
        new GridWord(0, 4, 6, 1,  DIRECTION, OWNER, 'r'),
        new GridWord(0, 0, 9, 10, DIRECTION, OWNER, 'abldefzstj'),
    ];
}

function expectedBlack(): string[][] {
    const DATA: string[][] = [];
    for (let i = 0; i < Grid.DIMENSIONS; ++i) {
        DATA.push([]);
        for (let j = 0; j < Grid.DIMENSIONS; ++j) {
            DATA[i].push(Grid.BLACK_TILE);
        }
    }
    return DATA;
}

function expectedHorizontal(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        [ E ,  E ,  E ,  E ,  E ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B ,  B , 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  E ,  E ,  E ,  B ,  B , 'r',  B ,  B ,  B ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ],
        [ B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ,  B ],
        [ B ,  B , 'a', 'b', 'c', 'd', 'e',  B ,  B ,  B ],
        [ B ,  B ,  B ,  B , 'f', 'g', 'h',  B ,  E ,  E ]
    ];
}

function expectedVertical(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        ['a',  B , 'c',  B ,  E ,  B ,  B ,  B ,  B , 'a'],
        ['b',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'b'],
        ['c',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'l'],
        [ B ,  B ,  E ,  B ,  E ,  B ,  B ,  B ,  B , 'd'],
        [ B ,  B ,  E ,  B ,  B ,  B , 'r',  B ,  B , 'e'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'f'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'z'],
        [ B ,  B ,  E ,  B ,  B ,  E ,  B ,  B ,  B , 's'],
        [ B ,  B ,  E ,  B ,  B ,  E ,  B ,  B ,  B , 't'],
        [ B ,  B ,  E ,  B ,  B ,  E ,  B ,  B ,  B , 'j']
    ];
}

function expectedHorizontalAndVertical(): string[][] {
    const B = Grid.BLACK_TILE;
    const E = Grid.EMPTY_TILE;
    return [
        ['a',  E , 'c',  E ,  E ,  B ,  B ,  B ,  B , 'a'],
        ['b',  B ,  B ,  B ,  E ,  B ,  B ,  B ,  B , 'b'],
        ['c',  B ,  B , 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
        [ B ,  B ,  E ,  B ,  E ,  B ,  B ,  B ,  B , 'd'],
        [ B ,  E ,  E ,  E ,  B ,  B , 'r',  B ,  B , 'e'],
        [ B ,  B ,  E ,  B ,  B ,  B ,  B ,  B ,  B , 'f'],
        [ E ,  E ,  E ,  E ,  E ,  E ,  E ,  E ,  E , 'z'],
        [ B ,  B ,  E ,  B ,  B ,  E ,  B ,  B ,  B , 's'],
        [ B ,  B , 'a', 'b', 'c', 'd', 'e',  B ,  B , 't'],
        [ B ,  B ,  E ,  B , 'f', 'g', 'h',  B ,  E , 'j']
    ];
}

describe('Grid', () => {

    it('should be created', () => {
        expect(new Grid()).toBeTruthy();
    });

    it('should be full of black tiles when constructed with no words', () => {
        const GRID = new Grid([]);
        gridCompare(
            GRID,
            expectedBlack()
        );
    });

    it('should place horizontal words', () => {
        const GRID = new Grid(horizontalWords());
        gridCompare(
            GRID,
            expectedHorizontal()
        );
    });

    it('should place vertical words', () => {
        const GRID = new Grid(verticalWords());
        gridCompare(
            GRID,
            expectedVertical()
        );
    });

    it('should place a mixture of horizontal and vertical words', () => {
        const GRID = new Grid(horizontalWords()
                                  .concat(verticalWords()));
        gridCompare(
            GRID,
            expectedHorizontalAndVertical()
        );
    });

    it('should accept user input, overriding any letters that are already present', () => {
        const WORDS = horizontalWords().concat(verticalWords());
        const EXPECTED_TILES = expectedHorizontalAndVertical();
        EXPECTED_TILES[7][5] = 'x';
        EXPECTED_TILES[8][5] = 'y';
        EXPECTED_TILES[9][5] = 'z';
        const GRID = new Grid(WORDS);
        GRID.userInput =
            new GridWord(0, 7, 5, 3, Direction.vertical, Owner.none, 'xyz');
        gridCompare(
            GRID,
            EXPECTED_TILES
        );
    });

    it('should empty itself', () => {
        const GRID = new Grid(horizontalWords()
            .concat(verticalWords()));
        GRID.clear();
        gridCompare(
            GRID,
            expectedBlack()
        );
    });

    it('should be able to have words added to it', () => {
        const WORDS = horizontalWords().concat(verticalWords());
        const TO_ADD = WORDS.pop();
        const GRID = new Grid(WORDS);
        GRID.addWord(TO_ADD);
        gridCompare(
            GRID,
            expectedHorizontalAndVertical()
        );
    });

    it('should update words', () => {
        const WORDS = horizontalWords();
        const STRING = WORDS[1].string;
        WORDS[1].string = '';

        const GRID = new Grid(WORDS);
        const UPDATE = new GridWord(
            WORDS[1].id,
            WORDS[1].y,
            WORDS[1].x,
            WORDS[1].length,
            WORDS[1].direction,
            WORDS[1].owner,
            STRING
        );
        GRID.updateWord(UPDATE);
        gridCompare(GRID, expectedHorizontal());
    });

});
