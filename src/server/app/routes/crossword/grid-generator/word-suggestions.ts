export class WordSuggestions {

    private suggestions: string[];

    constructor(suggestions: string[]) {
        this.suggestions = suggestions;
    }

    public get length(): number {
        return this.suggestions.length;
    }


    public consumeRandomSuggestion(): string {
        if (this.length > 0) {
            const MIN = 0;
            const MAX = this.suggestions.length;
            let randomIndex = this.suggestions.length;
            while (randomIndex >= this.suggestions.length) {
                randomIndex = (Math.floor(Math.random() * (MAX - MIN)) + MIN);
            }
            let word = this.suggestions[randomIndex];
            word = this.formatWord(word);
            this.suggestions.splice(randomIndex, 1);
            return word;
        }
        else {
            throw new Error('Cannot get random suggestion: no suggestions');
        }
    }

    private formatWord(word: string): string {
        word = this.noAccent(word);
        word = this.noApostropheAndDash(word);
        word = word.toLowerCase();
        return word;
    }

    private noAccent(word: string) {
        const accent = [
            /[\300-\306\340-\346]/g, // A, a
            /[\310-\313\350-\353]/g, // E, e
            /[\314-\317\354-\357]/g, // I, i
            /[\322-\330\362-\370]/g, // O, o
            /[\331-\334\371-\374]/g, // U, u
            /[\321\361]/g, // N, n
            /[\307\347]/g, // C, c
        ];
        const noAccent = ['a', 'e', 'i', 'o', 'u', 'n', 'c'];

        for (let i = 0; i < accent.length; i++) {
            word = word.replace(accent[i], noAccent[i]);
        }

        return word;
    }

    private noApostropheAndDash(word: string) {
        word = word.replace(/['-]/g, '');
        return word;
    }

}
