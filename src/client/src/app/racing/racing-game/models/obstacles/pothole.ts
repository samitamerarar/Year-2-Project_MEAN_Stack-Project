import * as THREE from 'three';
import { Obstacle } from './obstacle';
import { CollisionInfo } from '../../physic/collidable';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable, DynamicCollidable } from '../../physic/dynamic-collidable';
import { PhysicUtils } from '../../physic/utils';
import { CarPartsLoader } from '../car/car-parts-loader';
import { PerspectiveCamera } from '../../rendering/perspective-camera';
import { TextureLoader } from '../../../services/texture-loader';
import { COLLISION_EVENT, AFTER_PHYSIC_UPDATE_EVENT } from '../../../constants';

export class Pothole extends Obstacle {
    private static readonly TEXTURE_URL = '/assets/racing/textures/pothole.png';
    private static readonly RADIUS: number = 1;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;
    private static readonly FREQUENCY_SCALING_FACTOR = 1000; // ms / s
    private static readonly ROTATION_FREQUENCY = 3; // Hz
    private static readonly POTHOLE_TEXTURE_PROMISE = TextureLoader.getInstance().load(Pothole.TEXTURE_URL);
    private static readonly MIN_SPEED = 10; // m/s

    private static readonly SLOW_FACTOR = 0.9;
    private static readonly SHAKE_AMPLITUDE = Math.PI / 240;
    private static readonly TRACK_HEIGHT = 0.03;
    private static readonly SIZE_TO_CAR_PROPORTION = 0.25;

    public readonly waitToLoad: Promise<void> = Pothole.POTHOLE_TEXTURE_PROMISE.then(() => { });

    private targetsToMakeNormal: Set<DynamicCollidable> = new Set();
    private targetsToShake: Set<DynamicCollidable> = new Set();

    constructor(eventManager: EventManager) {
        super(new THREE.CircleGeometry(Pothole.RADIUS, Pothole.SEGMENTS).rotateX(Pothole.ORIENTATION_ON_MAP),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
        const texturedPlane = new THREE.Mesh();
        CarPartsLoader.CAR_COLORED_PARTS.then((parts: THREE.Mesh[]) => {
            const mesh = new THREE.Mesh();
            mesh.add(...parts);
            const dimensions = PhysicUtils.getObjectDimensions(mesh);
            const scale = dimensions.x * Pothole.SIZE_TO_CAR_PROPORTION;
            texturedPlane.geometry = new THREE.CircleGeometry(scale);
        });
        Pothole.POTHOLE_TEXTURE_PROMISE.then((texture) => {
            texturedPlane.material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, specular: 10 });
        });
        texturedPlane.rotateX(Pothole.ORIENTATION_ON_MAP);
        texturedPlane.position.set(0, Pothole.TRACK_HEIGHT, 0);
        this.add(texturedPlane);
        this.position.set(0, Pothole.TRACK_HEIGHT, 0);
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            if (!this.targetsToMakeNormal.has(collision.target)) {
                this.targetsToMakeNormal.delete(collision.target);
            }
            this.targetsToShake.add(collision.target);
            if (collision.target.velocity.length() > Pothole.MIN_SPEED) {
                collision.target.velocity.multiplyScalar(Pothole.SLOW_FACTOR);
            }
        }
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCameraAvailable(event: EventManager.Event<void>) {
        this.targetsToMakeNormal.forEach((target) => {
            const camera = target.getObjectByName(PerspectiveCamera.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                camera.lookAt(PerspectiveCamera.LOOK_AT_POSITION);
            }
        });
        this.targetsToMakeNormal.clear();

        this.targetsToShake.forEach((target) => {
            const camera = target.getObjectByName(PerspectiveCamera.CAMERA_NAME) as THREE.Camera;
            if (camera) {
                this.shakeCamera(camera, target);
            }
            this.targetsToMakeNormal.add(target);
        });
        this.targetsToShake.clear();
    }

    public shakeCamera(camera: THREE.Camera, target: DynamicCollidable) {
        camera.rotation.x = target.velocity.length() * Pothole.SHAKE_AMPLITUDE * Math.sin(
            2 * Math.PI * Date.now() / Pothole.FREQUENCY_SCALING_FACTOR * Pothole.ROTATION_FREQUENCY);
    }
}
