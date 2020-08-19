import { Definition } from '../definition';
import { Direction } from '../crossword-enums';

export class GameDefinitionPacket {

    constructor(
        public index: number,
        public direction: Direction,
        public definition: Definition) { }

}
