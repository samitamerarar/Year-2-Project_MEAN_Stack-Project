import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { MapColors } from './map-colors';

export const INNER_COLOR_IDX = 0;
export const RIM_COLOR_IDX   = INNER_COLOR_IDX + 1;

export abstract class AbstractMapPoint extends Point implements Drawable {

    protected context: CanvasRenderingContext2D;
    public isActive = false;
    private activeColors: MapColors;
    private inactiveColors: MapColors;

    constructor(context: CanvasRenderingContext2D,
                x: number,
                y: number,
                activeColors: MapColors,
                inactiveColors: MapColors) {
        super(x, y);
        this.context = context;
        this.activeColors = activeColors;
        this.inactiveColors = inactiveColors;
    }

    public abstract draw(): void;

    public abstract isUnder(coordinates: Point): boolean;

    protected currentColors(): MapColors {
        return this.isActive ? this.activeColors : this.inactiveColors;
    }

}
