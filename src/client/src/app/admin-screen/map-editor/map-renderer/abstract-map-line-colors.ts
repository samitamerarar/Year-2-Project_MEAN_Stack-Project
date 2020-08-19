import { MapColors } from './map-colors';

export class AbstractMapLineColors extends MapColors {

    constructor(public readonly line: string) {
        super();
    }

}
