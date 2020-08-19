import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { WordSuggestions } from './word-suggestions';
import { CharConstraint } from '../../../../../common/src/index';
import { LexiconCaller } from '../lexic/lexicon-caller';

export class WordSuggestionsGetter {

    protected difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public async getSuggestions(minLength: number,
                                maxLength: number,
                                charConstraints: CharConstraint[]): Promise<WordSuggestions> {
        let stringSuggestions: string[];
        try {
            stringSuggestions = await LexiconCaller.getInstance().getWords(
                minLength,
                maxLength,
                this.difficulty.isWordCommon(),
                charConstraints
            );
        }
        catch (e) {
            stringSuggestions = [];
        }
        const WORD_SUGGESTIONS = new WordSuggestions(stringSuggestions);
        return WORD_SUGGESTIONS;
    }

    public async doSuggestionsExist(minLength: number,
                                    maxLength: number,
                                    charConstraints: CharConstraint[]): Promise<boolean> {
        try {
            return await LexiconCaller.getInstance().doWordsExist(
                minLength,
                maxLength,
                this.difficulty.isWordCommon(),
                charConstraints
            );
        }
        catch (e) {
            return false;
        }
    }

}
