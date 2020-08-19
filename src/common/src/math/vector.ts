import { Point } from './point';

export class Vector extends Point {

    constructor(x: number,
        y: number) {
        super(x, y);
    }

    public static fromPoint(point: Point): Vector {
        return new Vector(point.x, point.y);
    }

    public static fromPoints(origin: Point, destination: Point): Vector {
        return new Vector(destination.x - origin.x, destination.y - origin.y);
    }

    public plus(that: Vector): Vector {
        return new Vector(this.x + that.x, this.y + that.y);
    }

    public times(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public scalar(that: Vector): number {
        return this.x * that.x + this.y * that.y;
    }

    public normalized(): Vector {
        const NORM = this.norm();
        if (NORM > 0) {
            return new Vector(this.x / NORM, this.y / NORM);
        }
        else {
            throw new Error('Cannot normalize Vector of norm zero.');
        }
    }

    public norm(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // In radians
    public angleTo(that: Vector): number {
        const PRODUCT_OF_NORM_VECTORS = this.norm() * that.norm();
        const ANGLE = Math.acos(this.scalar(that) / PRODUCT_OF_NORM_VECTORS);
        return ANGLE;
    }

}

