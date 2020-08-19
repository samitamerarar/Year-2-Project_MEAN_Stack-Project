import { expect } from 'chai';

import { Vector } from './vector';
import { Point } from './point';

describe('Vector', () => {

    it('should be created with x and y coordinates', () => {
        const VECTOR = new Vector(5, 10);
        expect(VECTOR.x).to.equal(5);
        expect(VECTOR.y).to.equal(10);
    });

    it('should be created with one point', () => {
        const X = 40.4;
        const Y = -8.45;
        const POINT = new Point(X, Y);
        const V = Vector.fromPoint(POINT);
        expect(V.x).to.be.closeTo(POINT.x, 0.001);
        expect(V.y).to.be.closeTo(POINT.y, 0.001);
    });

    it('should be created with two points', () => {
        const POINT1 = new Point(1, 1);
        const POINT2 = new Point(6, 11);
        const VECTOR = Vector.fromPoints(POINT1, POINT2);
        expect(VECTOR.x).to.equal(5);
        expect(VECTOR.y).to.equal(10);
    });

    it('should compute its norm', () => {
        const VECTOR = new Vector(3, 4);
        expect(VECTOR.norm()).to.equal(5);
    });

    it('should compute the sum with a peer', () => {
        const X1 = 1.4,  Y1 = -8.4;
        const X2 = 15.7, Y2 = 9.78;
        const V1 = new Vector(X1, Y1);
        const V2 = new Vector(X2, Y2);
        const V3 = new Vector(X1 + X2, Y1 + Y2);
        const V1P2 = V1.plus(V2);
        expect(V1P2.x).to.be.closeTo(V3.x, 0.001);
        expect(V1P2.y).to.be.closeTo(V3.y, 0.001);
    });

    it('should compute a product with a scalar', () => {
        const X1 = 1.4, Y1 = -52.4;
        const V1 = new Vector(X1, Y1);
        const SCALAR = -1.98;
        const V_S = V1.times(SCALAR);
        expect(V_S.x).to.be.closeTo(V1.x * SCALAR, 0.001);
        expect(V_S.y).to.be.closeTo(V1.y * SCALAR, 0.001);
    });

    it('should compute a scalar product', () => {
        const VECTOR1 = new Vector(1, 2);
        const VECTOR2 = new Vector(2, 3);
        expect(VECTOR1.scalar(VECTOR2)).to.equal(1 * 2 + 2 * 3);
        expect(VECTOR2.scalar(VECTOR1)).to.equal(1 * 2 + 2 * 3);
    });

    describe('normalized', () => {

        it('should build a normalized vector when norm is greater than zero', () => {
            const NORM = 4.87;
            const ANGLE = 43.5;
            const V1 = new Vector(NORM * Math.cos(ANGLE), NORM * Math.sin(ANGLE));
            const V_N = new Vector(Math.cos(ANGLE), Math.sin(ANGLE));
            const V1_N = V1.normalized();
            expect(V1_N.x).to.be.closeTo(V_N.x, 0.001);
            expect(V1_N.y).to.be.closeTo(V_N.y, 0.001);
        });

        it('should throw an error when norm is zero', () => {
            const V1 = new Vector(0, 0);
            expect(V1.normalized).throws();
        });

    });

    it('should compute an angle with a peer', () => {
        const VECTOR11 = new Vector(2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6));
        const VECTOR12 = new Vector(2 * Math.cos(Math.PI / 4), 2 * Math.sin(Math.PI / 4));
        expect(VECTOR11.angleTo(VECTOR12)).to.be.closeTo(Math.PI * (1 / 4 - 1 / 6), 0.001);
    });

});
