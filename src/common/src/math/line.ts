import { Point } from './point';
import { Vector } from './vector';
import { Interval } from './interval';

export class Line {

    public origin: Point;
    public destination: Point;

    constructor(origin: Point,
        destination: Point) {
        this.origin = origin;
        this.destination = destination;
    }

    public get translation(): Vector {
        return Vector.fromPoints(this.origin, this.destination);
    }

    public get slope(): number {
        const TRANSLATION = this.translation;
        return TRANSLATION.y / TRANSLATION.x;
    }

    public get intercept(): number {
        return this.origin.y - this.slope * this.origin.x;
    }

    public equals(that: Line): boolean {
        return (this.origin.equals(that.origin) &&
            this.destination.equals(that.destination)) ||
            (this.origin.equals(that.destination) &&
                this.destination.equals(that.origin));
    }

    public get length(): number {
        return this.translation.norm();
    }

    /**
     * Get the interpolated point between the origin and the destination.
     * @param proportion The proportion of the line. Must be between 0 and 1.
     */
    public interpolate(proportion: number): Point {
        const x = this.origin.x + (this.destination.x - this.origin.x) * (proportion);
        const y = this.origin.y + (this.destination.y - this.origin.y) * (proportion);
        return new Point(x, y);
    }

    public intersectsWith(that: Line): Point[] {

        const point1 = this.origin;
        const point2 = that.origin;
        const vector1 = this.translation;
        const vector2 = that.translation;
        let numerator: number;
        let denominator: number;
        const THIS_DOMAIN_X = new Interval(this.origin.x, this.destination.x);
        const THAT_DOMAIN_X = new Interval(that.origin.x, that.destination.x);
        const THIS_DOMAIN_Y = new Interval(this.origin.y, this.destination.y);
        const THAT_DOMAIN_Y = new Interval(that.origin.y, that.destination.y);

        if (vector1.x !== 0 && vector1.y !== 0) {
            denominator = vector2.x / vector1.x - vector2.y / vector1.y;
            if (denominator !== 0) {
                numerator = (point2.y - point1.y) / vector1.y - (point2.x - point1.x) / vector1.x;
            }
            else if (this.intercept === that.intercept) {
                const domainX = THIS_DOMAIN_X.intersect(THAT_DOMAIN_X);
                const domainY = THIS_DOMAIN_Y.intersect(THAT_DOMAIN_Y);
                const x1 = domainX.lower;
                const x2 = domainX.upper;
                const y1 = this.slope > 0 ? domainY.lower : domainY.upper;
                const y2 = this.slope > 0 ? domainY.upper : domainY.lower;
                return [new Point(x1, y1), new Point(x2, y2)];
            }
        }
        else if (vector1.x === 0) {
            if (vector2.x !== 0) {
                numerator = (point1.x - point2.x);
                denominator = vector2.x;
            }
            else if (point1.x === point2.x && !THIS_DOMAIN_Y.intersect(THAT_DOMAIN_Y).isEmpty()) {
                const domainY = THIS_DOMAIN_Y.intersect(THAT_DOMAIN_Y);
                const x1 = point1.x;
                const x2 = point2.x;
                const y1 = domainY.lower;
                const y2 = domainY.upper;
                return [new Point(x1, y1), new Point(x2, y2)];
            }
        }
        else if (vector1.y === 0) {
            if (vector2.y !== 0) {
                numerator = (point1.y - point2.y);
                denominator = vector2.y;
            }
            else if (point1.y === point2.y && !THIS_DOMAIN_X.intersect(THAT_DOMAIN_X).isEmpty()) {
                const domainX = THIS_DOMAIN_X.intersect(THAT_DOMAIN_X);
                const x1 = domainX.lower;
                const x2 = domainX.upper;
                const y1 = point1.y;
                const y2 = point2.y;
                return [new Point(x1, y1), new Point(x2, y2)];
            }
        }


        if (numerator !== undefined && denominator !== undefined) {
            return this.getPointFromParametricConstant(numerator / denominator, that);
        }
        return [];
    }

    private getPointFromParametricConstant(parametricConstant: number, that: Line): Point[] {
        const THIS_DOMAIN_X = new Interval(this.origin.x, this.destination.x);
        const THAT_DOMAIN_X = new Interval(that.origin.x, that.destination.x);
        const THIS_DOMAIN_Y = new Interval(this.origin.y, this.destination.y);
        const THAT_DOMAIN_Y = new Interval(that.origin.y, that.destination.y);

        const Y = parametricConstant * that.translation.y + that.origin.y;
        const X = parametricConstant * that.translation.x + that.origin.x;
        if ((THIS_DOMAIN_Y.contains(Y) && THAT_DOMAIN_Y.contains(Y)) &&
            (THIS_DOMAIN_X.contains(X) && THAT_DOMAIN_X.contains(X))) {
            return [new Point(X, Y)];
        }
        return [];
    }

}
