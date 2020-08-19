import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

interface GeneralOptions {
    color: number;
    distance: number;
    angle: number;
    exponent: number;
    decay: number;
}

export interface CarHeadlightDayModeOptions {
    intensity: number;
}

export class CarHeadlight extends THREE.SpotLight implements DayModeNotifiable {

    private static readonly GENERAL_OPTIONS: GeneralOptions = {
        color: 0xf0f0ff,
        distance: 100,
        angle: Math.PI / 4,
        exponent: 1,
        decay: 1,
    };

    public constructor() {
        super(
            CarHeadlight.GENERAL_OPTIONS.color,
            0x000000,
            CarHeadlight.GENERAL_OPTIONS.distance,
            CarHeadlight.GENERAL_OPTIONS.angle,
            CarHeadlight.GENERAL_OPTIONS.exponent,
            CarHeadlight.GENERAL_OPTIONS.decay
        );
    }

    public dayModeChanged(newMode: DayMode): void {
        const OPTIONS = newMode.CAR_HEADLIGHT_OPTIONS;
        this.intensity = OPTIONS.intensity;
    }

}
