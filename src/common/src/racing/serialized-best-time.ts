import { SerializedPlayer } from './serialized-player';

export class SerializedBestTime {

    constructor(public readonly player: SerializedPlayer,
                public readonly value: number) {}

}
