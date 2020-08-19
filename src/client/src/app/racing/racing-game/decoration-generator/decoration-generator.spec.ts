import { DecorationGenerator } from './decoration-generator';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { MockMaps } from '../../../admin-screen/map-editor/mock-maps';
import { Decoration } from '../models/decoration/decoration';
import { MapPositionAlgorithms } from '../../util/map-position-algorithms';
import { Point } from '../../../../../../common/src/math/point';
import { Track } from '../../track';
import * as THREE from 'three';
import { PhysicUtils } from '../physic/utils';


describe('Decoration generator', () => {

    let decorationGenerator: DecorationGenerator;
    let map: RenderableMap;
    const mockMaps = new MockMaps();
    const PLACEMENT_SPEC_TIMEOUT = 120000; // ms

    beforeEach(() => {
            map = mockMaps.renderableMap();
            decorationGenerator = new DecorationGenerator();
        });

    it('Should be created', () => {
        expect(DecorationGenerator).toBeTruthy();
    });

    it('Should add decorations on map',
        (done) => {
            decorationGenerator.placeDecorationsOnMap(map).then(() => {
                expect(map.children.some(child => child instanceof Decoration)).toBeTruthy();
                done();
            });
        },
        PLACEMENT_SPEC_TIMEOUT
    );

    it('Should not place decorations on track',
        (done) => {
            decorationGenerator.placeDecorationsOnMap(map).then(() => {
                const decorations = map.children.filter(child => child instanceof Decoration) as Decoration[];
                let dimensions: THREE.Vector3;
                expect(decorations.every(decoration =>
                    map.mapLines.every(line =>
                        MapPositionAlgorithms.getProjectionOnLine(new Point(decoration.position.x, decoration.position.z), line)
                            .distanceToSegment > (Track.SEGMENT_WIDTH / 2) + ((dimensions = PhysicUtils.getObjectDimensions(decoration)) &&
                            Math.max(dimensions.x, dimensions.z))
                    )
                )).toBeTruthy();
                done();
            });
        },
        PLACEMENT_SPEC_TIMEOUT
    );
});
