import { AbstractMapLine } from './abstract-map-line';
import { Point } from '../../../../../../common/src/math/point';
import { FirstMapLineColors } from './first-map-line-colors';
import { Vector } from '../../../../../../common/src/math/vector';

const WIDTH = 5;

const STARTING_GRID_LENGTH = 50.0;
const COLOR_CHANGE_LENGTH = 5.0;

export class FirstMapLine extends AbstractMapLine {

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        super(context, origin, destination, new FirstMapLineColors(), WIDTH);
    }

    public draw(): void {
        this.drawStartingGrid();
        this.drawLineExtension();
    }

    private drawStartingGrid(): void {
        const LENGTH_TO_DRAW_STARTING_GRID =
            Math.min(this.translation.norm(), STARTING_GRID_LENGTH);
        const NUM_COLOR_CHANGES =
            Math.ceil(LENGTH_TO_DRAW_STARTING_GRID / COLOR_CHANGE_LENGTH);
        const POSITION_INCREMENT = this.translation.normalized().times(COLOR_CHANGE_LENGTH);
        let currentPosition = Vector.fromPoint(this.origin);
        let currentColor = 'line1';

        currentPosition = currentPosition.plus(POSITION_INCREMENT);
        for (let i = 0; i < NUM_COLOR_CHANGES - 1; ++i) {
            this.context.beginPath();
            this.context.moveTo(currentPosition.x, currentPosition.y);
            currentPosition = currentPosition.plus(POSITION_INCREMENT);
            this.context.lineTo(currentPosition.x, currentPosition.y);
            this.context.lineWidth = this.width;
            this.context.strokeStyle = this.colors.getColorOf(currentColor);
            this.context.stroke();
            currentColor = (currentColor === 'line1') ? 'line2' : 'line1';
        }
        // No need to draw the last line ; we assume there is a point
        // that covers it anyway.
    }

    private drawLineExtension(): void {
        this.context.beginPath();
        if (this.translation.norm() > STARTING_GRID_LENGTH) {
            const EXTENSION_START =
                Vector.fromPoint(this.origin)
                    .plus(this.translation.normalized().times(STARTING_GRID_LENGTH));
            this.context.moveTo(EXTENSION_START.x, EXTENSION_START.y);
            this.context.lineTo(this.destination.x, this.destination.y);
            this.context.lineWidth = this.width;
            this.context.strokeStyle = this.colors.getColorOf('line');
            this.context.stroke();
        }
    }

}
