import { expect } from 'chai';

import { WordConstraintChecker } from './word-constraint-checker';
import { Grid } from './grid';
import { Word } from '../word';
import { WordPosition } from '../word-position';
import { CharConstraint } from '../../../../../common/src/index';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';

function getTestData(isForAcross: boolean): {words: Word[],
                                             placement: WordPlacement[],
                                             expectedConstraints: CharConstraint[][]} {
    const WORD_PLACEMENTS: WordPosition[] = [
        new WordPosition(0, 0),
        new WordPosition(0, 1),
        new WordPosition(0, 2)
    ];

    const WORDS: Word[] = [
        new Word('hello', WORD_PLACEMENTS[0], Direction.horizontal),
        new Word('baz',   WORD_PLACEMENTS[1], Direction.horizontal),
        new Word('qux',   WORD_PLACEMENTS[2], Direction.vertical)
    ];
    const PLACEMENTS_TO_TEST: WordPlacement[] = [
        new WordPlacement(new WordPosition(0, 0), 3, 5),
        new WordPlacement(new WordPosition(2, 0), 5, 10),
        new WordPlacement(new WordPosition(3, 2), 3, 5),
        new WordPlacement(new WordPosition(3, 0), 4, 7),
        new WordPlacement(new WordPosition(5, 0), 6, 8)
    ];
    const EXPECTED_CONSTRAINTS: CharConstraint[][] = [
        [
            {char: 'h', position: 0},
            {char: 'b', position: 1},
            {char: 'q', position: 2}
        ],
        [
            {char: 'l', position: 0},
            {char: 'z', position: 1},
            {char: 'x', position: 2}
        ],
        [],
        [
            {char: 'l', position: 0}
        ],
        []
    ];

    if (!isForAcross) {
        const SWAP_ROW_COLUMN = (position: WordPosition) => {
                const ROW = position.column;
                const COLUMN = position.row;
                position.row = ROW;
                position.column = COLUMN;
            };
            WORD_PLACEMENTS.forEach(SWAP_ROW_COLUMN);
        PLACEMENTS_TO_TEST.forEach(placement => SWAP_ROW_COLUMN(placement.position));
    }

    return {
        words: WORDS,
        placement: PLACEMENTS_TO_TEST,
        expectedConstraints: EXPECTED_CONSTRAINTS
    };
}

describe('WordConstraintChecker', () => {

    describe('getAcrossWordConstraint', () => {
        it('should find the word constraint for a valid position', () => {
            const {
                words: VERTICAL_WORDS,
                placement: PLACEMENT,
                expectedConstraints: EXPECTED_CONSTRAINTS
            } = getTestData(true);
            const GRID = new Grid();
            GRID.words = VERTICAL_WORDS;

            for (let i = 0; i < PLACEMENT.length; ++i) {
                expect(WordConstraintChecker.getInstance()
                    .getAcrossWordConstraint(GRID, PLACEMENT[i]))
                    .to.deep.equal(EXPECTED_CONSTRAINTS[i]);
            }
        });
    });

    describe('getVerticalWordConstraint', () => {
        it('should find the word constraint for a valid position', () => {
            const {
                words: ACROSS_WORDS,
                placement: PLACEMENT,
                expectedConstraints: EXPECTED_CONSTRAINTS
            } = getTestData(false);
            const GRID = new Grid();
            GRID.words = ACROSS_WORDS;

            for (let i = 0; i < PLACEMENT.length; ++i) {
                const CONSTRAINTS = WordConstraintChecker.getInstance()
                        .getVerticalWordConstraint(GRID, PLACEMENT[i]);
                expect(CONSTRAINTS)
                    .to.deep.equal(EXPECTED_CONSTRAINTS[i]);
            }
        });
    });

});
