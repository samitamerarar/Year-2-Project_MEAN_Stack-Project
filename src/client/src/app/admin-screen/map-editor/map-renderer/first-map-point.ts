import { AbstractMapPoint } from './abstract-map-point';
import { FirstMapPointColorsActive } from './first-map-point-colors-active';
import { FirstMapPointColorsInactive } from './first-map-point-colors-inactive';
import { Point } from '../../../../../../common/src/math/point';
import { Vector } from '../../../../../../common/src/math/vector';

const INNER_RADIUS = 5.0;
const RIM_RADIUS   = 10.0;

const NUM_STRIPES = 8;

export class FirstMapPoint extends AbstractMapPoint {

    constructor(context: CanvasRenderingContext2D,
                x: number,
                y: number) {
        super(context,
              x,
              y,
              new FirstMapPointColorsActive(),
              new FirstMapPointColorsInactive());
    }

    public draw(): void {
        this.drawRim();
        this.drawInner();
    }

    private drawRim(): void {
        this.drawStripedCircle(RIM_RADIUS, 'rim1', 'rim2');
    }

    private drawInner(): void {
        this.drawStripedCircle(INNER_RADIUS, 'inner1', 'inner2');
    }

    private drawStripedCircle(radius: number,
                              token1: string,
                              token2: string): void {
        const ANGLE_INCREMENT = (2 * Math.PI) / NUM_STRIPES;
        for (let i = 0; i < NUM_STRIPES; ++i) {
            this.context.beginPath();

            const START_ANGLE = i * ANGLE_INCREMENT;
            const END_ANGLE = (i + 1) * ANGLE_INCREMENT;

            const IS_COLOR1 = (i % 2 === 0);
            if (IS_COLOR1) {
                this.context.fillStyle =
                    this.currentColors().getColorOf(token1);
            }
            else {
                this.context.fillStyle =
                    this.currentColors().getColorOf(token2);

            }
            this.context.moveTo(this.x, this.y);
            this.context.arc(this.x,
                             this.y,
                             radius,
                             START_ANGLE,
                             END_ANGLE);
                             this.context.lineTo(this.x, this.y);
            this.context.fill();
        }
    }

    public isUnder(coordinates: Point): boolean {
        const TRANSLATION = Vector.fromPoints(this, coordinates);
        return TRANSLATION.norm() < RIM_RADIUS;
    }

}
