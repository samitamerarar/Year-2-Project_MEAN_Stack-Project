import { MapPath } from './map-path';
import { Point } from '../../../../../../common/src/math/point';

class CanvasFactory {

    public static readonly instance = new CanvasFactory();

    private constructor() {}

    public make(): HTMLCanvasElement {
        return document.createElement('canvas');
    }
}

describe('MapPath', () => {

    let mapPath: MapPath;

    beforeEach(() => {
        mapPath =
            new MapPath(CanvasFactory.instance.make().getContext('2d'), []);
    });

    describe('pointWithCoordinates', () => {

        const POINTS: Point[] = [
            new Point(50,   50),
            new Point(100, 100),
            new Point(150, 150),
            new Point(151, 149)
        ];

        beforeEach(() => {
            mapPath.updatePoints(POINTS, 10.0);
        });

        it('should be able to find a point with given coordinates', () => {
            const COORDINATES = new Point(98, 102);
            expect(mapPath.pointWithCoordinates(COORDINATES).equals(POINTS[1]));
        });

        it('should not find a point when there is none around given coordinates', () => {
            const COORDINATES = new Point(20, 50);
            expect(mapPath.pointWithCoordinates(COORDINATES)).toEqual(null);
        });

        it('should find the above point when two points ovrelap', () => {
            const COORDINATES = new Point(150, 150);
            expect(mapPath.pointWithCoordinates(COORDINATES).equals(POINTS[3]));
        });

    });

});
