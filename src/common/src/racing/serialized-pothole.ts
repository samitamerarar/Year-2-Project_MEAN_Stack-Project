import { SerializedItem } from './serialized-item';

export class SerializedPothole implements SerializedItem {

    public type: 'pothole' = 'pothole';
    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
