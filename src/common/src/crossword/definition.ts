import { Direction } from './crossword-enums';

export class Definition {

    public text: string;
    public direction: Direction;

    constructor(text: string, direction: Direction) {
        this.text = text;
        this.direction = direction;
    }

}
