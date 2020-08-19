import { MapColors } from './map-colors';

export class AbstractItemColors extends MapColors {

    constructor(public readonly disc: string) {
        super();
    }

}
