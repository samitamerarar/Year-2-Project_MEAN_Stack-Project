import * as THREE from 'three';

interface GeneralOptions {
    color: THREE.Color;
    distance: number;
    angle: number;
    exponent: number;
    decay: number;
}

export class CarBreaklight extends THREE.SpotLight {
    private static readonly GENERAL_OPTIONS: GeneralOptions = {
        color: new THREE.Color('red'),
        distance: 100,
        angle: 4 * Math.PI / 9,
        exponent: 1,
        decay: 100,
    };

    public constructor() {
        super(
            CarBreaklight.GENERAL_OPTIONS.color,
            0x000000,
            CarBreaklight.GENERAL_OPTIONS.distance,
            CarBreaklight.GENERAL_OPTIONS.angle,
            CarBreaklight.GENERAL_OPTIONS.exponent,
            CarBreaklight.GENERAL_OPTIONS.decay
        );
    }
}
