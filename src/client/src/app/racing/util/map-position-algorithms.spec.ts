import { Line } from '../../../../../common/src/math/line';
import { Point } from '../../../../../common/src/math/point';
import { MapPositionAlgorithms } from './map-position-algorithms';
import { Projection } from './projection';
import { Meters } from '../../types';

// Simple Map for testing
const points = [new Point(3.0, 3.0),
new Point(7.0, 7.0),
new Point(12.0, 7.0),
new Point(13.0, 3.0),
new Point(12.0, 2.0),
new Point(9.0, 3.0)];

const lines = [new Line(points[0], points[1]),
new Line(points[1], points[2]),
new Line(points[2], points[3]),
new Line(points[3], points[4]),
new Line(points[4], points[5]),
new Line(points[5], points[0])];

describe('Map position algorithms', () => {
    const pointEqualityTester = (first, second): boolean | void => {
        if (first instanceof Point && second instanceof Point) {
            return first.equals(second);
        }
    };

    beforeEach(() => {
        jasmine.addCustomEqualityTester(pointEqualityTester);
    });

    /**
     * getProjectionOnLine
     */
    it('should calculate the interpolation given a point and a line', () => {
        const line = new Line(new Point(0.0, 0.0), new Point(8.0, 0.0));
        const point = new Point(3.0, 3.0);

        const projection: Projection = MapPositionAlgorithms.getProjectionOnLine(point, line);

        expect(projection.segment).toEqual(line);
        expect(projection.distanceToSegment).toEqual(3.0);
        expect(projection.interpolation).toEqual(3.0 / 8.0);
    });

    it('should calculate the interpolation given a point and a line which don\'t start at 0', () => {
        const line = new Line(new Point(5.0, 3.0), new Point(9.0, 3.0));
        const point = new Point(6.0, 5.0);

        const projection: Projection = MapPositionAlgorithms.getProjectionOnLine(point, line);

        expect(projection.segment).toEqual(line);
        expect(projection.distanceToSegment).toEqual(2.0);
        expect(projection.interpolation).toEqual(0.25);
    });

    /**
     * getAllProjections
     */
    it('should calculate the interpolations on all lines given a point and a set of lines', () => {
        const thePosition = new Point(9.0, 6.0);

        const allProjections: Projection[] = MapPositionAlgorithms.getAllProjections(thePosition, lines);

        expect(allProjections.length).toEqual(lines.length);

        expect(allProjections[3].distanceToSegment).toEqual(3.5 * Math.sqrt(2));
        expect(allProjections[3].interpolation).toEqual(0.5);

        expect(allProjections[5].distanceToSegment).toEqual(3);
        expect(allProjections[5].interpolation).toEqual(0);
    });

    /**
     * getClosestProjection
     */
    it('should calculate the interpolation given a point and a set of lines', () => {
        const thePosition = new Point(9.0, 6.0);

        const closestInterpolation = MapPositionAlgorithms.getClosestProjection(thePosition, lines);

        expect(closestInterpolation.distanceToSegment).toEqual(1.0);
        expect(closestInterpolation.segment).toEqual(lines[1]);
        expect(closestInterpolation.interpolation).toEqual(2.0 / 5.0);
    });

    const correctionFactor = 10;
    it('should calculate the point at a given distance from the begining of a track', () => {
        const distance1: Meters = 10;
        const distance2: Meters = lines[0].length;
        const distance3: Meters = lines.reduce((length, line) =>
            (length * correctionFactor + line.length * correctionFactor) / (correctionFactor), 0);
        const expectedPoint1 = new Point(lines[1].origin.x + (10 - lines[0].length), lines[1].origin.y);
        const expectedPoint2 = lines[0].destination;
        const expectedPoint3 = lines[0].origin;

        const pointOnTrack1 = MapPositionAlgorithms.getPointAtGivenDistance(distance1, lines);
        const pointOnTrack2 = MapPositionAlgorithms.getPointAtGivenDistance(distance2, lines);
        const pointOnTrack3 = MapPositionAlgorithms.getPointAtGivenDistance(distance3, lines);

        expect(pointOnTrack1).toEqual(expectedPoint1);

        expect(pointOnTrack2).toEqual(expectedPoint2);

        expect(pointOnTrack3.x).toBeCloseTo(expectedPoint3.x);
        expect(pointOnTrack3.y).toBeCloseTo(expectedPoint3.y);
    });

    it('should calculate the total length of a track', () => {
        const trackLength = MapPositionAlgorithms.getTrackLength(lines);

        expect(trackLength).toEqual(lines.reduce((length, line) => length + line.length, 0));
    });
});
