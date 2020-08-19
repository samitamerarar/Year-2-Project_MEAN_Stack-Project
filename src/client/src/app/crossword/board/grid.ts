import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { Grid as SerializedGrid } from '../../../../../common/src/grid';

export class Grid {

    public static readonly DIMENSIONS = SerializedGrid.DIMENSIONS;
    public static readonly BLACK_TILE = SerializedGrid.BLACK_TILE;
    public static readonly EMPTY_TILE = SerializedGrid.EMPTY_TILE;
    private static readonly NO_USER_INPUT =
        new GridWord(0, 0, 0, 0, Direction.horizontal, Owner.none, '');

    private dataWithoutUserInput: string[][];
    private data: string[][];
    private userInputInternal: GridWord;

    private wordsInternal: GridWord[] = [];

    public get numberOfWords(): number {
        return this.wordsInternal.length;
    }

    public get words(): GridWord[] {
        return this.wordsInternal;
    }

    constructor(words: GridWord[] = []) {
        this.wordsInternal.push(...words);
        this.userInputInternal = Grid.NO_USER_INPUT;
        this.regenerateEverything();
    }

    public addWord(word: GridWord): void {
        this.words.push(word);
        this.regenerateEverything();
    }

    public updateWord(word: GridWord): void {
        const foundWordIndex = this.words.findIndex((existingWord) => {
            return existingWord.y         === word.y         &&
                   existingWord.x         === word.x         &&
                   existingWord.direction === word.direction &&
                   existingWord.length    === word.length;
        });
        if (foundWordIndex >= 0) {
            word.id = this.words[foundWordIndex].id;
            this.words[foundWordIndex] = word;
            this.regenerateEverything();
        }
        else {
            throw new Error(`Word ${word.string} not found`);
        }
    }

    public clear(): void {
        this.wordsInternal.splice(0);
        this.userInputInternal = Grid.NO_USER_INPUT;
        this.regenerateEverything();
    }

    public getWord(index: number, direction: Direction): GridWord {
        const WORD = this.words.find((word) => {
            return word.direction === direction &&
                   word.id === index;
        });
        if (WORD != null) {
            return WORD;
        }
        else {
            throw new Error(`Word with index ${index} and direction
                             ${direction} not found`);
        }
    }

    public getCharAt(row: number, column: number): string {
        return this.data[row][column];
    }

    public set userInput(input: GridWord) {
        this.userInputInternal = input;
        this.data = this.cloneDataWithoutInput();
        this.fillWord(this.data, input);
    }

    private regenerateEverything(): void {
        this.resetData();
        this.populateData();
        this.userInput = this.userInputInternal;
    }

    private resetData(): void {
        this.dataWithoutUserInput = [];
        for (let row = 0; row < Grid.DIMENSIONS; ++row) {
            this.dataWithoutUserInput.push([]);
            for (let column = 0; column < Grid.DIMENSIONS; ++column) {
                this.dataWithoutUserInput[row].push(Grid.BLACK_TILE);
            }
        }
    }

    private populateData(): void {
        this.words.forEach((word) => {
            this.fillWord(this.dataWithoutUserInput, word);
        });
    }

    private fillWord(grid: string[][],
                     word: GridWord): void {
        if (word.direction === Direction.horizontal) {
            this.fillHorizontalWord(grid, word);
        }
        else if (word.direction === Direction.vertical) {
            this.fillVerticalWord(grid, word);
        }
        else {
            throw new Error('Invalid direction: "' + word.direction + '"');
        }
    }

    private fillHorizontalWord(grid: string[][],
                               word: GridWord): void {
        const ROW = word.y;
        for (let i = 0; i < word.length; ++i) {
            const COLUMN = word.x + i;
            const CHAR = this.wordCharAt(word, i);
            const SHOULD_WRITE_CHAR =
                CHAR !== Grid.EMPTY_TILE || grid[ROW][COLUMN] === Grid.BLACK_TILE;
            if (SHOULD_WRITE_CHAR) {
                grid[ROW][COLUMN] = CHAR;
            }
        }
    }

    private fillVerticalWord(grid: string[][],
                             word: GridWord): void {
        const COLUMN = word.x;
        for (let i = 0; i < word.length; ++i) {
            const ROW = word.y + i;
            const CHAR = this.wordCharAt(word, i);
            const SHOULD_WRITE_CHAR =
                CHAR !== Grid.EMPTY_TILE || grid[ROW][COLUMN] === Grid.BLACK_TILE;
            if (SHOULD_WRITE_CHAR) {
                grid[ROW][COLUMN] = CHAR;
            }
        }
    }

    private wordCharAt(word: GridWord, index: number): string {
        const IS_WORD_FOUND = word.string != null && word.string.length > 0;
        if (IS_WORD_FOUND) {
            return word.string.charAt(index);
        }
        else {
            return Grid.EMPTY_TILE;
        }
    }

    private cloneDataWithoutInput(): string[][] {
        const DATA = [];
        this.dataWithoutUserInput.forEach((data) => {
            DATA.push(data.slice());
        });
        return DATA;
    }

    public getPlayerWordsFoundCount(): number {
        let wordsFoundCount = 0;
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].owner === Owner.player) {
                wordsFoundCount++;
            }
        }
        return wordsFoundCount;
    }

    public getOpponentWordsFoundCount(): number {
        let wordsFoundCount = 0;
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].owner === Owner.opponent) {
                wordsFoundCount++;
            }
        }
        return wordsFoundCount;
    }

}
