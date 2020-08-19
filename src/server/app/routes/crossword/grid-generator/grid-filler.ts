import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { WordSuggestionsGetter } from './word-suggestions-getter';
import { WordConstraintChecker } from './word-constraint-checker';
import { Word } from '../word';
import { WordSuggestions } from './word-suggestions';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from '../player';
import { Transposer } from './transposer';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

export abstract class GridFiller {

    protected static readonly NUM_TRIES = 20;

    public acrossPlacement: WordPlacement[];
    public verticalPlacement: WordPlacement[];
    protected suggestionsGetter: WordSuggestionsGetter;

    private shouldCancelFilling = false;
    private transposer = new Transposer();

    constructor(difficulty: Difficulty) {
        this.suggestionsGetter = new WordSuggestionsGetter(difficulty);
    }

    public cancelFilling(): void {
        this.shouldCancelFilling = true;
    }

    public async fill(grid: Grid): Promise<void> {
        this.shouldCancelFilling = false;

        const transpose = this.shouldTranspose(grid);
        if (transpose) {
            // Take rows as columns, and vice-versa.
            this.transposer.transposeFiller(this);
            this.transposer.transposeGrid(grid);
        }

        const initialNumberOfWords = grid.words.length;
        let done = false;
        while (!done) {
            while (grid.words.length > initialNumberOfWords) {
                grid.words.pop();
            }

            let doneAcross = false;
            while (!doneAcross) {
                try {
                    doneAcross = await this.placeAcrossWords(grid);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            }

            let doneVertical = false;
            try {
                doneVertical = await this.placeVerticalWords(grid);
            }
            catch (e) {
                return Promise.reject(e);
            }
            done = doneVertical;
        }

        if (transpose) {
            // Un-transpose
            this.transposer.transposeFiller(this);
            this.transposer.transposeGrid(grid);
        }
    }

    private async placeAcrossWords(grid: Grid, recursionDepth: number = 0): Promise<boolean> {
        // We assume that the words in acrossWords and verticalWords
        // are given top to bottom and left to right (respectively).
        if (recursionDepth < this.acrossPlacement.length) {

            if (this.shouldCancelFilling) {
                throw new Error('Grid generation cancelled.');
            }

            const wordPlacement = this.acrossPlacement[recursionDepth];

            if (grid.isWordAlreadyPlaced(wordPlacement.position, Direction.horizontal)) {
                return await this.placeAcrossWords(grid, recursionDepth + 1);
            }
            else {
                const constraints = WordConstraintChecker.getInstance().getAcrossWordConstraint(grid, wordPlacement);
                const suggestions =
                    await this.suggestionsGetter.getSuggestions(
                        wordPlacement.minLength,
                        wordPlacement.maxLength,
                        constraints
                    );

                let done = false;
                let numTriesLeft = GridFiller.NUM_TRIES;
                while (numTriesLeft > 0 && suggestions.length > 0 && !done) {
                    const suggestion = this.getAWordThatIsNotADuplicate(grid, suggestions);
                    if (suggestion !== '') {
                        done = await this.trySuggestion(
                            grid,
                            suggestion,
                            recursionDepth
                        );
                    }
                    --numTriesLeft;
                }
                return done;
            }
        }
        else {
            return true;
        }
    }

    private async placeVerticalWords(grid: Grid): Promise<boolean> {
        const initialNumberOfWords = grid.words.length;
        for (let i = 0; i < this.verticalPlacement.length; ++i) {
            const placement = this.verticalPlacement[i];
            if (!grid.isWordAlreadyPlaced(placement.position, Direction.vertical)) {
                const constraint =
                    WordConstraintChecker.getInstance().getVerticalWordConstraint(
                        grid,
                        placement
                    );
                const suggestions = await this.suggestionsGetter.getSuggestions(
                    placement.minLength,
                    placement.maxLength,
                    constraint
                );
                // We know that there is at least one suggestion
                const suggestion = this.getAWordThatIsNotADuplicate(grid, suggestions);
                if (suggestion !== '') {
                    const word = new Word(
                        suggestion,
                        placement.position.clone(),
                        Direction.vertical,
                        Player.NO_PLAYER
                    );
                    grid.words.push(word);
                }
                else {
                    // Failure ; clean added vertical words
                    while (grid.words.length > initialNumberOfWords) {
                        grid.words.pop();
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private async areConstraintsMetFor(grid: Grid): Promise<boolean> {
        for (let i = 0; i < this.verticalPlacement.length; ++i) {
            const verticalWordPlacement = this.verticalPlacement[i];
            const verticalWordConstraint =
                WordConstraintChecker.getInstance().getVerticalWordConstraint(
                    grid,
                    verticalWordPlacement
                );
            const suggestionsExist =
                await this.suggestionsGetter.doSuggestionsExist(
                    verticalWordPlacement.minLength,
                    verticalWordPlacement.maxLength,
                    verticalWordConstraint
                );
            if (!suggestionsExist) {
                return false;
            }
        }
        return true;
    }

    private async trySuggestion(grid: Grid, suggestion: string, current: number): Promise<boolean> {
        const wordPlacement = this.acrossPlacement[current];
        const word = new Word(
            suggestion,
            wordPlacement.position.clone(),
            Direction.horizontal,
            Player.NO_PLAYER
        );
        grid.words.push(word);
        try {
            if (await this.areConstraintsMetFor(grid)) {
                if (await this.placeAcrossWords(grid, current + 1)) {
                    return true;
                }
                else {
                    grid.words.pop();
                    return false;
                }
            }
            else {
                grid.words.pop();
                return false;
            }
        }
        catch (e) {
            grid.words.pop();
            return false;
        }
    }

    private getAWordThatIsNotADuplicate(grid: Grid,
                                        suggestions: WordSuggestions): string {
        let word = '';
        const FOUND_NON_DUPLICATE = (() => word !== '');
        while (suggestions.length > 0 && !FOUND_NON_DUPLICATE()) {
            const suggestion = suggestions.consumeRandomSuggestion();
            if (!grid.doesWordAlreadyExist(suggestion)) {
                word = suggestion;
            }
        }
        return word;
    }

    /**
     * @description Checks whether the filler should transpose itself and the grid.
     * Transposing helps speedup the filling process when there are more horizontal words
     * to place than vertical words, because we place horizontal words first.
     * @param grid The grid possibly containing words already
     */
    private shouldTranspose(grid: Grid): boolean {
        let numberOfAcrossWordsToPlace = 0, numberOfVerticalWordsToPlace = 0;

        this.acrossPlacement.forEach(acrossPlacement => {
            if (!grid.isWordAlreadyPlaced(acrossPlacement.position, Direction.horizontal)) {
                ++numberOfAcrossWordsToPlace;
            }
        });
        this.verticalPlacement.forEach(verticalPlacement => {
            if (!grid.isWordAlreadyPlaced(verticalPlacement.position, Direction.vertical)) {
                ++numberOfVerticalWordsToPlace;
            }
        });

        return numberOfVerticalWordsToPlace < numberOfAcrossWordsToPlace;
    }

}

