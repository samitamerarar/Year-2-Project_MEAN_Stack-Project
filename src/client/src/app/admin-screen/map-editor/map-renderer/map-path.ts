import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { AbstractMapPoint } from './abstract-map-point';
import { NormalMapPoint } from './normal-map-point';
import { FirstMapPoint } from './first-map-point';
import { PointIndex } from '../point-index';
import { AbstractMapLine } from './abstract-map-line';
import { NormalMapLine } from './normal-map-line';
import { Map } from '../map';
import { Line } from '../../../../../../common/src/math/line';
import { FaultyMapLine } from './faulty-map-line';
import { FirstMapLine } from './first-map-line';

export class MapPath implements Drawable {

    private context: CanvasRenderingContext2D;
    private cursorCoordinates: Point = new Point(-100, -100);
    private currentActivePoint: PointIndex = null;
    private points: AbstractMapPoint[] = [];
    private lines: AbstractMapLine[] = [];

    public shouldReverse = false;

    constructor(context: CanvasRenderingContext2D, points: Point[]) {
        this.context = context;
        this.updatePoints(points, 0);
    }

    public updatePoints(points: Point[], minimumDistanceBetweenPoints: number): void {
        let possiblyReversedPoints: Point[];
        if (!this.shouldReverse) {
            possiblyReversedPoints = points;
        }
        else {
            possiblyReversedPoints = points.slice().reverse();
        }
        this.generatePointsFrom(possiblyReversedPoints);
        this.generateLinesFrom(possiblyReversedPoints, minimumDistanceBetweenPoints);
    }

    private generatePointsFrom(points: Point[]): void {
        this.points = points.map((point: Point, index: number) => {
            if (index !== 0) {
                if (!point.equals(points[0])) {
                    return new NormalMapPoint(this.context, point.x, point.y);
                }
                else {
                    return null;
                }
            }
            else {
                return new FirstMapPoint(this.context, point.x, point.y);
            }
        }).filter(value => value !== null);
    }

    private generateLinesFrom(points: Point[], minimumDistanceBetweenPoints: number): void {
        const MAP: Map = new Map();
        MAP.minimumSegmentLength = minimumDistanceBetweenPoints;

        this.lines = [];

        const AT_LEAST_ONE_LINE = this.points.length >= 2;
        if (!AT_LEAST_ONE_LINE) {
            return;
        }

        MAP.path.points.push.apply(MAP.path.points, points);
        const ERRONEOUS_LINES: Line[] = MAP.computeErroneousLines();

        this.lines = points.map((point: Point, index: number): AbstractMapLine => {
            if (index < points.length - 1) {
                return new NormalMapLine(this.context, point, points[index + 1]);
            }
        }).filter((value) => value !== undefined);

        this.lines[0] =
            new FirstMapLine(this.context,
                             this.lines[0].origin,
                             this.lines[0].destination);

        this.lines.forEach((line: NormalMapLine, index: number) => {
            const isBadLinePredicate = (badLine: Line) => {
                return line.equals(badLine);
            };
            if (ERRONEOUS_LINES.findIndex(isBadLinePredicate) >= 0) {
                this.lines[index] = new FaultyMapLine(this.context, line.origin, line.destination);
            }
        });
    }

    public draw(): void {
        this.updateActivePoint();
        this.drawLines();
        this.drawPoints();
    }

    private drawLines(): void {
        this.lines.forEach((line) => {
            line.draw();
        });
    }

    private drawPoints(): void {
        this.points.forEach((point: AbstractMapPoint) => {
            point.draw();
        });
    }

    public moveCursorTo(coordinates: Point): void {
        this.cursorCoordinates = coordinates;
    }

    private updateActivePoint(): void {
        const ACTIVE_POINT = this.pointWithCoordinates(this.cursorCoordinates);
        this.currentActivePoint = this.points.lastIndexOf(ACTIVE_POINT);
        if (this.activePoint !== -1) {
            ACTIVE_POINT.isActive = true;
            if (this.shouldReverse && this.currentActivePoint !== 0) {
                this.currentActivePoint =
                    (this.points.length) - this.currentActivePoint;
            }
        }
    }

    public pointWithCoordinates(coordinates: Point): AbstractMapPoint {
        let foundPoint: AbstractMapPoint = null;

        this.points.slice().reverse().forEach((point: AbstractMapPoint) => {
            const FOUND = (foundPoint != null);
            if (point.isUnder(coordinates)) {
                if (!FOUND) {
                    foundPoint = point;
                }
            }
        });
        return foundPoint;
    }

    public get activePoint(): PointIndex {
        return this.currentActivePoint;
    }

}
