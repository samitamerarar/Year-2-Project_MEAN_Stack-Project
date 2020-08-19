import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';
import { Point } from '../../../../../common/src/math/point';
import { Vector } from '../../../../../common/src/math/vector';
import { Line } from '../../../../../common/src/math/line';
import { ShoelaceAlgorithm } from '../../../../../common/src/math/shoelace-algorithm';
import { Interval } from '../../../../../common/src/math/interval';

export const MIN_ANGLE = Math.PI / 4;
export const MAP_TYPES = ['Amateur', 'Professional'];

export enum MapError {
    NONE = 0,       // No error
    NOT_CLOSED,     // Map path is not closed
    SMALL_ANGLE,    // An angle is < 45°
    SEGMENT_LENGTH, // A segment is too small
    LINES_CROSS     // Two lines cross
}

export class Map {

    public path: Path;
    public minimumSegmentLength: number;
    public potholes: Pothole[] = [];
    public puddles: Puddle[] = [];
    public speedBoosts: SpeedBoost[] = [];

    public name: string;
    public description: string;
    public type: string;

    private clockwiseCheckerAlgorithm: ShoelaceAlgorithm = new ShoelaceAlgorithm();

    constructor(path: Path = new Path(),
        minimumSegmentLength: number = Infinity,
        name: string = '',
        description: string = '',
        type: string = 'Amateur',
        potholes: Pothole[] = [],
        puddles: Puddle[] = [],
        speedBoosts: SpeedBoost[] = []) {

        this.path = path;
        this.minimumSegmentLength = minimumSegmentLength;
        this.name = name;
        this.description = description;
        this.type = type;
        this.potholes.push.apply(this.potholes, potholes);
        this.puddles.push.apply(this.puddles, puddles);
        this.speedBoosts.push.apply(this.speedBoosts, speedBoosts);
    }

    public resetAllItems(): void {
        this.speedBoosts.splice(0);
        this.puddles.splice(0);
        this.potholes.splice(0);
    }

    public isClockwise(): boolean {
        const POLYGON = this.path.points.slice(0, this.path.points.length - 1);
        return this.clockwiseCheckerAlgorithm.algebraicAreaOf(POLYGON) > 0;
    }

    public computeLength(): number {
        const POINTS = this.path.points;
        let length = 0;
        for (let i = 0; i < POINTS.length - 1; i++) {
            const VECTOR = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            length += VECTOR.norm();
        }
        return length;
    }

    public firstStretchLength(): number {
        if (this.path.points.length >= 2) {
            const POINT1 = this.path.points[0];
            const POINT2 = this.path.points[1];
            return Vector.fromPoints(POINT1, POINT2).norm();
        }
        else {
            throw new Error('Insufficient points');
        }
    }

    public computeErroneousLines(): Line[] {
        const ERRONEOUS_LINES: Line[] = [];

        const BAD_ANGLES: [Point, Point, Point][] = this.computeBadAngles();
        BAD_ANGLES.forEach((angle: [Point, Point, Point]) => {
            ERRONEOUS_LINES.push(new Line(angle[0], angle[1]), new Line(angle[1], angle[2]));
        });
        const CROSSING_LINES: [Line, Line][] = this.computeCrossingLines();
        CROSSING_LINES.forEach((lines: [Line, Line]) => {
            ERRONEOUS_LINES.push(lines[0], lines[1]);
        });
        const SMALL_SEGMENTS: Line[] = this.computeSmallSegments();
        ERRONEOUS_LINES.push.apply(ERRONEOUS_LINES, SMALL_SEGMENTS);

        return ERRONEOUS_LINES;
    }

    public computeErrors(): MapError {
        let error: MapError;
        if (!this.isClosed()) {
            error = MapError.NOT_CLOSED;
        }
        else if (this.computeBadAngles().length !== 0) {
            error = MapError.SMALL_ANGLE;
        }
        else if (this.computeCrossingLines().length !== 0) {
            error = MapError.LINES_CROSS;
        }
        else if (this.computeSmallSegments().length !== 0) {
            error = MapError.SEGMENT_LENGTH;
        }
        else {
            error = MapError.NONE;
        }
        return error;
    }

    private computeBadAngles(): [Point, Point, Point][] {
        const POINTS = [];
        POINTS.push.apply(POINTS, this.path.points);

        if (this.isClosed()) {
            POINTS.push(POINTS[1]);
        }

        const BAD_ANGLES: [Point, Point, Point][] = [];
        for (let i = 0; i < POINTS.length - 2; i++) {
            const POINT1 = POINTS[i];
            const POINT2 = POINTS[i + 1];
            const POINT3 = POINTS[i + 2];
            const VECTOR1 = Vector.fromPoints(POINT1, POINT2);
            const VECTOR2 = Vector.fromPoints(POINT3, POINT2);
            const ANGLE =
                Math.min(VECTOR1.angleTo(VECTOR2), VECTOR2.angleTo(VECTOR1));

            if (Math.abs(ANGLE) < MIN_ANGLE) {
                BAD_ANGLES.push([POINT1, POINT2, POINT3]);
            }
        }

        return BAD_ANGLES;
    }

    public isClosed(): boolean {
        return this.path.points.length > 2
            && this.path.points[0].equals(
                this.path.points[this.path.points.length - 1]);
    }

    private computeCrossingLines(): [Line, Line][] {
        const POINTS = this.path.points;
        const LINES_THAT_CROSS: [Line, Line][] = [];
        const LINES: Line[] = [];
        for (let i = 0; i < POINTS.length - 1; i++) {
            LINES.push(new Line(POINTS[i], POINTS[i + 1]));
        }

        const logicImplies = (p: boolean, q: boolean): boolean => ((!p) || q);
        for (let i = 0; i < LINES.length - 1; i++) {
            for (let j = i + 1; j < LINES.length; j++) {

                const INTERSECTION = LINES[i].intersectsWith(LINES[j]);

                const IS_INTERSECTING = (INTERSECTION.length !== 0);
                const PATH_CLOSED = this.isClosed();
                const NOT_NEIGHBORS = (j !== i + 1 && logicImplies(PATH_CLOSED, logicImplies(i === 0, j !== LINES.length - 1)));
                const INTERSECTION_IS_POINT = (INTERSECTION.length === 1);

                if (IS_INTERSECTING && logicImplies(INTERSECTION_IS_POINT, NOT_NEIGHBORS)) {
                    LINES_THAT_CROSS.push([LINES[i], LINES[j]]);
                }
            }
        }

        return LINES_THAT_CROSS;
    }

    private computeSmallSegments(): Line[] {
        const SMALL_SEGMENTS = [];
        let lastPoint = this.path.points[0];
        this.path.points.slice(1).forEach((point: Point) => {
            const LINE = new Line(lastPoint, point);
            if (LINE.translation.norm() < this.minimumSegmentLength) {
                SMALL_SEGMENTS.push(LINE);
            }
            lastPoint = point;
        });
        return SMALL_SEGMENTS;
    }

    public calucateHalfSegment(): Interval[] {
        const halfSegments = [];
        let currentLength = 0;
        for (let i = 0; i < this.path.points.length - 1; i++) {
            const POINT1 = this.path.points[i];
            const POINT2 = this.path.points[i + 1];
            const segmentLength = Vector.fromPoints(POINT1, POINT2).norm();
            const halfSementLength = (segmentLength / 2) + currentLength;
            halfSegments.push(new Interval(currentLength, halfSementLength));
            currentLength += segmentLength;
        }

        return halfSegments;
    }
}
