import { expect } from 'chai';

import { Transposer } from './transposer';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { GridFiller } from './grid-filler';
import { Grid } from './grid';
import { Word } from '../word';
import { WordPosition } from '../word-position';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

function placementOfFiller(filler: GridFiller): {across: WordPlacement[], vertical: WordPlacement[]} {
    return {
        across: filler.acrossPlacement.map(placement => placement.clone()),
        vertical: filler.verticalPlacement.map(placement => placement.clone())
    };
}

describe('Transposer', () => {

    it('should be created', () => {
        expect(new Transposer()).to.not.be.null;
    });

    it('should transpose a GridFiller', () => {
        const FILLER = new GridFillerFirstSection(new DifficultyEasy());
        const initialPlacement = placementOfFiller(FILLER);
        new Transposer().transposeFiller(FILLER);
        const transposedPlacement = placementOfFiller(FILLER);

        expect(transposedPlacement.across.length).to.equal(initialPlacement.across.length);
        expect(transposedPlacement.vertical.length).to.equal(initialPlacement.vertical.length);

        for (let i = 0; i < transposedPlacement.across.length; ++i) {
            const expectedPlacement = initialPlacement.vertical[i].clone();
            [expectedPlacement.position.row, expectedPlacement.position.column] =
                [expectedPlacement.position.column, expectedPlacement.position.row];
            expect(transposedPlacement.across[i].equals(expectedPlacement)).to.be.true;
        }

        for (let i = 0; i < transposedPlacement.vertical.length; ++i) {
            const expectedPlacement = initialPlacement.across[i].clone();
            [expectedPlacement.position.row, expectedPlacement.position.column] =
                [expectedPlacement.position.column, expectedPlacement.position.row];
            expect(transposedPlacement.vertical[i].equals(expectedPlacement)).to.be.true;
        }
    });

    it('should transpose grids', () => {

        const GRID = new Grid([
            new Word('hello', new WordPosition(0, 0), Direction.horizontal),
            new Word('hi',    new WordPosition(0, 0), Direction.vertical  ),
            new Word('chuck', new WordPosition(1, 8), Direction.vertical  )
        ]);

        const EXPECTED_STRING =
            'h i - - - - - - - -\n' +
            'e - - - - - - - - -\n' +
            'l - - - - - - - - -\n' +
            'l - - - - - - - - -\n' +
            'o - - - - - - - - -\n' +
            '- - - - - - - - - -\n' +
            '- - - - - - - - - -\n' +
            '- - - - - - - - - -\n' +
            '- c h u c k - - - -\n' +
            '- - - - - - - - - -';

        new Transposer().transposeGrid(GRID);

        expect(GRID.toString()).to.equal(EXPECTED_STRING);

    });

});
