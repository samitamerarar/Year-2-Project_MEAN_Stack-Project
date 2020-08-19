import { AbstractNormalMapPointColors } from './abstract-normal-map-point-colors';

const INNER_COLOR = '#ccc';
const RIM_COLOR   = '#999';

export class NormalMapPointColorsActive extends AbstractNormalMapPointColors {

    constructor() {
        super(INNER_COLOR, RIM_COLOR);
    }

}
