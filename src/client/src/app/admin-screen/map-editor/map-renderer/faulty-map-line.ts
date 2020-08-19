import { AbstractMapLine } from './abstract-map-line';
import { Point } from '../../../../../../common/src/math/point';
import { FaultyMapLineColors } from './faulty-map-line-colors';
import { Track } from '../../../racing/track';

const WIDTH = Track.SEGMENT_WIDTH;

export class FaultyMapLine extends AbstractMapLine {

    constructor(context: CanvasRenderingContext2D,
                origin: Point,
                destination: Point) {
        super(context, origin, destination, new FaultyMapLineColors(), WIDTH);
    }

}
