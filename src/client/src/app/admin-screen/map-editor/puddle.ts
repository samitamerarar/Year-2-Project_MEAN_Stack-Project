import { Item } from './items/item';

export class Puddle implements Item {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
