import { TestBed, inject } from '@angular/core/testing';

import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map } from './map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../common/src/math/point';
import { Item } from './items/item';
import { SerializedItem } from '../../../../../common/src/racing/serialized-item';
import { MockMaps } from './mock-maps';
import { MockSerializedMaps } from '../../../../../common/src/racing/mock-serialized-maps';

describe('MapConverterService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapConverterService,
                RacingUnitConversionService,
                MockMaps,
                MockSerializedMaps
            ]
        });
    });

    let service: MapConverterService;
    let converter: RacingUnitConversionService;
    let mockMaps: MockMaps;
    let mockSerializedMaps: MockSerializedMaps;

    beforeEach(inject([MapConverterService, RacingUnitConversionService, MockMaps, MockSerializedMaps],
            (injectedService: MapConverterService,
            converterService: RacingUnitConversionService,
            mockMapsFactory: MockMaps,
            mockSerializedMapsFactory: MockSerializedMaps) => {
        service = injectedService;
        converter = converterService;
        converterService.windowWidth = 500;
        converterService.windowHeight = 300;
        mockMaps = mockMapsFactory;
        mockSerializedMaps = mockSerializedMapsFactory;
    }));

    const CHECK_POINTS_SERIALIZATION = (map: Map, serializedMap: SerializedMap) => {
        let mapPoints: Point[];
        if (map.isClockwise()) {
            mapPoints = map.path.points.slice();
        }
        else {
            mapPoints = map.path.points.slice().reverse();
        }
        mapPoints.pop();

        expect(mapPoints.length).toEqual(serializedMap.points.length,
                                         'Not the same number of points.');

        for (let i = 0; i < mapPoints.length; ++i) {
            const MAP_POINT = mapPoints[i];
            const SMAP_POINT = serializedMap.points[i];
            const X = converter.lengthToGameUnits(MAP_POINT.x);
            const Y = converter.lengthToGameUnits(MAP_POINT.y);
            const CONVERTED_MAP_POINT = new Point(X, Y);
            expect(CONVERTED_MAP_POINT.x).toBeCloseTo(SMAP_POINT.x, 0.001,
                                                      'Points X-coordinates don\'t match');
            expect(CONVERTED_MAP_POINT.y).toBeCloseTo(SMAP_POINT.y, 0.001,
                                                      'Points Y-coordinates don\'t match');
        }
    };

    const CHECK_ITEMS_SERIALIZATION = (map: Map, serializedMap: SerializedMap) => {
        const MAP_ITEM_ARRAYS: Item[][] = [
            map.potholes,
            map.puddles,
            map.speedBoosts
        ];
        const SMAP_ITEM_ARRAYS: SerializedItem[][] = [
            serializedMap.potholes,
            serializedMap.puddles,
            serializedMap.speedBoosts
        ];
        for (let i = 0; i < MAP_ITEM_ARRAYS.length; ++i) {
            expect(MAP_ITEM_ARRAYS[i].length).toEqual(SMAP_ITEM_ARRAYS[i].length,
                                                      'Not the same number of items');
            for (let j = 0; j < MAP_ITEM_ARRAYS[i].length; ++j) {
                const MAP_ITEM = MAP_ITEM_ARRAYS[i][j];
                const SMAP_ITEM = SMAP_ITEM_ARRAYS[i][j];
                const CONVERTED_POSITION =
                    converter.lengthToGameUnits(MAP_ITEM.position);
                expect(CONVERTED_POSITION).toBeCloseTo(SMAP_ITEM.position, 0.001,
                                                       'Item positions don\'t match');
            }
        }
    };

    const CHECK_SERIALIZATION = (map: Map, serializedMap: SerializedMap, isSerialization: boolean) => {
        expect(map.name).toEqual(serializedMap.name, 'Different map names');
        expect(map.description).toEqual(serializedMap.description, 'Different descriptions');
        expect(map.type).toEqual(serializedMap.type, 'Different map types');
        CHECK_POINTS_SERIALIZATION(map, serializedMap);
        CHECK_ITEMS_SERIALIZATION(map, serializedMap);
        if (isSerialization) {
            expect(serializedMap.sumRatings).toEqual(0, 'Sum of ratings not zero');
            expect(serializedMap.numberOfRatings).toEqual(0, 'Number of ratings not zero');
            expect(serializedMap.numberOfPlays).toEqual(0, 'Number of plays not zero');
            expect(serializedMap.bestTimes.length).toEqual(0, 'Best times not empty');
        }
    };

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('serialize', () => {

        it('should serialize maps as-is if they are valid and clockwise', () => {
            const CLOCKWISE = mockMaps.clockwise();
            CHECK_SERIALIZATION(CLOCKWISE, service.serialize(CLOCKWISE), true);
        });

        it('should serialize maps reversed if they are valid and counter-clockwise', () => {
            const COUNTER_CLOCKWISE = mockMaps.counterClockwise();
            CHECK_SERIALIZATION(COUNTER_CLOCKWISE, service.serialize(COUNTER_CLOCKWISE), true);
        });

        it('should not serialize maps if they are not valid', () => {
            expect(() => service.serialize(mockMaps.disfunctionalMap1())).toThrow();
            expect(() => service.serialize(mockMaps.disfunctionalMap2())).toThrow();
            expect(() => service.serialize(mockMaps.emptyMap1())).toThrow();
        });

    });

    describe('deserialize', () => {

        it('should deserialize maps if they are valid', () => {
            const MAPS: SerializedMap[] = [
                mockSerializedMaps.functional1(),
                mockSerializedMaps.functional2()
            ];

            MAPS.forEach((map: SerializedMap, idx) => {
                CHECK_SERIALIZATION(service.deserialize(map), map, false);
            });
        });

        it('should not deserialize maps if they are not valid', () => {
            const DISFUNCTIONAL_MAPS: SerializedMap[] = [
                mockSerializedMaps.disfunctional1(),
                mockSerializedMaps.disfunctional2()
            ];

            DISFUNCTIONAL_MAPS.forEach((map: SerializedMap) => {
                expect(() => service.deserialize(map)).toThrow();
            });
        });

    });

});
