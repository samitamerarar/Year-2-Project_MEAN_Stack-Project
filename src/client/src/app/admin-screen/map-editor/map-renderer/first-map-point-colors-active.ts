import { AbstractFirstMapPointColors } from './abstract-first-map-point-colors';

const INNER1_COLOR = '#ccc';
const INNER2_COLOR = '#333';
const RIM1_COLOR   = '#ccc';
const RIM2_COLOR   = '#ccc';

export class FirstMapPointColorsActive extends AbstractFirstMapPointColors {

    constructor() {
        super(INNER1_COLOR, INNER2_COLOR, RIM1_COLOR, RIM2_COLOR);
    }

}
