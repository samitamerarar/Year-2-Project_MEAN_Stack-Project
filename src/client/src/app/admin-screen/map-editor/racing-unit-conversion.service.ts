import { Injectable } from '@angular/core';

import { Meters } from '../../types';
import { Track } from '../../racing/track';

@Injectable()
export class RacingUnitConversionService {

    private static readonly ASPECT_RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;

    private lengthPerMeter = -1;

    private width = -1;
    private height = -1;

    constructor() { }

    public lengthFromGameUnits(length: Meters): number {
        return length * this.lengthPerMeter;
    }

    public lengthToGameUnits(length: number): Meters {
        return length / this.lengthPerMeter;
    }

    public get windowWidth(): number {
        if (this.width > 0) {
            return this.width;
        }
        else {
            throw new Error('Cannot get window width: not initialized yet.');
        }
    }

    public set windowWidth(width: number) {
        if (width > 0) {
            this.width = width;
            this.height = width / RacingUnitConversionService.ASPECT_RATIO;
            this.lengthPerMeter = this.width / Track.WIDTH_MAX;
        }
        else {
            throw new Error('Cannot set window width: negative value or zero passed.');
        }
    }

    public get windowHeight(): number {
        if (this.height > 0) {
            return this.height;
        }
        else {
            throw new Error('Cannot get window height: not initialized yet.');
        }
    }

    public set windowHeight(height: number) {
        if (height > 0) {
            this.height = height;
            this.width = height * RacingUnitConversionService.ASPECT_RATIO;
            this.lengthPerMeter = this.width / Track.WIDTH_MAX;
        }
        else {
            throw new Error('Cannot set window height: negative value or zero passed.');
        }
    }

}
