import { TestBed, inject } from '@angular/core/testing';
import { ItemGenerator } from './item-generator';
import { MockMaps } from '../mock-maps';
import { Pothole } from '../pothole';
import { SpeedBoost } from '../speed-boost';
import { Point } from '../../../../../../common/src/math/point';

describe('Item generator', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockMaps
            ]
        });
    });

    let itemGenerator: ItemGenerator;
    let mockMaps: MockMaps;

    beforeEach(inject([MockMaps],
        (mockMapFactory: MockMaps) => {
            mockMaps = mockMapFactory;
            itemGenerator = new ItemGenerator();
        }));

    it('should be created', () => {
        expect(itemGenerator).toBeTruthy();
    });

    it('should add an item', () => {
        const map1 = mockMaps.functionalMap1();
        const map2 = mockMaps.functionalMap2();

        itemGenerator['generatePositions'](map2, 5);

        itemGenerator.addObstacle(Pothole, map2, map2.potholes);
        expect(map2.potholes.length).toEqual(1);

        itemGenerator.addObstacle(Pothole, map2, map2.potholes);
        expect(map2.potholes.length).toEqual(3);

        itemGenerator['generatePositions'](map1, 5);
        itemGenerator.addObstacle(SpeedBoost, map1, map1.speedBoosts);
        expect(map1.speedBoosts.length).toEqual(0);
    });

    it('should calculate item coordinates', () => {
        const map = mockMaps.functionalMap1();
        const point = new Point(5.75736, 4.24264);
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[0])).toEqual(new Point(1, 0));
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[2]).x).toBeCloseTo(point.x);
        expect(itemGenerator.itemCoordinates(map, map.speedBoosts[2]).y).toBeCloseTo(point.y);
    });
});
