import { AbstractNormalMapPointColors } from './abstract-normal-map-point-colors';

const INNER_COLOR = '#999';
const RIM_COLOR   = '#ccc';

export class NormalMapPointColorsInactive extends AbstractNormalMapPointColors {

    constructor() {
        super(INNER_COLOR, RIM_COLOR);
    }

}
