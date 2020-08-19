import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { AbstractItemColors } from './abstract-item-colors';

const RIM_RADIUS = 10.0;

export abstract class AbstractMapItem extends Point implements Drawable {

    protected context: CanvasRenderingContext2D;
    protected color: AbstractItemColors;

    constructor(context: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: AbstractItemColors) {
        super(x, y);
        this.context = context;
        this.color = color;
    }

    public draw(): void {
        this.context.beginPath();
        this.context.arc(this.x, this.y, RIM_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = this.color.getColorOf('disc');
        this.context.fill();
    }

}
