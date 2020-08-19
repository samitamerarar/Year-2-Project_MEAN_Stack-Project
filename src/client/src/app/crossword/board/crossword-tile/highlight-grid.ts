import { GridWord } from '../../../../../../common/src/crossword/grid-word';
import { Grid } from '../../../../../../common/src/grid';
import { Direction, Owner } from '../../../../../../common/src/crossword/crossword-enums';

export enum WhoIsSelecting {
    noOne = 0,
    player,
    opponent,
    both,
    length
}

export interface Selection {
    player: GridWord;
    opponent: GridWord;
}

/**
 * Class which can tell whether a certain tile is selected or should be filled.
 */
export class HighlightGrid {

    private data: WhoIsSelecting[][] = [];
    private wordsFound: WhoIsSelecting[][] = [];

    constructor(selection: Selection = { player: null, opponent: null }, words: GridWord[] = []) {
        const DATA = [];
        const found = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            const ROW_DATA = [];
            const rowFound = [];
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                ROW_DATA.push(this.shouldBeSelected(row, column, selection));
            }
            DATA.push(ROW_DATA);
            found.push(rowFound);
        }
        this.data = DATA;
        this.wordsFound = this.tileUsed(words);
    }

    public isSelected(row: number, column: number): WhoIsSelecting {
        return this.data[row][column];
    }

    public hasBeenFound(row: number, column: number): WhoIsSelecting {
        return this.wordsFound[row][column];
    }

    private shouldBeSelected(row: number, column: number, selection: Selection): WhoIsSelecting {

        const isSelectedByPlayer   = this.doesTileBelongToWord(row, column, selection.player);
        const isSelectedByOpponent = this.doesTileBelongToWord(row, column, selection.opponent);

        let whoIsSelecting;
        if (isSelectedByPlayer && isSelectedByOpponent) {
            whoIsSelecting = WhoIsSelecting.both;
        }
        else if (isSelectedByPlayer) {
            whoIsSelecting = WhoIsSelecting.player;
        }
        else if (isSelectedByOpponent) {
            whoIsSelecting = WhoIsSelecting.opponent;
        }
        else {
            whoIsSelecting = WhoIsSelecting.noOne;
        }
        return whoIsSelecting;

    }

    private tileUsed(words: GridWord[]): WhoIsSelecting[][] {
        const wordBelongsTo: WhoIsSelecting[][] = [];

        const populate: WhoIsSelecting[] = [];

        for (let i = 0; i < Grid.DIMENSIONS; i++) {
            populate.push(WhoIsSelecting.noOne);
        }

        for (let row = 0; row < Grid.DIMENSIONS; row++) {
            wordBelongsTo.push(populate.slice());
            for (let column = 0; column < Grid.DIMENSIONS; column++) {
                for (let word = 0; word < words.length; word++) {
                    if (((words[word].owner === Owner.player
                        && wordBelongsTo[row][column] === WhoIsSelecting.opponent) ||
                        (words[word].owner === Owner.opponent
                        && wordBelongsTo[row][column] === WhoIsSelecting.player))
                        && (this.doesTileBelongToWord(row, column, words[word]))) {
                        wordBelongsTo[row][column] = WhoIsSelecting.both;
                    }
                    else if (words[word].owner === Owner.player && this.doesTileBelongToWord(row, column, words[word])) {
                        wordBelongsTo[row][column] = WhoIsSelecting.player;
                    }
                    else if (words[word].owner === Owner.opponent && this.doesTileBelongToWord(row, column, words[word])) {
                        wordBelongsTo[row][column] = WhoIsSelecting.opponent;
                    }
                }
            }
        }
        return wordBelongsTo;
    }

    private doesTileBelongToWord(row: number, column: number, word: GridWord): boolean {
        if (word !== null) {
            if (word.direction === Direction.horizontal) {
                return (row === word.y &&
                    column >= word.x &&
                    column - word.x < word.length);
            }
            else {
                return (column === word.x &&
                    row >= word.y &&
                    row - word.y < word.length);
            }
        }
        return false;
    }
}
