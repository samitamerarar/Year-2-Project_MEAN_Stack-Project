import { Map } from './map';
import { Path } from './path';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { SpeedBoost } from './speed-boost';
import { Point } from '../../../../../common/src/math/point';
import { RenderableMap } from '../../racing/racing-game/racing-game-map/renderable-map';
import { EventManager } from '../../event-manager.service';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';

export class MockMaps {

    public static readonly MIN_LINE_LENGTH = 10.0;

    public emptyMap1(): Map {
        return new Map(new Path(), MockMaps.MIN_LINE_LENGTH);
    }

    public functionalMap1(): Map {
        return new Map(new Path([new Point(0, 0), new Point(10, 0), new Point(0, 10), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'professional',
                       [new Pothole(11), new Pothole(17), new Pothole(22)],
                       [new Puddle(15)],
                       [new SpeedBoost(1), new SpeedBoost(7), new SpeedBoost(16), new SpeedBoost(23), new SpeedBoost(27)]);
    }

    public functionalMap2(): Map {
        return new Map(new Path([new Point(0, 0), new Point(100, 0), new Point(0, 100), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'professional',
                       [],
                       [],
                       []);
    }

    public clockwise(): Map {
        return this.functionalMap2();
    }

    public counterClockwise(): Map {
        return new Map(new Path([new Point(0, 0), new Point(0, 10), new Point(10, 0), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'counter-clockwise',
                       'desc. counter-clockwise',
                       'Amateur',
                       [],
                       [],
                       []
        );
    }

    public disfunctionalMap1(): Map {
        return new Map(new Path([new Point(0, 2), new Point(10, 2), new Point(0, 10), new Point(2, 1), new Point(0, 2)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'sdljhgso',
                       [],
                       [],
                       []);
    }

    public disfunctionalMap2(): Map {
        return new Map(new Path([new Point(0, 2), new Point(10, 2), new Point(5, 5), new Point(5, 0), new Point(0, 0)]),
                       MockMaps.MIN_LINE_LENGTH,
                       'name',
                       'description',
                       'sdljhgso',
                       [],
                       [],
                       []);
    }

    public renderableMap(): RenderableMap {
        const serializedMap = new MapConverterService(new RacingUnitConversionService()).serialize(this.functionalMap2());
        const eventManager = EventManager.getInstance();
        return new RenderableMap(serializedMap, eventManager);
    }

}
