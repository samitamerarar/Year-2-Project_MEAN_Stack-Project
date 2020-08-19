import { GridWord } from '../../../../common/src/crossword/grid-word';
import { Player } from './player';
import { Direction, Owner } from '../../../../common/src/crossword/crossword-enums';
import { WordPosition } from './word-position';

/**
 * @class Word
 * @description This is the representation of a Word that the grid generator uses.
 * The general crossword game uses the GridWord class.
 */
export class Word {

    public value: string;
    public position: WordPosition;
    public direction: Direction;
    public owner: Player;

    public static fromGridWord(gridWord: GridWord, player: Player, opponent: Player): Word {

        // Compute owner.
        let actualOwner: Player;
        if (gridWord.owner === Owner.player) {
            actualOwner = player;
        }
        else if (gridWord.owner === Owner.opponent) {
            actualOwner = opponent;
        }
        else {
            actualOwner = Player.NO_PLAYER;
        }

        return new Word(
            gridWord.string,
            new WordPosition(gridWord.y, gridWord.x),
            gridWord.direction,
            actualOwner
        );
    }

    constructor(value: string, position: WordPosition, direction: Direction, owner = Player.NO_PLAYER) {
        this.value = value;
        this.position = position;
        this.direction = direction;
        this.owner = owner;
    }

    public equals(that: Word): boolean {
        return this.value === that.value &&
               this.position.equals(that.position) &&
               this.direction === that.direction &&
               this.owner.equals(that.owner);
    }

    public clone(): Word {
        return new Word(this.value, this.position.clone(), this.direction, this.owner.clone());
    }

}
