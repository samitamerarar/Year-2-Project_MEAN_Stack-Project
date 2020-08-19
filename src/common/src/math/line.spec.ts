import { expect } from 'chai';

import { Line } from './line';
import { Point } from './point';
import { Vector } from './vector';

function makeLine(x1: number, y1: number, x2: number, y2: number): Line {
    return new Line(new Point(x1, y1), new Point(x2, y2));
}

describe('Line', () => {

    it('should be created', () => {
        const ORIGIN = new Point(0, 0);
        const DESTINATION = new Point(0, 0);
        const LINE = new Line(ORIGIN, DESTINATION);
        expect(LINE.origin).to.equal(ORIGIN);
        expect(LINE.destination).to.equal(DESTINATION);
    });

    it('should compute its translation', () => {
        const TRANSLATION = makeLine(50, 50, 0, 100).translation;
        expect(TRANSLATION).to.deep.equal(new Vector(-50, 50));
    });

    describe('slope', () => {
        it('should compute the line\'s slope', () => {
            const SLOPE = makeLine(0, 0, 1, 2).slope;
            expect(SLOPE).to.be.closeTo(2, 0.001);
        });
    });

    it('should compute its intercept', () => {
        const INTERCEPT = makeLine(1, 1, 2, 0).intercept;
        expect(INTERCEPT).to.be.closeTo(2, 0.001);
    });

    describe('intersectsWith', () => {

        it('should return that identical lines are intersecting', () => {
            const LINE = makeLine(0, 0, 1, 1);
            expect(LINE.intersectsWith(LINE)).to.have.lengthOf(2);
        });

        it('should return that crossing lines are intersecting', () => {
            const LINE1 = makeLine(1, 1, 2, 2);
            const LINE2 = makeLine(1, 2, 2, 1);
            expect(LINE1.intersectsWith(LINE2)).to.have.lengthOf(1);
            expect(LINE2.intersectsWith(LINE1)).to.have.lengthOf(1);
        });

        it('should return that non-crossing lines are not intersecting', () => {
            const LINE1 = makeLine(1, 1, 10, 1);
            const LINE2 = makeLine(1, 2, 2, 1.01);
            expect(LINE1.intersectsWith(LINE2)).to.have.lengthOf(0);
            expect(LINE2.intersectsWith(LINE1)).to.have.lengthOf(0);
        });

        it('should work with vertical and horizontal lines', () => {
            const HORIZONTAL_LINE = makeLine(1, 2, 3, 2);
            const VERTICAL_LINE_XING = makeLine(2, 1, 2, 3);
            const VERTICAL_LINE_NOT_XING = makeLine(2, 1, 2, 1.99);

            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_XING)).to.have.lengthOf(1);
            expect(VERTICAL_LINE_XING.intersectsWith(HORIZONTAL_LINE)).to.have.lengthOf(1);
            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_NOT_XING)).to.have.lengthOf(0);
            expect(VERTICAL_LINE_NOT_XING.intersectsWith(HORIZONTAL_LINE)).to.have.lengthOf(0);
            expect(HORIZONTAL_LINE.intersectsWith(VERTICAL_LINE_XING)).to.have.lengthOf(1);
        });

        it('should work with intersecting points', () => {
            const LINE_WITH_NO_VECTOR_1 = makeLine(1, 1, 1, 1);
            const LINE_WITH_NO_VECTOR_2 = makeLine(1, 1, 1, 1);
            const LINE_WITH_NO_VECTOR_3 = makeLine(1, 2, 1, 2);

            expect(LINE_WITH_NO_VECTOR_1.intersectsWith(LINE_WITH_NO_VECTOR_2)).to.have.lengthOf(2);
            expect(LINE_WITH_NO_VECTOR_1.intersectsWith(LINE_WITH_NO_VECTOR_3)).to.have.lengthOf(0);
        });

    });

});
