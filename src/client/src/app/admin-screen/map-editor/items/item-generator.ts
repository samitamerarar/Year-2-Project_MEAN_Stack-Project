import { Map } from '../map';
import { Item } from './item';
import { Constructor } from '../../../../../../common/src/utils';
import { Interval } from '../../../../../../common/src/math/interval';
import { Point } from '../../../../../../common/src/math/point';
import { Vector } from '../../../../../../common/src/math/vector';
import { SpeedBoost } from '../speed-boost';

export class ItemGenerator {
    private allPositions: number[];
    private halfSegments: Interval[];

    constructor() {
        this.allPositions = [];
    }

    public addObstacle<ItemGenerated extends Item>(constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {
        const MAX_AMOUNT_OF_ITEMS = 5;
        const currentArrayLength = itemArray.length;

        const isSpeedBoost: boolean = (constructor === SpeedBoost);
        if (currentArrayLength === 0) {
            this.generatePositions(map, 1, isSpeedBoost);
            const item = new constructor(this.allPositions[currentArrayLength]);
            itemArray.push(item);
        }
        else if (currentArrayLength < MAX_AMOUNT_OF_ITEMS) {
            for (let i = 0; i < 2; i++) {
                this.generatePositions(map, 1, isSpeedBoost);
                const item = new constructor(this.allPositions[currentArrayLength + i]);
                itemArray.push(item);
            }
        }
        else {
            for (let i = 0; i < MAX_AMOUNT_OF_ITEMS; i++) {
                itemArray.pop();
            }
        }
    }

    public randomlyModifyObjectsTypePositions<ItemGenerated extends Item>
        (constructor: Constructor<ItemGenerated>, map: Map, itemArray: Item[]): void {

        const CURRENT_ARRAY_LENGTH = itemArray.length;

        for (let i = 0; i < CURRENT_ARRAY_LENGTH; i++) {
            itemArray.pop();
        }

        if (constructor === SpeedBoost) {
            this.generatePositions(map, CURRENT_ARRAY_LENGTH, true);
        }
        else {
            this.generatePositions(map, CURRENT_ARRAY_LENGTH);
        }

        for (let i = 0; i < CURRENT_ARRAY_LENGTH; i++) {
            itemArray.push(new constructor(this.allPositions[i]));
        }
    }

    public itemCoordinates(map: Map, item: Item): Point {
        let point: Point;
        let lastMapCoordinates: Point;
        let vector: Vector;
        const POINTS = map.path.points.slice();
        let length = 0;

        for (let i = 0; i < POINTS.length; i++) {
            vector = Vector.fromPoints(POINTS[i], POINTS[i + 1]);
            if ((length + vector.norm()) > item.position) {
                lastMapCoordinates = POINTS[i];
                break;
            }
            else {
                length += vector.norm();
            }
        }

        const itemPositionMinusLastPointPosition = item.position - length;
        point = new Point(vector.normalized().times(itemPositionMinusLastPointPosition).x,
            vector.normalized().times(itemPositionMinusLastPointPosition).y);

        point.x += lastMapCoordinates.x;
        point.y += lastMapCoordinates.y;

        return point;
    }

    private generatePositions(map: Map, nPositionsToGenerate: number, speedBoost?: boolean): void {
        this.allPositions = [];
        this.halfSegments = map.calucateHalfSegment();

        const MAP_LENGTH = map.computeLength() - map.firstStretchLength();
        const MAX_NUMBER_OF_ITEMS = 5;
        let newPosition: number;

        while (this.allPositions.length < MAX_NUMBER_OF_ITEMS) {
            const MIN_DISTANCE = 30;
            const MAX_NUMBER_OF_TRIES = 100;

            let verified;
            let numberOfTries = 0;
            do {
                verified = true;
                numberOfTries += 1;

                if (speedBoost) {
                    const index = Math.round(Math.random() * (this.halfSegments.length - 2) + 1);
                    newPosition = Math.round(Math.random() * (this.halfSegments[index].getLength()) + this.halfSegments[index].lower);
                } else {
                    newPosition = Math.round(Math.random() * (MAP_LENGTH)) + map.firstStretchLength();
                }
                for (const position of [...this.allPositions, ... this.getAllPlacedPosition(map)]) {
                    if (Math.abs(newPosition - position) < MIN_DISTANCE) {
                        verified = false;
                        break;
                    }
                }
            } while (!verified && numberOfTries < MAX_NUMBER_OF_TRIES);

            this.allPositions.push(newPosition);
        }
    }

    private getAllPlacedPosition(map: Map): number[] {
        return [
            ...map.potholes.map((item) => item.position),
            ...map.speedBoosts.map((item) => item.position),
            ...map.puddles.map((item) => item.position)];
    }
}
