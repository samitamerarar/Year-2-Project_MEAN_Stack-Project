import { Direction } from '../crossword-enums';

export class SelectedWordPacket {

    public direction: Direction;
    public id: number;

    constructor(direction: Direction = 0, id: number = -1) {
        this.direction = direction;
        this.id = id;
    }

}
