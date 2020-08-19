import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { Point } from '../../../../../../common/src/math/index';
import { Vector3 } from 'three';
import { DecorationFactory, DecorationType } from './decoration-factory';
import { Line } from '../../../../../../common/src/math/line';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Projection } from '../../util/projection';
import { Decoration } from '../models/decoration/decoration';
import { Track } from '../../track';
import { PhysicUtils } from '../physic/utils';
import { Tree } from '../models/decoration/tree';
import { Bush } from '../models/decoration/bush';

interface DecorationData {
    decoration: Decoration;
    boundingBox: THREE.Box3;
}

export class DecorationGenerator {

    private static readonly ACCEPTABLE_RADIUS = 1.5 * Track.SEGMENT_WIDTH;
    private static readonly DECORATION_COUNT_PER_ZONE = 20;
    private static readonly CIRCLE_RADIUS_RADIAN = 2 * Math.PI;
    private static readonly DECORATION_FACTORY = new DecorationFactory();
    private static readonly MAX_PLACEMENT_TRIES = 20;

    public placeDecorationsOnMap(map: RenderableMap): Promise<void> {
        return Promise.all([Tree.WAIT_TO_LOAD, Bush.WAIT_TO_LOAD]).then(async () => {
            const mapLength = map.computeLength();
            const numberOfPoints = Math.floor(mapLength / (DecorationGenerator.ACCEPTABLE_RADIUS * 2));
            const allDecorationsData: DecorationData[] = [];

            for (let intervalIndex = 0 ; intervalIndex <= numberOfPoints; intervalIndex++) {
                const interval = intervalIndex * (DecorationGenerator.ACCEPTABLE_RADIUS * 2);
                const point = this.generateCoordinatePositionMap(interval, map);
                await this.placeDecorationsAround(point, map, allDecorationsData);
            }

            allDecorationsData.forEach((decorationData) => map.add(decorationData.decoration));
        });
    }

    private async placeDecorationsAround(point: THREE.Vector3, map: RenderableMap, allDecorationsData: DecorationData[]): Promise<void> {
        for (let i = 0 ; i < DecorationGenerator.DECORATION_COUNT_PER_ZONE; i++) {
            this.tryPlacingSingleDecorationAround(point, map, allDecorationsData);
        }
    }

    private async tryPlacingSingleDecorationAround(point: THREE.Vector3,
                                                   map: RenderableMap,
                                                   allDecorationsData: DecorationData[]): Promise<void> {
        const pointOnMap = new THREE.Vector3();
        let decorationData: DecorationData;
        let tryCount = 0;
        do {
            const decoration = await this.generateRandomDecoration();
            const coordinatePositionOnRadius = this.generateCoordinatePositionRadius();
            pointOnMap.addVectors(point, coordinatePositionOnRadius);
            decoration.position.copy(pointOnMap);
            decoration.rotation.y = this.generateRandomAngle();
            decorationData = {
                decoration: decoration,
                boundingBox: new THREE.Box3().setFromObject(decoration)
            };
        } while ((this.getIfDecorationSuperposed(decorationData, allDecorationsData) || this.getIfOnTrack(decorationData, map)) &&
            tryCount++ < DecorationGenerator.MAX_PLACEMENT_TRIES);

        const placementSuccessful = tryCount <= DecorationGenerator.MAX_PLACEMENT_TRIES;
        if (placementSuccessful) {
            allDecorationsData.push(decorationData);
        }
    }

    private getIfDecorationSuperposed(decorationData: DecorationData, allDecorationsData: DecorationData[]): boolean {
        for (const decorationOnMap of allDecorationsData) {
            if (decorationData.boundingBox.intersectsBox(decorationOnMap.boundingBox)) {
                return true;
            }
        }
        return false;
    }

    private getIfOnTrack(decorationData: DecorationData, map: RenderableMap): boolean {
        const lines = map.mapLines;
        const decoration = decorationData.decoration;
        const coordinatePoint = new Point(decoration.position.x, decoration.position.z);
        const decorationDimensions = PhysicUtils.getObjectDimensions(decoration);
        for (const line of lines) {
            const projection = MapPositionAlgorithms.getProjectionOnLine(coordinatePoint, line);
            if (projection.distanceToSegment <= ((Track.SEGMENT_WIDTH / 2) + Math.max(decorationDimensions.x, decorationDimensions.z))) {
                return true;
            }
        }
        return false;
    }

    private generateCoordinatePositionMap(interval: number, map: RenderableMap): THREE.Vector3 {
        const lines = map.mapLines;
        for (const line of lines) {
            if (interval > line.translation.norm()) {
                interval -= line.translation.norm();
            } else {
                const point = line.interpolate(interval / line.translation.norm());
                const pointOnMap = new THREE.Vector3(point.x, 0, point.y);
                return pointOnMap;
            }
        }
        throw new Error('cannot find interval greater than map length');
    }

    private generateRandomRadiusForPosition(): number {
        return Math.random() * DecorationGenerator.ACCEPTABLE_RADIUS;
    }

    private generateRandomAngle(): number {
        return Math.random() * DecorationGenerator.CIRCLE_RADIUS_RADIAN;
    }

    private generateCoordinatePositionRadius(): THREE.Vector3 {
        const randomRadius = this.generateRandomRadiusForPosition();
        const randomAngle = this.generateRandomAngle();
        return new THREE.Vector3(randomRadius * Math.cos(randomAngle), 0, randomRadius * Math.sin(randomAngle));
    }

    private generateRandomDecoration(): Promise<Decoration> {
        const numberOfDecorationType = DecorationType.COUNT - 1;
        const randomIndex = Math.floor(Math.random() * numberOfDecorationType);
        const decoration = DecorationGenerator.DECORATION_FACTORY.getClassInstance(randomIndex as DecorationType);
        return decoration.waitToChildrenAdded.then(() => decoration);
    }

}
