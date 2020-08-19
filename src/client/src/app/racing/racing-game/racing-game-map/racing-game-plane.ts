import * as THREE from 'three';
import { Track } from '../../track';
import { loadTexture } from '../../util/textures';
import { TerrainGeometry } from '../../util/terrain-geometry';
import { Line, Point } from '../../../../../../common/src/math/index';

export class RacingGamePlane extends THREE.Mesh {
    private static readonly GRASS_URL = '/assets/racing/textures/grass.png';

    private static readonly GRASS_TEXTURE_PROMISE = loadTexture(RacingGamePlane.GRASS_URL);

    public readonly waitToLoad: Promise<void>;

    constructor(trackSegments: Line[], trackCenterPosition: THREE.Vector3) {
        super();

        this.position.copy(trackCenterPosition);
        this.rotateX(-Math.PI / 2);
        this.receiveShadow = true;

        this.waitToLoad = RacingGamePlane.GRASS_TEXTURE_PROMISE.then((texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(Track.WIDTH_MAX, Track.HEIGHT_MAX);

            this.material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.FrontSide,
                shininess: 1
            });
            this.geometry =
                new TerrainGeometry(this.makeAllSegmentsRelativeToPlaneCenter(trackSegments));
            (this.geometry as TerrainGeometry).verticesNeedUpdate = true;
            (this.geometry as TerrainGeometry).computeMorphNormals();
            (this.geometry as TerrainGeometry).computeVertexNormals();
        }).then(() => { });
    }

    private makeAllSegmentsRelativeToPlaneCenter(trackSegments: Line[]): Line[] {
        const relativeTrackSegments = trackSegments.map(segment => this.makeSegmentRelativeToPlaneCenter(segment));
        return relativeTrackSegments;
    }

    private makeSegmentRelativeToPlaneCenter(segment: Line): Line {
        const positionPoint = new Point(this.position.x, this.position.z);
        const relativeOrigin = segment.origin.clone().substract(positionPoint);
        const relativeDestination = segment.destination.clone().substract(positionPoint);
        return new Line(relativeOrigin, relativeDestination);
    }

}
