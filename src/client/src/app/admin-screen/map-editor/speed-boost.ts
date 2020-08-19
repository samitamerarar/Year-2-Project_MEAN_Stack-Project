import { Item } from './items/item';

export class SpeedBoost implements Item {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
