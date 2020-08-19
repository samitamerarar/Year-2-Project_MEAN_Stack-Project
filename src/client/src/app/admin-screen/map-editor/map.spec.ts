import { TestBed, inject } from '@angular/core/testing';

import { MockMaps } from './mock-maps';
import { Map } from './map';
import { Path } from './path';
import { Point } from '../../../../../common/src/math/point';
import { Line } from '../../../../../common/src/math/line';
import { Interval } from '../../../../../common/src/math/interval';

describe('Map', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockMaps
            ]
        });
    });

    let mockMaps: MockMaps;

    beforeEach(inject([MockMaps], (mockMapFactory: MockMaps) => {
        mockMaps = mockMapFactory;
    }));

    it('should be created', () => {
        expect(mockMaps.emptyMap1()).toBeTruthy();
        expect(mockMaps.emptyMap1().path).toEqual(new Path());
        expect(mockMaps.emptyMap1().potholes).toEqual([]);
        expect(mockMaps.emptyMap1().puddles).toEqual([]);
        expect(mockMaps.emptyMap1().speedBoosts).toEqual([]);
    });

    describe('isClockwise', () => {

        it('should mark the map as clockwise if it is so', () => {
            const MAP = mockMaps.clockwise();
            expect(MAP.isClockwise()).toBe(true);
        });

        it('should mark the map as counter-clockwise if it is so', () => {
            const MAP = mockMaps.counterClockwise();
            expect(MAP.isClockwise()).toBe(false);
        });

    });

    it('should compute length', () => {
        expect(mockMaps.functionalMap1().computeLength()).toBeCloseTo(34.14);
        expect(mockMaps.emptyMap1().computeLength()).toEqual(0);
    });

    it('should return first stretch length', () => {
        expect(mockMaps.functionalMap1().firstStretchLength()).toEqual(10);
        expect(mockMaps.emptyMap1().firstStretchLength).toThrowError();
    });

    it('should check bad angles', () => {
        expect(mockMaps.functionalMap1()['computeBadAngles']()).toEqual([]);
        expect(mockMaps.emptyMap1()['computeBadAngles']()).toEqual([]);
        expect(mockMaps.disfunctionalMap1()['computeBadAngles']()).toEqual([[new Point(0, 2), new Point(10, 2), new Point(0, 10)],
                                                                 [new Point(10, 2), new Point(0, 10), new Point(2, 1)],
                                                                 [new Point(2, 1), new Point(0, 2), new Point(10, 2)]]);
    });

    it('should check if map is closed', () => {
        expect(mockMaps.functionalMap1().isClosed()).toBe(true);
        expect(mockMaps.emptyMap1().isClosed()).toBe(false);
        expect(mockMaps.disfunctionalMap2().isClosed()).toBe(false);
    });

    it('should be able to check if lines cross', () => {
        const MAP1: Map = mockMaps.disfunctionalMap1();
        const CROSSING_LINES1: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(0, 10), new Point(2,  1))
            ]
        ];
        expect(MAP1['computeCrossingLines']()).toEqual(CROSSING_LINES1);

        const MAP2: Map = mockMaps.functionalMap1();
        const CROSSING_LINES2: [Line, Line][] = [];
        expect(MAP2['computeCrossingLines']()).toEqual(CROSSING_LINES2);

        const MAP3: Map = mockMaps.disfunctionalMap2();
        const CROSSING_LINES3: [Line, Line][] = [
            [
                new Line(new Point(0, 2),  new Point(10, 2)),
                new Line(new Point(5, 5), new Point(5,  0))
            ]
        ];
        expect(MAP3['computeCrossingLines']()).toEqual(CROSSING_LINES3);
    });

    describe('computeSmallSegments', () => {

        interface PolarData {
            length: number;
            angle: number;
        }

        class PolarPathData {
            private origin: Point;
            private data: PolarData[];

            public constructor(origin: Point, data: PolarData[]) {
                this.origin = origin;
                this.data = data;
            }

            public toPath(): Path {
                const POINTS: Point[] = [this.origin];
                this.data.forEach((data: PolarData) => {
                    const LAST_POINT = POINTS[POINTS.length - 1];
                    POINTS.push(
                        new Point(LAST_POINT.x + data.length * Math.cos(data.angle),
                                  LAST_POINT.y + data.length * Math.sin(data.angle)));
                });
                return new Path(POINTS);
            }
        }

        it('should not find small lines if there are none', () => {
            const DATA: PolarData[] = [
                {length: MockMaps.MIN_LINE_LENGTH * 1.01,  angle: 52.1},
                {length: MockMaps.MIN_LINE_LENGTH * 154.8, angle: 87.2}
            ];
            const pathData = new PolarPathData(new Point(10, 15), DATA);
            const MAP1 = new Map(pathData.toPath(), MockMaps.MIN_LINE_LENGTH);
            expect(MAP1['computeSmallSegments']().length).toEqual(0);
        });

        it('should find small lines if there are', () => {
            const DATA: PolarData[] = [
                {length: 0.0, angle: 52.1},
                {length: MockMaps.MIN_LINE_LENGTH * 1.01, angle: 14.7},
                {length: MockMaps.MIN_LINE_LENGTH * 20.4, angle: 128.3},
                {length: MockMaps.MIN_LINE_LENGTH * 0.99, angle: 59.1},
                {length: MockMaps.MIN_LINE_LENGTH * 0.0,  angle: 48.6}
            ];
            const pathData = new PolarPathData(new Point(10, 15), DATA);
            const MAP1 = new Map(pathData.toPath(), MockMaps.MIN_LINE_LENGTH);
            expect(MAP1['computeSmallSegments']().length).toEqual(3);
        });

        it('should calculate halfsegment lengths', () => {

            const interval1 = new Interval(0, 10 / 2);
            const interval2 = new Interval(10, 10 + Math.pow((2 * Math.pow(10, 2)), 0.5) / 2);
            const interval3 = new Interval (10 + Math.pow((2 * Math.pow(10, 2)), 0.5), 10 + Math.pow((2 * Math.pow(10, 2)), 0.5) + 5);
            const halfsegment: Interval[] = [
                interval1,
                interval2,
                interval3
            ];

            const map1 = mockMaps.functionalMap1();

            const mapIntervals = map1.calucateHalfSegment();

            expect(mapIntervals).toEqual(halfsegment);
        });
    });

});
