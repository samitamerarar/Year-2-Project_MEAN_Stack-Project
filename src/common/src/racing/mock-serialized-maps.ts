import { SerializedMap } from './serialized-map';
import { Point } from '../math/point';
import { SerializedPothole as Pothole } from './serialized-pothole';
import { SerializedPuddle as Puddle } from './serialized-puddle';
import { SerializedSpeedBoost as SpeedBoost } from './serialized-speed-boost';
import { SerializedBestTime } from './serialized-best-time';
import { SerializedPlayer } from './serialized-player';

export class MockSerializedMaps {

    public empty1(): SerializedMap {
        return new SerializedMap('', '', '', 0, 0, 0, [], [], [], []);
    }

    public functional1(): SerializedMap {
        return new SerializedMap(
            'functional1',
            'desc. functional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0), new Point(100, 50), new Point(0, 100)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)],
            [
                new SerializedBestTime(new SerializedPlayer('x'), 1),
                new SerializedBestTime(new SerializedPlayer('y'), 2),
                new SerializedBestTime(new SerializedPlayer('z'), 3)
            ]
        );
    }

    public functional2(): SerializedMap {
        return new SerializedMap(
            'functional2',
            '',
            'Amateur',
            11,
            3,
            12,
            [new Point(0, 0), new Point(100, 90), new Point(0, 100)],
            [],
            [],
            [],
            [
                new SerializedBestTime(new SerializedPlayer('a'), 10),
                new SerializedBestTime(new SerializedPlayer('b'), 20),
                new SerializedBestTime(new SerializedPlayer('c'), 30)
            ]
        );
    }

    // Only 2 points
    public disfunctional1(): SerializedMap {
        return new SerializedMap(
            'disfunctional1',
            'desc. disfunctional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)]
        );
    }

    // Crossing lines
    public disfunctional2(): SerializedMap {
        return new SerializedMap(
            'functional1',
            'desc. functional1',
            'Amateur',
            145,
            35,
            1000,
            [new Point(0, 0), new Point(100, 50), new Point(50, 100), new Point(100, 50), new Point(0, 0)],
            [new Pothole(10), new Pothole(20), new Pothole(50)],
            [new Puddle(15), new Puddle(25), new Puddle(55)],
            [new SpeedBoost(5), new SpeedBoost(15), new SpeedBoost(45)]
        );
    }

    public functionnalMaps(): SerializedMap[] {
        return [this.functional1(), this.functional2()];
    }

}
