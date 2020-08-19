import { Injectable } from '@angular/core';

import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map, MapError } from './map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Point } from '../../../../../common/src/math/point';
import { Path } from './path';
import { PointIndex } from './point-index';
import { Track } from '../../racing/track';
import { Pothole } from './pothole';
import { Puddle } from './puddle';
import { ItemGenerator } from './items/item-generator';
import { SpeedBoost } from './speed-boost';

@Injectable()
export class MapEditorService {

    private width = 0;
    private height = 0;

    private map: Map;

    constructor(private converter: RacingUnitConversionService,
        private mapConverter: MapConverterService,
        private itemGenerator: ItemGenerator) {
        this.newMap();
    }

    public get currentMap(): Map {
        return this.map;
    }

    public get mapWidth(): number {
        return this.width;
    }

    public set mapWidth(mapWidth: number) {
        const ASPECT_RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;
        this.width = mapWidth;
        this.height = mapWidth / ASPECT_RATIO;
        this.converter.windowWidth = this.width;
        this.converter.windowHeight = this.height;
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public get mapHeight(): number {
        return this.height;
    }

    public set mapHeight(mapHeight: number) {
        const ASPECT_RATIO = Track.WIDTH_MAX / Track.HEIGHT_MAX;
        this.width = ASPECT_RATIO * mapHeight;
        this.height = mapHeight;
        this.converter.windowWidth = this.width;
        this.converter.windowHeight = this.height;
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public newMap(): void {
        this.map = new Map();
        this.map.minimumSegmentLength = this.minimumDistanceBetweenPoints;
    }

    public get minimumDistanceBetweenPoints(): number {
        return this.converter.lengthFromGameUnits(2 * Track.SEGMENT_WIDTH);
    }

    public get isMapClockwise(): boolean {
        return this.map.isClockwise() ||
            this.map.computeErrors() !== MapError.NONE;
    }

    public serializeMap(): SerializedMap {
        if (this.areWidthAndHeightSet()) {
            return this.mapConverter.serialize(this.map);
        }
        else {
            throw new Error('Serializing map failed: ' +
                'Please set map width and height to a value ' +
                'that is >0 before attempting to deserialize.');
        }
    }

    public deserializeMap(serializedMap: SerializedMap): void {
        if (this.areWidthAndHeightSet()) {
            let newMap: Map;
            try {
                newMap = this.mapConverter.deserialize(serializedMap);
            }
            catch (error) { }
            finally {
                this.map = newMap;
            }
        }
        else {
            throw new Error('Deserializing map failed: ' +
                'Please set map width and height to a value ' +
                'that is >0 before attempting to deserialize.');
        }
    }

    public get points(): Point[] {
        return this.map.path.points;
    }

    public get path(): Path {
        return this.map.path;
    }

    public pushPoint(point: Point): void {
        if (this.map.isClosed()) {
            return;
        }
        if (this.areValidCoordinates(point)) {
            this.map.path.points.push(point);
        }
    }

    public popPoint(): Point {
        if (this.currentMap.isClosed()) {
            this.destroyItems();
        }

        return this.map.path.points.pop();
    }

    public editPoint(index: PointIndex, coordinates: Point): void {
        if (this.areValidCoordinates(coordinates)) {
            this.map.resetAllItems();
            const POINTS_TO_EDIT = [];
            const EDITING_FIRST_POINT = (index === 0);
            const IS_PATH_CLOSED =
                (this.points[0].equals(this.points[this.points.length - 1]));

            if (EDITING_FIRST_POINT && IS_PATH_CLOSED) {
                POINTS_TO_EDIT.push(this.points[0],
                    this.points[this.points.length - 1]);
            }
            else {
                POINTS_TO_EDIT.push(this.points[index]);
            }

            POINTS_TO_EDIT.forEach((point: Point) => {
                point.x = coordinates.x;
                point.y = coordinates.y;
            });
        }
    }

    private areValidCoordinates(coordinates: Point): boolean {
        return coordinates.x < this.mapWidth && coordinates.y < this.mapHeight &&
            coordinates.x > 0 && coordinates.y > 0;
    }

    public isFirstPoint(pointIndex: PointIndex): boolean {
        return pointIndex === 0;
    }

    public get firstPoint(): Point {
        if (this.points.length > 0) {
            return this.points[0];
        }
        else {
            throw new Error('Cannot get first map point: map is empty.');
        }
    }

    public computeMapErrors(): MapError {
        return this.map.computeErrors();
    }

    private areWidthAndHeightSet(): boolean {
        return this.mapWidth > 0 && this.mapHeight > 0;
    }

    public addPothole(): void {
        this.itemGenerator.addObstacle(Pothole, this.currentMap, this.currentMap.potholes);
    }

    public addPuddles(): void {
        this.itemGenerator.addObstacle(Puddle, this.currentMap, this.currentMap.puddles);
    }

    public addSpeedBoosts(): void {
        this.itemGenerator.addObstacle(SpeedBoost, this.currentMap, this.currentMap.speedBoosts);
    }

    public randomisePothole(): void {
        this.itemGenerator.randomlyModifyObjectsTypePositions(Pothole, this.currentMap, this.currentMap.potholes);
    }

    public randomisePuddles(): void {
        this.itemGenerator.randomlyModifyObjectsTypePositions(Puddle, this.currentMap, this.currentMap.puddles);
    }

    public randomiseSpeedBoosts(): void {
        this.itemGenerator.randomlyModifyObjectsTypePositions(SpeedBoost, this.currentMap, this.currentMap.speedBoosts);
    }

    public destroyItems(): void {
        this.currentMap.potholes = [];
        this.currentMap.puddles = [];
        this.currentMap.speedBoosts = [];
    }
}
