import { expect } from 'chai';
import { Word } from './word';
import { WordPosition } from './word-position';
import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../common/src/crossword/crossword-enums';
import { Player } from './player';

describe('Word',  () => {

    it('should be created', () => {
        expect(new Word('hi', new WordPosition(0, 0), Direction.horizontal)).to.not.be.null;
    });

    it('should be created from a GridWord', () => {
        const PLAYER = new Player('Dylan', 'Aw312F');
        const OPPONENT = new Player('Mathieu', 'O6y8As');
        const gridWords = [
            new GridWord(0, 1, 4, 5, Direction.horizontal, Owner.player, '12345'),
            new GridWord(1, 1, 5, 6, Direction.vertical, Owner.opponent, '123456'),
            new GridWord(1, 1, 6, 7, Direction.horizontal, Owner.none, '1234567')
        ];
        const expectedWords = [
            new Word('12345',  new WordPosition(1, 4), Direction.horizontal, PLAYER),
            new Word('123456', new WordPosition(1, 5), Direction.vertical, OPPONENT),
            new Word('1234567', new WordPosition(1, 6), Direction.horizontal, Player.NO_PLAYER)
        ];
        gridWords.forEach((gridWord, index) => {
            const expectedWord = expectedWords[index];
            const word = Word.fromGridWord(gridWord, PLAYER, OPPONENT);
            expect(word.equals(expectedWord)).to.be.true;
        });
    });

    describe('equals', () => {

        it('should check that words are equal', () => {
            const word1 = new Word('hi', new WordPosition(0, 0), Direction.horizontal, new Player('Chuck', 'asdff'));
            const word2 = new Word('hi', new WordPosition(0, 0), Direction.horizontal, new Player('Chuck', 'asdff'));
            expect(word1.equals(word2)).to.be.true;
        });

        it('should check that words are different', () => {
            const word1 = new Word('hi', new WordPosition(0, 0), Direction.horizontal, new Player('Chuck', 'asdff'));
            const words = [
                new Word('hi1', new WordPosition(0, 0), Direction.horizontal, new Player('Chuck',  'asdff')),
                new Word('hi',  new WordPosition(1, 0), Direction.horizontal, new Player('Chuck',  'asdff')),
                new Word('hi',  new WordPosition(0, 2), Direction.horizontal, new Player('Chuck',  'asdff')),
                new Word('hi',  new WordPosition(0, 0), Direction.vertical,   new Player('Chuck',  'asdff')),
                new Word('hi',  new WordPosition(0, 0), Direction.horizontal, new Player('Norris', 'asdff'))
            ];
            words.forEach(word => {
                expect(word1.equals(word)).to.be.false;
            });
        });

    });

});
