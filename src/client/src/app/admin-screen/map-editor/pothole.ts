import { Item } from './items/item';

export class Pothole implements Item {

    public position: number;

    constructor(position: number) {
        this.position = position;
    }

}
