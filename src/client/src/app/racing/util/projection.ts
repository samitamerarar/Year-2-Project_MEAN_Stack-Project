import { Line } from '../../../../../common/src/math/line';

export class Projection {
    /**
     * @param interpolation Normalized position of the projected point on the line.
     * @param segment The line on which lies the projection.
     * @param distanceToSegment The shortest distance from the point to project and the line.
     */
    constructor(public readonly interpolation: number,
        public readonly segment: Line,
        public readonly distanceToSegment: number) { }
}
