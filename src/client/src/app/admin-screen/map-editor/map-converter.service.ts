import { Injectable } from '@angular/core';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map, MapError } from './map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../common/src/math/point';
import { SerializedPothole } from '../../../../../common/src/racing/serialized-pothole';
import { Pothole } from './pothole';
import { SerializedPuddle } from '../../../../../common/src/racing/serialized-puddle';
import { Puddle } from './puddle';
import { SerializedSpeedBoost } from '../../../../../common/src/racing/serialized-speed-boost';
import { SpeedBoost } from './speed-boost';
import { Track } from '../../racing/track';

@Injectable()
export class MapConverterService {

    constructor(private converter: RacingUnitConversionService) { }

    public serialize(map: Map): SerializedMap {
        if (map.computeErrors() === MapError.NONE) {
            const SERIALIZED_MAP =
                new SerializedMap(map.name.trim(),
                                  map.description,
                                  map.type,
                                  0,
                                  0,
                                  0);
            this.serializePoints(map, SERIALIZED_MAP);
            this.serializeItems(map, SERIALIZED_MAP);
            SERIALIZED_MAP.bestTimes = [];
            return SERIALIZED_MAP;
        }
        else {
            throw new Error('Serialization failed: ' +
                            'The map is currently not valid. ' +
                            'Fix map problems before attempting serialization');
        }
    }

    private serializePoints(map: Map, serializedMap: SerializedMap): void {
        const POINTS: Point[] =
        map.path.points.map((point: Point) => {
            const X = this.converter.lengthToGameUnits(point.x);
            const Y = this.converter.lengthToGameUnits(point.y);
            return new Point(X, Y);
        });

        if (!map.isClockwise()) {
            POINTS.reverse();
        }
        POINTS.pop(); // Do not include the last point ;
                      // it is the same as the first point.

        serializedMap.points = POINTS;
    }

    private serializeItems(map: Map, serializedMap: SerializedMap): void {
        serializedMap.potholes =
            map.potholes.map(
                (pothole: Pothole) =>
                    new SerializedPothole(
                        this.converter.lengthToGameUnits(pothole.position)));
        serializedMap.puddles =
            map.puddles.map(
                (puddle: Puddle) =>
                    new SerializedPuddle(
                        this.converter.lengthToGameUnits(puddle.position)));
        serializedMap.speedBoosts =
            map.speedBoosts.map(
                (speedBoost: SpeedBoost) =>
                    new SerializedSpeedBoost(
                        this.converter.lengthToGameUnits(speedBoost.position)));
    }

    public deserialize(serializedMap: SerializedMap): Map {

        const MAP = new Map();
        MAP.minimumSegmentLength = this.minimumDistanceBetweenPoints;

        this.deserializePoints(serializedMap, MAP);
        this.deserializeItems(serializedMap, MAP);
        MAP.name = serializedMap.name;
        MAP.description = serializedMap.description;
        MAP.type = serializedMap.type;

        if (MAP.computeErrors() === MapError.NONE) {
            return MAP;
        }
        else {
            throw new Error('Deserializing map failed: ' +
                            'The serialized map is not valid.');
        }
    }

    private deserializePoints(serializedMap: SerializedMap, map: Map): void {
        map.path.points = serializedMap.points.map((point: Point) => {
            const X = this.converter.lengthFromGameUnits(point.x);
            const Y = this.converter.lengthFromGameUnits(point.y);
            return new Point(X, Y);
        });

        const FIRST_POINT = map.path.points[0];

        // A Map's last point is supposed to be the same as its first
        // point when it is valid.
        map.path.points.push(new Point(FIRST_POINT.x, FIRST_POINT.y));
    }

    private deserializeItems(serializedMap: SerializedMap, map: Map): void {
        map.potholes =
            serializedMap.potholes.map(
            (pothole: SerializedPothole) =>
                new Pothole(
                    this.converter.lengthFromGameUnits(pothole.position)));
        map.puddles =
            serializedMap.puddles.map(
                (puddle: SerializedPuddle) =>
                    new Puddle(
                        this.converter.lengthFromGameUnits(puddle.position)));
        map.speedBoosts =
            serializedMap.speedBoosts.map(
                (speedBoost: SerializedSpeedBoost) =>
                    new SpeedBoost(
                        this.converter.lengthFromGameUnits(speedBoost.position)));
    }

    private get minimumDistanceBetweenPoints(): number {
        return this.converter.lengthFromGameUnits(2 * Track.SEGMENT_WIDTH);
    }
}
