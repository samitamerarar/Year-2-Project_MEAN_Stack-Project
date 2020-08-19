import * as THREE from 'three';

import { DayModeNotifiable } from '../../day-mode/day-mode-notifiable';
import { DayMode } from '../../day-mode/day-mode';

export interface LightOptions {
    color: number;
    rotation?: THREE.Euler;
    intensity: number;
}

export interface LightingOptions {
    keyLight: LightOptions;
    backlight: LightOptions;
}

/**
 * Class which manages the scene's lighting.
 * The scene's lighting is a three-point lighting:
 * https://en.wikipedia.org/wiki/Three-point_lighting
 */
export class Lighting extends THREE.Object3D implements DayModeNotifiable {

    private readonly KEY_LIGHT: THREE.DirectionalLight;
    private readonly BACK_LIGHT: THREE.AmbientLight;

    constructor() {
        super();
        this.KEY_LIGHT  = new THREE.DirectionalLight();
        this.BACK_LIGHT = new THREE.AmbientLight();
        this.add(this.KEY_LIGHT, this.BACK_LIGHT);
    }

    public dayModeChanged(newMode: DayMode): void {
        const OPTIONS = newMode.LIGHTING_OPTIONS;
        this.changeLightOptionsFor(this.KEY_LIGHT, OPTIONS.keyLight);
        this.changeLightOptionsFor(this.BACK_LIGHT, OPTIONS.backlight);
    }

    private changeLightOptionsFor(light: THREE.Light,
                                  options: LightOptions): void {
        const BASE_VECTOR = new THREE.Vector3(0, 0, -1);
        light.color.setHex(options.color);
        light.intensity = options.intensity;
        if (options.rotation) {
            light.position.copy(BASE_VECTOR.applyEuler(options.rotation));
        }
    }

}
