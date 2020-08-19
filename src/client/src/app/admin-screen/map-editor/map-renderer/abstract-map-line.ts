import { Line } from '../../../../../../common/src/math/line';
import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { AbstractMapLineColors } from './abstract-map-line-colors';
import { Track } from '../../../racing/track';

export abstract class AbstractMapLine extends Line implements Drawable {

    protected context: CanvasRenderingContext2D;
    public readonly origin: Point;
    public readonly destination: Point;
    protected colors: AbstractMapLineColors;
    protected width: number;

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point,
                colors: AbstractMapLineColors,
                width: number) {
        super(origin, destination);
        this.context = context;
        this.colors = colors;
        this.width = Track.SEGMENT_WIDTH;
    }

    public draw(): void {
        this.context.beginPath();
        this.context.moveTo(this.origin.x, this.origin.y);
        this.context.lineTo(this.destination.x, this.destination.y);

        this.context.strokeStyle = this.colors.getColorOf('line');
        this.context.lineWidth = this.width;
        this.context.stroke();
    }

}
