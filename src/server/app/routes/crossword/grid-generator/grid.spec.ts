import { expect } from 'chai';
import { Grid } from './grid';
import { Word } from '../word';
import { WordPosition } from '../word-position';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from '../player';

function makeTestGrids(): Grid[] {
    const ACROSS_WORDS = [
        new Word('one',    new WordPosition(0, 0), Direction.horizontal),
        new Word('two',    new WordPosition(2, 6), Direction.horizontal),
        new Word('across', new WordPosition(4, 4), Direction.horizontal)
    ];
    const VERTICAL_WORDS = [
        new Word('one',  new WordPosition(1, 0), Direction.vertical),
        new Word('two',  new WordPosition(6, 3), Direction.vertical),
        new Word('vert', new WordPosition(6, 8), Direction.vertical)
    ];

    const GRID_ACROSS = new Grid();
    const GRID_VERTICAL = new Grid();
    const GRID_BOTH = new Grid();

    GRID_ACROSS.words = ACROSS_WORDS;
    GRID_VERTICAL.words = VERTICAL_WORDS;
    GRID_BOTH.words = ACROSS_WORDS.concat(VERTICAL_WORDS);

    const GRIDS = [
        GRID_ACROSS,
        GRID_VERTICAL,
        GRID_BOTH
    ];

    return GRIDS;
};

describe('Grid', () => {

    it('should be created', () => {
        const GRID = new Grid();
        expect(GRID).to.be.ok;
    });

    describe('doesWordAlreadyExist', () => {

        it('should tell that a word already exists if it does', () => {
            const GRIDS = makeTestGrids();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('one')).to.be.true;
                expect(grid.doesWordAlreadyExist('two')).to.be.true;
            });
        });

        it('should tell that a word does not exist if it does not', () => {
            const GRIDS = makeTestGrids();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('hi')).to.be.false;
                expect(grid.doesWordAlreadyExist('there')).to.be.false;
            });
        });

    });

    describe('isWordAlreadyPlaced', () => {

        it('should tell so when a word is already placed.', () => {
            const GRIDS = makeTestGrids();
            expect(GRIDS[0].isWordAlreadyPlaced(new WordPosition(0, 0), Direction.horizontal)).to.be.true;
            expect(GRIDS[0].isWordAlreadyPlaced(new WordPosition(2, 6), Direction.horizontal)).to.be.true;
            expect(GRIDS[1].isWordAlreadyPlaced(new WordPosition(6, 8), Direction.vertical  )).to.be.true;
            expect(GRIDS[2].isWordAlreadyPlaced(new WordPosition(0, 0), Direction.horizontal)).to.be.true;
            expect(GRIDS[2].isWordAlreadyPlaced(new WordPosition(2, 6), Direction.horizontal)).to.be.true;
            expect(GRIDS[2].isWordAlreadyPlaced(new WordPosition(6, 8), Direction.vertical  )).to.be.true;
        });

        it('should tell so when a word is not already placed.', () => {
            const GRIDS = makeTestGrids();
            expect(GRIDS[0].isWordAlreadyPlaced(new WordPosition(1, 0), Direction.horizontal)).to.be.false;
            expect(GRIDS[0].isWordAlreadyPlaced(new WordPosition(2, 7), Direction.horizontal)).to.be.false;
            expect(GRIDS[1].isWordAlreadyPlaced(new WordPosition(6, 8), Direction.horizontal)).to.be.false;
            expect(GRIDS[2].isWordAlreadyPlaced(new WordPosition(0, 0), Direction.vertical  )).to.be.false;
        });

    });

    it('should convert itself to an array of GridWords', () => {
        const grid = new Grid();

        const PLAYER = new Player('dylan', 'aw7Aas');
        const OPPONENT = new Player('mathieu', 'a7qsF');
        const WORDS = [
            new Word('hi',  new WordPosition(0, 0), Direction.horizontal, PLAYER),
            new Word('there', new WordPosition(5, 2), Direction.horizontal),
            new Word('signed', new WordPosition(2, 0), Direction.vertical, PLAYER),
            new Word('chucknorris', new WordPosition(3, 2), Direction.vertical, OPPONENT)
        ];
        const EXPECTED_RESULT = [
            new GridWord(1, 0, 0, 2,  Direction.horizontal, Owner.player,   'hi'),
            new GridWord(2, 5, 2, 5,  Direction.horizontal, Owner.none,     'there'),
            new GridWord(1, 2, 0, 6,  Direction.vertical,   Owner.player,   'signed'),
            new GridWord(2, 3, 2, 11, Direction.vertical,   Owner.opponent, 'chucknorris')
        ];

        grid.words = WORDS;
        grid.toGridWords(PLAYER).forEach((gridWord) => {
            const predicate = (expectedWord: GridWord) =>
                expectedWord.length === gridWord.length &&
                expectedWord.direction === gridWord.direction &&
                expectedWord.owner === gridWord.owner &&
                expectedWord.string === gridWord.string &&
                expectedWord.x === gridWord.x &&
                expectedWord.y === gridWord.y;
            const isWordFound = EXPECTED_RESULT.findIndex(predicate) >= 0;
            expect(isWordFound).to.be.true;
        });

    });

});
