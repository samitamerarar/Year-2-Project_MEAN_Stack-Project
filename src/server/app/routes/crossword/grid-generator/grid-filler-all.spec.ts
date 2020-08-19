import { expect } from 'chai';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';
import { WordSuggestionsGetter } from './word-suggestions-getter';
import { GridFiller } from './grid-filler';
import { Constructor } from '../../../../../common/src';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { GridFillerThirdSection } from './grid-filler-third-section';
import { GridFillerFourthSection } from './grid-filler-fourth-section';

function testGridFiller<T extends GridFiller>(testName: string,
                        constructor: Constructor<T>) {
    describe(testName, () => {

        let filler: T;

        beforeEach(() => {
            filler = new constructor(
                new WordSuggestionsGetter(new DifficultyEasy()));
        });

        it('should be created', () => {
            expect(filler).to.be.ok;
        });

        // Testing if the GridFiller fills grid is a bit compicated
        // because it requires requests

    });
}

testGridFiller('GridFillerFirstSection', GridFillerFirstSection);
testGridFiller('GridFillerSecondSection', GridFillerSecondSection);
testGridFiller('GridFillerThirdSection', GridFillerThirdSection);
testGridFiller('GridFillerFourthSection', GridFillerFourthSection);
