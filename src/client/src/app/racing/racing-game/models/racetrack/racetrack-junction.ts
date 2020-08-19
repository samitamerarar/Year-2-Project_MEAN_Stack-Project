import * as THREE from 'three';
import { Track } from '../../../track';
import { loadTexture } from '../../../util/textures';

export class RacetrackJunction extends THREE.Mesh {
    private static ASPHALT_URL = 'assets/racing/textures/ground_asphalt_old_07.png';
    private static ASPHALT_NORMALS_URL = 'assets/racing/normals/road_normal_map.jpg';

    private static ASPHALT_TEXTURE_PROMISE: Promise<THREE.Texture> = loadTexture(RacetrackJunction.ASPHALT_URL);
    private static ASPHALT_NORMALS_PROMISE: Promise<THREE.Texture> = loadTexture(RacetrackJunction.ASPHALT_NORMALS_URL);

    private static readonly RADIUS = Track.SEGMENT_WIDTH / 2;
    private static readonly SEGMENTS = 50;

    public readonly waitToLoad: Promise<void>;

    constructor() {
        super(new THREE.CircleGeometry(RacetrackJunction.RADIUS, RacetrackJunction.SEGMENTS).rotateX(3 * Math.PI / 2));
        this.material = new THREE.MeshPhongMaterial({side: THREE.FrontSide, shininess: 1000});
        this.waitToLoad = Promise.all([
            RacetrackJunction.ASPHALT_TEXTURE_PROMISE,
            RacetrackJunction.ASPHALT_NORMALS_PROMISE
        ]).then((textures) =>
            textures.map((texture) => texture.clone())
                .map((texture) => {
                    texture.needsUpdate = true;
                    return texture;
                })
            ).then(([texture, normalMap]) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(Track.SEGMENT_WIDTH, Track.SEGMENT_WIDTH);
                normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
                normalMap.repeat.set(Track.SEGMENT_WIDTH, Track.SEGMENT_WIDTH);

                (<THREE.MeshPhongMaterial>this.material).map = texture;
                (<THREE.MeshPhongMaterial>this.material).normalMap = normalMap;
            }).then(() => { });
        this.position.add(new THREE.Vector3(0, 0.01, 0));
    }
}
