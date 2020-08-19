import { AbstractFirstMapPointColors } from './abstract-first-map-point-colors';

const INNER1_COLOR = '#fff';
const INNER2_COLOR = '#fff';
const RIM1_COLOR   = '#ccc';
const RIM2_COLOR   = '#333';

export class FirstMapPointColorsInactive extends AbstractFirstMapPointColors {

    constructor() {
        super(INNER1_COLOR, INNER2_COLOR, RIM1_COLOR, RIM2_COLOR);
    }

}
