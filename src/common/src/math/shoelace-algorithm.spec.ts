import { expect } from 'chai';

import { ShoelaceAlgorithm } from './shoelace-algorithm';
import { Point } from './point';

class MockPoints {

    public clockwise(): Point[] {
        return [new Point(0, 0), new Point(0, 10), new Point(10, 0)];
    }

    public counterClockwise(): Point[] {
        return [new Point(0, 0), new Point(10, 0), new Point(0, 10)];
    }

}

describe('ShoelaceAlgorithm', () => {

    const MOCK_POINTS: MockPoints = new MockPoints();
    const ALGORITHM: ShoelaceAlgorithm = new ShoelaceAlgorithm();

    it('should compute a positive algebraic area for a counter-clockwise polygon', () => {
        const COUNTER_CLOCKWISE_POLYGON = MOCK_POINTS.counterClockwise();
        expect(ALGORITHM.algebraicAreaOf(COUNTER_CLOCKWISE_POLYGON)).to.be.at.least(0);
    });

    it('should compute a negative algebraic area for a clockwise polygon', () => {
        const CLOCKWISE_POLYGON = MOCK_POINTS.clockwise();
        expect(ALGORITHM.algebraicAreaOf(CLOCKWISE_POLYGON)).to.be.at.most(0);
    });

});
