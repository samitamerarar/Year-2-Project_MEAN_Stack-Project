import { AbstractMapItem } from './abstract-map-item';
import { AbstractItemColors } from './abstract-item-colors';

const COLOR = '#000';

export class NormalPothole extends AbstractMapItem {

    protected context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D,
        x: number,
        y: number) {
        super(context, x, y, new AbstractItemColors(COLOR));
        this.context = context;
    }

}
