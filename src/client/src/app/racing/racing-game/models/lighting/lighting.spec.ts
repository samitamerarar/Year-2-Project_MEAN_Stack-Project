import { TestBed, inject } from '@angular/core/testing';

import { Lighting } from './lighting';
import { DayMode } from '../../day-mode/day-mode';

describe('Lighting', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Lighting
            ]
        });
    });

    let lighting: Lighting;

    beforeEach(inject([Lighting], (lightingInjected: Lighting) => {
        lighting = lightingInjected;
    }));

    it('should be created', () => {
        expect(lighting).toBeTruthy();
    });

    it('should go to day mode', () => {
        // Should not throw
        lighting.dayModeChanged(DayMode.DAY);
    });

    it('should go to night mode', () => {
        // Should not throw
        lighting.dayModeChanged(DayMode.NIGHT);
    });

});
