export class Interval {

    private static readonly EMPTY = new (class EmptyInterval extends Interval {
        constructor () {
            super(0, 0);
            this.lowerBound = Infinity;
            this.upperBound = -Infinity;
        }
    })();

    private lowerBound: number;
    private upperBound: number;

    constructor(firstBound: number, secondBound: number) {
        if (firstBound < secondBound) {
            this.lowerBound = firstBound;
            this.upperBound = secondBound;
        }
        else {
            this.lowerBound = secondBound;
            this.upperBound = firstBound;
        }
    }

    public get lower(): number {
        return this.lowerBound;
    }

    public get upper(): number {
        return this.upperBound;
    }

    public contains(value: number): boolean {
        return value >= this.lowerBound
            && value <= this.upperBound;
    }

    public intersect(that: Interval): Interval {
        if (this.lower > that.upper || that.lower > this.upper) {
            return Interval.EMPTY;
        }
        else if (this.contains(that.lower)) {
            return (this.contains(that.upper) ? that : new Interval(that.lower, this.upper));
        }
        else {
            return (that.contains(this.upper) ? new Interval(this.lower, that.upper) : this );
        }
    }

    public isEmpty(): boolean {
        return this === Interval.EMPTY;
    }

    public getLength(): number {
        return (this.upper - this.lower);
    }
}
