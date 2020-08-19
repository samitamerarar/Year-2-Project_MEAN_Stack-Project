import { TestBed, inject } from '@angular/core/testing';

import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Track } from '../../racing/track';

describe('RacingUnitConversionService', () => {

    let converter: RacingUnitConversionService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RacingUnitConversionService]
        });
    });

    beforeEach(inject([RacingUnitConversionService],
                      (converterService: RacingUnitConversionService) => {
        converter = converterService;
        converter.windowWidth = 100;
    }));

    it('should be created', () => {
        expect(converter).toBeTruthy();
    });

    it('should keep its aspect ratio', () => {
        const CONVERTER_RATIO = () => converter.windowWidth / converter.windowHeight;
        const RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;
        converter.windowWidth = 89.8;
        expect(CONVERTER_RATIO()).toBeCloseTo(RATIO);
        converter.windowHeight = 1893.78;
        expect(CONVERTER_RATIO()).toBeCloseTo(RATIO);
    });

    it('should convert length from game units', () => {
        const GAME_LENGTH = 158.5;
        const EXPECTED_LENGTH = GAME_LENGTH * (converter.windowWidth / Track.WIDTH_MAX);
        expect(converter.lengthFromGameUnits(GAME_LENGTH)).toBeCloseTo(EXPECTED_LENGTH);
    });

    it('should convert length to game units', () => {
        const LENGTH = 50.4;
        const EXPECTED_GAME_LENGTH =
            LENGTH * (Track.WIDTH_MAX / converter.windowWidth);
        expect(converter.lengthToGameUnits(LENGTH)).toBeCloseTo(EXPECTED_GAME_LENGTH);
    });

});
