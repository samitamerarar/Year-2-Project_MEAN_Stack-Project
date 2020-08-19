import * as THREE from 'three';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { InvisibleWall } from '../models/invisible-wall/invisible-wall';
import { Track } from '../../track';
import { Line } from '../../../../../../common/src/math/index';

const segmentTranslation = (Track.SEGMENT_WIDTH + InvisibleWall.WALL_DEPTH) / 2;
const startingInterpolationLowerWall = 0.25;
const startingInterpolationUpperWall = 0.75;

enum TrackSide {
    LEFT = -1,
    RIGHT = 1
}

enum TrackPosition {
    DOWN = 0,
    UP = 1
}

export class InvisibleWallsGenerator {

    constructor(private readonly map: RenderableMap) {

    }

    public placeInvisibleWallOnBothSideOfMap(): void {
        this.placeInvisibleWallOnASideOfRaceTrackSegment(TrackSide.LEFT, TrackPosition.UP);
        this.placeInvisibleWallOnASideOfRaceTrackSegment(TrackSide.LEFT, TrackPosition.DOWN);
        this.placeInvisibleWallOnASideOfRaceTrackSegment(TrackSide.RIGHT, TrackPosition.UP);
        this.placeInvisibleWallOnASideOfRaceTrackSegment(TrackSide.RIGHT, TrackPosition.DOWN);
    }

    private placeInvisibleWallOnASideOfRaceTrackSegment(trackSide: TrackSide, trackPosition: TrackPosition): void {
        const lines = this.map.mapLines;
        for (let i = 0; i < lines.length; i++) {
            const wallLengthToSubstract = this.calculateLengthToSubstractFromWall(trackPosition, i);
            const invisibleWallLength = (lines[i].translation.norm() / 2) + wallLengthToSubstract * trackSide;
            const invisibleWall = new InvisibleWall(invisibleWallLength);
            const angle = -(new THREE.Vector2(lines[i].translation.x, lines[i].translation.y).angle());
            const interpolation = this.calculateInterpolation(trackSide, trackPosition, wallLengthToSubstract, i);
            const middlePoint = lines[i].interpolate(interpolation);
            invisibleWall.position.set(middlePoint.x, invisibleWall.position.y, middlePoint.y);
            invisibleWall.rotateY(angle);
            invisibleWall.geometry.translate(0, 0, segmentTranslation * trackSide);
            this.map.add(invisibleWall);
        }
    }

    private calculateAbsoluteAngle(line: Line): number {
        return new THREE.Vector2(line.translation.y, line.translation.x).angle();
    }

    private calculateRelativeAngle(firstAbsoluteAngle: number, secondAbsoluteAngle: number): number {
        return secondAbsoluteAngle - firstAbsoluteAngle;
    }

    private normalizeAngle(angle: number): number {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }

    private calculateAlphaAngle(angle: number): number {
        return this.normalizeAngle(Math.PI - angle);
    }

    private calculateWallIntersectionAdjustmentLength(trackWidth: number, alphaAngle): number {
        return (trackWidth / 2) / Math.tan(alphaAngle / 2);
    }

    private calculateLengthToSubstractFromWall(trackPosition: TrackPosition, i: number): number {
        const firstAndSecondAbsoluteAngle = this.getAbsoluteAngleOfSegments(trackPosition, i);
        const relativeAngle = this.calculateRelativeAngle(firstAndSecondAbsoluteAngle[0], firstAndSecondAbsoluteAngle[1]);
        const alphaAngle = this.calculateAlphaAngle(relativeAngle);
        return this.calculateWallIntersectionAdjustmentLength(Track.SEGMENT_WIDTH, alphaAngle);
    }

    private calculateInterpolation(trackSide: TrackSide, trackPosition: TrackPosition,
            wallLengthToSubstract: number, lineIndex: number): number {
        if (trackPosition === TrackPosition.DOWN) {
            return (startingInterpolationLowerWall - trackSide * wallLengthToSubstract
                / ( 2 * this.map.mapLines[lineIndex].translation.norm()));
        }
        else if (trackPosition === TrackPosition.UP) {
            return (startingInterpolationUpperWall + trackSide * wallLengthToSubstract
                / ( 2 * this.map.mapLines[lineIndex].translation.norm()));
        }
    }

    private getAbsoluteAngleOfSegments(trackPosition: TrackPosition, lineIndex: number): number[] {
        const firstAndSecondAbsoluteAngle = [];
        if (trackPosition === TrackPosition.DOWN) {
            if (lineIndex > 0) {
                firstAndSecondAbsoluteAngle.push(this.calculateAbsoluteAngle(this.map.mapLines[lineIndex - 1]));
            }
            else if (lineIndex === 0) {
                firstAndSecondAbsoluteAngle.push(this.calculateAbsoluteAngle(this.map.mapLines[this.map.mapLines.length - 1]));
            }
            firstAndSecondAbsoluteAngle.push(this.calculateAbsoluteAngle(this.map.mapLines[(lineIndex)]));
        }
        else if (trackPosition === TrackPosition.UP) {
            firstAndSecondAbsoluteAngle.push(this.calculateAbsoluteAngle(this.map.mapLines[lineIndex]));
            firstAndSecondAbsoluteAngle.push(this.calculateAbsoluteAngle(this.map.mapLines[(lineIndex + 1) % this.map.mapLines.length]));
        }
        return firstAndSecondAbsoluteAngle;
    }

}
