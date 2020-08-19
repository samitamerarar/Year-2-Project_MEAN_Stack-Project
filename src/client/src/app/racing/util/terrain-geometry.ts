import * as THREE from 'three';
import * as ImprovedNoise from 'improved-noise';

import { Track } from '../track';
import { Line, Point } from '../../../../../common/src/math/index';
import { MapPositionAlgorithms } from './map-position-algorithms';

/**
 * @class TerrainGeometry
 * @description Creates and contains the geometry of the racing game's
 * terrain, taking the racing track into account.
 */
export class TerrainGeometry extends THREE.PlaneGeometry {

    private static readonly VERTICES_PER_METER = 2.0;
    private static readonly TERRAIN_DISPLACEMENT_MAX = 50;
    private static readonly WIDTH_SEGMENTS  = Math.ceil( Track.WIDTH_MAX / TerrainGeometry.VERTICES_PER_METER);
    private static readonly HEIGHT_SEGMENTS = Math.ceil(Track.HEIGHT_MAX / TerrainGeometry.VERTICES_PER_METER);

    /**
     * @argument track The track. Must be relative to the geometry's center (0, 0, 0).
     */
    constructor(track: Line[]) {
        super(Track.WIDTH_MAX, Track.HEIGHT_MAX, TerrainGeometry.WIDTH_SEGMENTS, TerrainGeometry.HEIGHT_SEGMENTS);

        const rawTerrainDispalcement = this.generateRawDisplacement();
        const terrainDisplacement = this.flattenTerrainNearTrack(rawTerrainDispalcement, track);

        this.vertices.forEach((vertex, index) => {
            vertex.z += terrainDisplacement[index];
        });
    }

    private generateRawDisplacement(): number[] {
        // METHOD PARTLY TAKEN FROM:
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html

        // Copyright © 2010-2017 three.js authors (MIT License)

        const numberOfWidthVertices  = TerrainGeometry.WIDTH_SEGMENTS  + 1;
        const numberOfHeightVertices = TerrainGeometry.HEIGHT_SEGMENTS + 1;
        const size = numberOfWidthVertices * numberOfHeightVertices;
        const terrainDisplacementUint8 = new Uint8Array(size);

        const perlin = new ImprovedNoise();
        const z = Math.random() * 100;

        let quality = 1;
        for (let j = 0; j < 4; j ++) {

            for (let i = 0; i < size; i ++) {
                const x = i % numberOfWidthVertices, y = (i / numberOfHeightVertices);
                const height = Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                terrainDisplacementUint8[i] = height;
            }

            quality *= 5;

        }

        // Convert Uint8 buffer to number array.
        const perlinNoiseMax = 256;
        const terrainDisplacement: number[] = [];
        terrainDisplacementUint8.forEach(height => terrainDisplacement.push(Number(height) / perlinNoiseMax));
        return terrainDisplacement;
    }

    private flattenTerrainNearTrack(rawTerrainDisplacement: number[], track: Line[]): number[] {
        const terrainDisplacement: number[] = new Array(rawTerrainDisplacement.length);
        this.vertices.forEach((vertex, index) => {
            const position = new Point(vertex.x, -vertex.y);
            const projection = MapPositionAlgorithms.getClosestProjection(position, track);
            terrainDisplacement[index] =
                this.flattenSinglePosition(rawTerrainDisplacement[index], projection.distanceToSegment);
        });
        return terrainDisplacement;
    }

    private flattenSinglePosition(rawDisplacement: number, distanceToTrack: number): number {

        // For formula, see doc/architectures/formula_displacement_factor.jpg

        const c = 1.0 / Track.SEGMENT_WIDTH;
        const d = 4.0;
        const distanceMin = Track.SEGMENT_WIDTH / 2 + TerrainGeometry.VERTICES_PER_METER;
        const distanceAtModulation = 1.0 * Track.SEGMENT_WIDTH;
        const distanceAtMax = 2 * d / c + distanceAtModulation;

        const factorMedium = 0.01;

        let displacementFactor: number;
        if (distanceToTrack < distanceMin) {
            displacementFactor = 0;
        }
        else if (distanceToTrack < distanceAtModulation) {
            displacementFactor = factorMedium;
        }
        else if (distanceToTrack < distanceAtMax) {
            const arctanIncrement = 0.5;
            displacementFactor =
                (1 - factorMedium) *
                (
                    Math.atan(c * (distanceToTrack - distanceAtModulation) - d)
                    / (2 * Math.atan(d))
                    + arctanIncrement
                )
                + factorMedium;
        }
        else {
            displacementFactor = 1;
        }
        return rawDisplacement * displacementFactor * TerrainGeometry.TERRAIN_DISPLACEMENT_MAX;
    }

}
