import { Collection, Db, MongoError } from 'mongodb';

import { Grid } from '../grid-generator/grid';
import { GridGenerator } from '../grid-generator/grid-generator';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { provideDatabase, ensureCollectionReady } from '../../../app-db';
import { Logger } from '../../../../../common/src';
import { Word } from '../word';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from '../player';
import { WordPosition } from '../word-position';

enum GridState {
    GENERATING = 0,
    READY,
    CANCELLED
}

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 15;
    private static readonly COLLECTION_BASE_NAME = 'grid-bank-';

    private difficulty: Difficulty;
    private bank: Collection;
    private logger = Logger.getLogger('GridBank');

    protected constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.initializeBank();
    }

    private initializeBank(): void {
        provideDatabase().then((db: Db) => {
            db.collection(this.collectionName, (error: MongoError, bank: Collection) => {
                this.bank = bank;
            });
        });
    }

    public async fillup(): Promise<void> {
        await ensureCollectionReady(() => this.bank);
        while (await this.askSize() < GridBank.NUMBER_OF_GRIDS) {
            this.logger.log('Currently ' + await this.askSize() + '/' + GridBank.NUMBER_OF_GRIDS +
                            ' grids left for MongoDB ' + 'collection ' + this.collectionName +
                            '. Filling up.');
            await this.requestGridGeneration();
        }
    }

    public async getGrid(): Promise<Grid> {
        await ensureCollectionReady(() => this.bank);

        const DOCUMENT_PROMISE =
            this.bank.findOneAndDelete(
                {state: GridState.READY},
                {projection: {_id: 0, state: 0}}
            ).then((response) => response.value);

        DOCUMENT_PROMISE.then(() => this.fillup());
        const GRID_PROMISE =
            DOCUMENT_PROMISE.then((document) => {
                const GRID = this.makeGridFrom(document);
                this.askSize().then((size) => {
                    this.logger.log(size + ' grids left for MongoDB ' +
                    'collection ' + this.collectionName + '.');
                    this.logger.debug('Gotten grid:\n' + GRID.toString());
                });
                return GRID;
            });

        return GRID_PROMISE;
    }

    public async askSize(): Promise<number> {
        await ensureCollectionReady(() => this.bank);
        return this.bank.count({});
    }

    public abstract getGridFromGenerator(): Promise<Grid>;

    protected getGridFromGeneratorWithDifficulty(difficulty: Difficulty): Promise<Grid> {
        return GridGenerator.getInstance()
               .gridGeneration(difficulty);
    }

    public async requestGridGeneration(): Promise<void> {
        const GRID_PROMISE =
            GridGenerator.getInstance()
            .gridGeneration(this.difficulty);
        await GRID_PROMISE.then((grid) => this.addGridToBank(grid));
    }

    private addGridToBank(grid: Grid): void {
        this.bank.insertOne(this.makeDocumentFrom(grid, GridState.READY))
            .catch((reason) => {
                this.logger.warn(reason);
            });
    }

    private get collectionName(): string {
        return GridBank.COLLECTION_BASE_NAME + this.difficulty.toString();
    }

    private makeDocumentFrom(grid: Grid, state: GridState) {
        const STATEFUL_GRID = {...grid, state: state};
        return STATEFUL_GRID;
    }

    private makeGridFrom(document: any): Grid {
        const grid = new Grid();

        if (document.hasOwnProperty('words')) {
            // For the grids generated using the new code
            grid.words = document.words.map(
                (word: Word) =>
                    new Word(word.value, new WordPosition(word.position.row, word.position.column), word.direction, Player.NO_PLAYER)
            );
        }
        else if (document.hasOwnProperty('across') && document.hasOwnProperty('vertical')) {
            // For the grids generated using the old code
            const across = document.across.map(
                (word: Word) =>
                    new Word(word.value, new WordPosition(word.position.row, word.position.column), Direction.horizontal, Player.NO_PLAYER)
            );
            const vertical = document.vertical.map(
                (word: Word) =>
                    new Word(word.value, new WordPosition(word.position.row, word.position.column), Direction.vertical, Player.NO_PLAYER)
            );
            grid.words = across.concat(vertical);
        }
        else {
            this.logger.error(
                'ERROR: Got document that doesn\'t look like a grid:' + JSON.stringify(document)
            );
        }

        return grid;
    }

}
