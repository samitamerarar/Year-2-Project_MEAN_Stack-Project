import { SerializedItem } from './serialized-item';

export class SerializedPuddle implements SerializedItem {

    public type: 'puddle' = 'puddle';
    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
