import { MapColors } from './map-colors';

export class AbstractFirstMapPointColors extends MapColors {

    constructor(public readonly inner1: string,
                public readonly inner2: string,
                public readonly rim1: string,
                public readonly rim2: string) {
        super();
    }

}
