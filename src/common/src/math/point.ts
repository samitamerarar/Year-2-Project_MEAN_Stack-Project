export class Point {

    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public equals(that: Point): boolean {
        return this.x === that.x && this.y === that.y;
    }

    public add(that: Point): this {
        this.x += that.x;
        this.y += that.y;
        return this;
    }

    public substract(that: Point): this {
        this.x -= that.x;
        this.y -= that.y;
        return this;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public distanceTo(that: Point): number {
        return Math.sqrt((that.x - this.x) ** 2 + (that.y - this.y) ** 2);
    }
}
