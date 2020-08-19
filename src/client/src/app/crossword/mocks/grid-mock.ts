import { GridWord, } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

export function mockHorizontalGridWords(): GridWord[] {
    return [
        { id: 1,  y: 0, x: 0, length: 10, direction: Direction.horizontal, owner: Owner.opponent, string: 'roundhouse' },
        { id: 2,  y: 1, x: 0, length: 4,  direction: Direction.horizontal, owner: Owner.opponent, string: 'kick' },
        { id: 3,  y: 2, x: 0, length: 3,  direction: Direction.horizontal, owner: Owner.none,     string: '' },
        { id: 4,  y: 3, x: 3, length: 4,  direction: Direction.horizontal, owner: Owner.opponent, string: 'kill' },
        { id: 5,  y: 4, x: 3, length: 3,  direction: Direction.horizontal, owner: Owner.none,     string: '' },
        { id: 6,  y: 5, x: 0, length: 4,  direction: Direction.horizontal, owner: Owner.player,   string: 'fear' },
        { id: 7,  y: 6, x: 1, length: 5,  direction: Direction.horizontal, owner: Owner.player,   string: 'death' },
        { id: 8,  y: 7, x: 6, length: 3,  direction: Direction.horizontal, owner: Owner.none,     string: '' },
        { id: 9,  y: 8, x: 5, length: 5,  direction: Direction.horizontal, owner: Owner.opponent, string: 'chuck' },
        { id: 10, y: 9, x: 4, length: 6,  direction: Direction.horizontal, owner: Owner.opponent, string: 'norris' },
    ];
}

export function mockVerticalGridWords(): GridWord[] {
    return [
        { id: 1,  y: 0, x: 0, length: 4, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 2,  y: 0, x: 1, length: 4, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 3,  y: 0, x: 2, length: 3, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 4,  y: 3, x: 3, length: 6, direction: Direction.vertical, owner: Owner.opponent, string: 'karate' },
        { id: 5,  y: 3, x: 4, length: 4, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 6,  y: 3, x: 5, length: 4, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 7,  y: 7, x: 6, length: 3, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 8,  y: 7, x: 7, length: 3, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 9,  y: 7, x: 8, length: 3, direction: Direction.vertical, owner: Owner.none,     string: '' },
        { id: 10, y: 2, x: 9, length: 5, direction: Direction.vertical, owner: Owner.none,     string: '' }
    ];
}
