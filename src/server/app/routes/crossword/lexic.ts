import { Db, Collection, Cursor } from 'mongodb';

import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';
import { WordConstraint } from '../../../../common/src/lexic/word-constraint';
import { HttpStatus, warn, Logger } from '../../../../common/src';

export interface WordDocument {
    _id: string;
    value: string;
    frequency: number;
}

const logger = Logger.getLogger('Lexic');

export class Lexic {
    public static readonly LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';
    public static readonly COMMONALITY_FREQUENCY_THRESHOLD = 1000;
    private readonly wordCollectionPromise: Promise<Collection<WordDocument>>;

    constructor(private databaseProvider: Promise<Db>,
        private regexBuilder: RegexBuilder,
        private externalWordApiService: ExternalWordApiService) {
        this.wordCollectionPromise = this.databaseProvider.then((db: Db) => {
            return db.collection<WordDocument>(Lexic.LEXIC_WORDS_COLLECTION);
        });
    }

    private getSearchFilter(constraint: WordConstraint): any {
        const REGEX = this.regexBuilder.buildFromConstraint(constraint);
        if (REGEX === null) {
            throw HttpStatus.BAD_REQUEST;
        }

        const SEARCH_FILTER = { value: { $regex: REGEX } };
        if ('isCommon' in constraint && constraint.isCommon !== null) {
            SEARCH_FILTER['frequency'] = constraint.isCommon ?
                { $gte: Lexic.COMMONALITY_FREQUENCY_THRESHOLD } :
                { $lt: Lexic.COMMONALITY_FREQUENCY_THRESHOLD };
        }

        return SEARCH_FILTER;
    }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return this.wordCollectionPromise.then((wordCollection: Collection<WordDocument>) => {
            const SEARCH_FILTER = this.getSearchFilter(constraint);
            const CURSOR: Cursor<any> = wordCollection.find(SEARCH_FILTER, { value: true })
                .map((value: WordDocument) => value.value);
            return CURSOR.toArray().then((words: string[]) => {
                if (words.length === 0) {
                    throw HttpStatus.NOT_FOUND;
                }
                return words;
            });
        });
    }

    public hasWord(constraint: WordConstraint): Promise<boolean> {
        return this.wordCollectionPromise.then((wordCollection: Collection<WordDocument>) => {
            const SEARCH_FILTER = this.getSearchFilter(constraint);
            return wordCollection.findOne(SEARCH_FILTER).then(
                (value: WordDocument) => value != null,
                warn(logger, false));
        });
    }

    public getDefinitions(word: string): Promise<string[]> {
        return this.externalWordApiService.getDefinitions(word);
    }

}
