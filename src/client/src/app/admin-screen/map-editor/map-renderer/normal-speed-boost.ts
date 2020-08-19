import { AbstractMapItem } from './abstract-map-item';
import { AbstractItemColors } from './abstract-item-colors';

const COLOR = '#FF0';

export class NormalSpeedBoost extends AbstractMapItem {

    protected context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D,
        x: number,
        y: number) {
        super(context, x, y, new AbstractItemColors(COLOR));
        this.context = context;
    }

}
