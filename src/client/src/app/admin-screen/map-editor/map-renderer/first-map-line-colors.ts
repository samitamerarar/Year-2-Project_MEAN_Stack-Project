import { AbstractMapLineColors } from './abstract-map-line-colors';

const LINE1_COLOR = '#222';
const LINE2_COLOR = '#ddd';
const LINE_EXTENTION_COLOR = '#888';

export class FirstMapLineColors extends AbstractMapLineColors {

    public readonly line1: string;
    public readonly line2: string;

    constructor() {
        super(LINE_EXTENTION_COLOR);
        this.line1 = LINE1_COLOR;
        this.line2 = LINE2_COLOR;
    }

}
