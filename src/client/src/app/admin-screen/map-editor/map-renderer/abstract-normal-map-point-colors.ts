import { MapColors } from './map-colors';

export class AbstractNormalMapPointColors extends MapColors {

    constructor(public readonly inner: string,
                public readonly rim: string) {
        super();
    }

}
