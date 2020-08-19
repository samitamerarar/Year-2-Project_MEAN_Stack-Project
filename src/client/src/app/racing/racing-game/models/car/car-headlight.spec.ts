import { TestBed, inject } from '@angular/core/testing';

import { CarHeadlight } from './car-headlight';
import { DayMode } from '../../day-mode/day-mode';

describe('CarHeadlight', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CarHeadlight
            ]
        });
    });

    let headlight: CarHeadlight;

    beforeEach(inject([CarHeadlight], (headlightInjected: CarHeadlight) => {
        headlight = headlightInjected;
    }));

    it('should be created', () => {
        expect(headlight).toBeTruthy();
    });

    it('should go to day mode', () => {
        headlight.dayModeChanged(DayMode.DAY);
        expect(headlight.intensity).toBeCloseTo(0);
    });

    it('should go to night mode', () => {
        headlight.dayModeChanged(DayMode.NIGHT);
        expect(headlight.intensity).toBeGreaterThan(0.1);
    });

});
