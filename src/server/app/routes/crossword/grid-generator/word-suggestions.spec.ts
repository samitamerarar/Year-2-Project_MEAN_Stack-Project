import { expect } from 'chai';
import { WordSuggestions } from './word-suggestions';

describe('WordSuggestions', () => {

    it('should be created', () => {
        const WORDS: string[] =
            ['chuck', 'norris', 'is', 'darth', 'vader\'s', 'father'];
        const SUGGESTIONS =
            new WordSuggestions(WORDS);
        expect(SUGGESTIONS).to.be.ok;
        expect(SUGGESTIONS.length).to.equal(WORDS.length);
    });

    describe('consumeRandomSuggestion', () => {

        it('should get a random suggestion and pop it', () => {
            const WORDS = ['hello', 'world'];
            const SUGGESTIONS = new WordSuggestions(WORDS);
            expect(WORDS).to.not.contain(SUGGESTIONS.consumeRandomSuggestion());
        });

        it('should throw if there are no suggestions', () => {
            const EMPTY = new WordSuggestions([]);
            expect(() => EMPTY.consumeRandomSuggestion()).to.throw;
        });

        it('should format the word before returning it', () => {
            const WORDS = ['HÉL\'Lo'];
            const SUGGESTIONS = new WordSuggestions(WORDS);
            expect(SUGGESTIONS.consumeRandomSuggestion()).to.equal('hello');
        });

    });

});
