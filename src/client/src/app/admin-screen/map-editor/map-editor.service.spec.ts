import { TestBed, inject } from '@angular/core/testing';

import { MapEditorService } from './map-editor.service';
import { Map } from './map';
import { MockMaps } from './mock-maps';
import { MockSerializedMaps } from '../../../../../common/src/racing/mock-serialized-maps';
import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Point } from '../../../../../common/src/math/point';
import { ItemGenerator } from './items/item-generator';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapEditorService,
                MapConverterService,
                RacingUnitConversionService,
                MockMaps,
                MockSerializedMaps,
                ItemGenerator
            ]
        });
    });

    let service: MapEditorService;
    let mockMaps: MockMaps;

    beforeEach(inject([MapEditorService, RacingUnitConversionService, MockMaps, MockSerializedMaps],
                      (injectedService: MapEditorService,
                       converterService: RacingUnitConversionService,
                       mockMapFactory: MockMaps,
                       mockSerializedMapFactory: MockSerializedMaps) => {
        service = injectedService;
        service.mapWidth = 500;
        service.mapHeight = 300;
        mockMaps = mockMapFactory;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['map']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = service['map'];
        expect(INITIAL_MAP).toBeTruthy();

        service.newMap();
        const NEW_MAP = service['map'];
        expect(NEW_MAP).toBeTruthy();
        expect(INITIAL_MAP).not.toBe(NEW_MAP);
    });

    describe('isMapClockwise', () => {

        it('should return true when the map is valid and clockwise', () => {
            service['map'] = mockMaps.clockwise();
            expect(service.isMapClockwise).toBe(true);
        });

        it('should return false when the map is valid but is counter-clockwise', () => {
            service['map'] = mockMaps.counterClockwise();
            expect(service.isMapClockwise).toBe(false);
        });

        it('should return true when the map is invalid', () => {
            service['map'] = mockMaps.disfunctionalMap1();
            expect(service.isMapClockwise).toBe(true);
        });

    });

    it('should be able to check if a path loops back', () => {
        service['map'] = mockMaps.functionalMap1();
        expect(service['map'].isClosed()).toBe(true);
        service['map'] = mockMaps.emptyMap1();
        expect(service['map'].isClosed()).toBe(false);
    });

    it('should be able to add a valid point', () => {
        service['map'] = mockMaps.emptyMap1();
        service['map']['height'] = 500;
        service['map']['width'] = 500;

        expect(service['map'].path.points.length).toBe(0);
        const VALID_POINT: Point = new Point(3, 4);
        service.pushPoint(VALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).toContain(VALID_POINT);

        const INVALID_POINT: Point = new Point(1, 10000);
        service.pushPoint(INVALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).not.toContain(INVALID_POINT);
    });

    it('should be able to delete a point', () => {
        service['map'] = mockMaps.emptyMap1();
        const POINT: Point = new Point(3, 4);
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = mockMaps.functionalMap1();

        service.editPoint(0, new Point(3, 3));
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, new Point(-100, 10000));
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should provide points', () => {
        service['map'] = mockMaps.functionalMap1();

        expect(service.path).toEqual(mockMaps.functionalMap1().path);
    });

    it('should destroy items', () => {
        service['map'] = mockMaps.functionalMap2();
        service.destroyItems();
        expect(service['map'].potholes.length).toEqual(0);
        expect(service['map'].puddles.length).toEqual(0);
        expect(service['map'].speedBoosts.length).toEqual(0);
    });
});
