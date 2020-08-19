import * as THREE from 'three';

import { DayModeNotifiable, isDayModeNotifiable } from './day-mode-notifiable';
import { DayMode } from './day-mode';

class DayModeNotifiableImplementer extends THREE.Object3D implements DayModeNotifiable {

    public callback: () => void;

    public dayModeChanged(newMode: DayMode): void {
        this.callback();
    }

}

describe('DayModeNotifiable', () => {

    describe('isDayModeNotifiable', () => {

        it('should tell that a isDayModeNotifiable object is one', () => {
            const OBJECT = new DayModeNotifiableImplementer();
            expect(isDayModeNotifiable(OBJECT)).toBe(true);
        });

        it('should tell that a isDayModeNotifiable object is one', () => {
            const OBJECT = new THREE.Object3D();
            expect(isDayModeNotifiable(OBJECT)).toBe(false);
        });

    });

});
