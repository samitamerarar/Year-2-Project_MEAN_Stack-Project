import { CharConstraint } from '../../../../../common/src/index';
import { Grid } from './grid';
import { WordPosition } from '../word-position';
import { Word } from '../word';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';

type AxisGetter = (position: WordPosition) => number;
type PositionModifier = (position: WordPosition) => void;

interface PositionActor {
    getIteratedAxis: AxisGetter;
    getConstantAxis: AxisGetter;
    incrementIteratedAxis: PositionModifier;
    decrementIteratedAxis: PositionModifier;
}

export class WordConstraintChecker {

    private static INSTANCE = new WordConstraintChecker();

    private constructor() {}

    public static getInstance(): WordConstraintChecker {
        return WordConstraintChecker.INSTANCE;
    }

    public getAcrossWordConstraint(grid: Grid, placement: WordPlacement): CharConstraint[] {
        const POSITION_ACTOR: PositionActor = {
            getIteratedAxis: (wordPosition) => wordPosition.column,
            getConstantAxis: (wordPosition) => wordPosition.row,
            incrementIteratedAxis: (wordPosition) => { ++wordPosition.column; },
            decrementIteratedAxis: (wordPosition) => { --wordPosition.column; }
        };
        return this.getWordConstraint(
            grid.words,
            placement,
            POSITION_ACTOR
        );
    }

    public getVerticalWordConstraint(grid: Grid, placement: WordPlacement): CharConstraint[] {
        const POSITION_ACTOR: PositionActor = {
            getIteratedAxis: (wordPosition) => wordPosition.row,
            getConstantAxis: (wordPosition) => wordPosition.column,
            incrementIteratedAxis: (wordPosition) => { ++wordPosition.row; },
            decrementIteratedAxis: (wordPosition) => { --wordPosition.row; }
        };
        return this.getWordConstraint(
            grid.words,
            placement,
            POSITION_ACTOR
        );
    }

    private getWordConstraint(words: Word[],
                              placement: WordPlacement,
                              positionActor: PositionActor): CharConstraint[] {
        const CONSTRAINTS: CharConstraint[] = [];

        const CURRENT_POSITION = new WordPosition(placement.position.row,
                                                  placement.position.column);

        let characterPosition = 0;
        let shouldTryToFindNextChar = true;
        for (characterPosition = 0; characterPosition < placement.minLength; ++characterPosition) {

            const WORD_THAT_CONTAINS_POSITION =
                this.findWordThatContainsPosition(
                    words,
                    CURRENT_POSITION,
                    positionActor
                );

            const CHAR_FOUND = (WORD_THAT_CONTAINS_POSITION !== undefined);

            if (CHAR_FOUND) {
                const CHARACTER =
                    this.charOfWordAtPosition(
                        WORD_THAT_CONTAINS_POSITION,
                        CURRENT_POSITION,
                        positionActor
                    );
                const CHAR_CONSTRAINT: CharConstraint = {
                    char: CHARACTER,
                    position: characterPosition
                };
                CONSTRAINTS.push(CHAR_CONSTRAINT);
            }

            shouldTryToFindNextChar = CHAR_FOUND;
            positionActor.incrementIteratedAxis(CURRENT_POSITION);
        }
        return CONSTRAINTS;
    }

    private findWordThatContainsPosition(words: Word[],
                                         position: WordPosition,
                                         positionActor: PositionActor): Word {
        return words.find((word) => {
            const MIN_CONSTANT_AXIS = positionActor.getConstantAxis(word.position);
            const MAX_CONSTANT_AXIS = MIN_CONSTANT_AXIS + word.value.length - 1;
            const ITERATED_AXIS = positionActor.getIteratedAxis(word.position);
            const WORD_CONTAINS_POSITION =
                ITERATED_AXIS === positionActor.getIteratedAxis(position) &&
                positionActor.getConstantAxis(position) >= MIN_CONSTANT_AXIS &&
                positionActor.getConstantAxis(position) <= MAX_CONSTANT_AXIS;
            return WORD_CONTAINS_POSITION;
        });
    }

    private charOfWordAtPosition(word: Word,
                                 position: WordPosition,
                                 positionActor: PositionActor): string {
        return word.value
            .charAt(positionActor.getConstantAxis(position) -
                    positionActor.getConstantAxis(word.position));
    }

}
