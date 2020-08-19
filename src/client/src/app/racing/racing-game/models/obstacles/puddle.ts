import * as THREE from 'three';
import { CollisionInfo } from '../../physic/collidable';
import { Meters } from '../../../../types';
import { EventManager } from '../../../../event-manager.service';
import { PhysicUtils } from '../../physic/utils';
import { CarPartsLoader } from '../car/car-parts-loader';
import { Car } from '../car/car';
import { TextureLoader } from '../../../services/texture-loader';
import { Obstacle } from './obstacle';
import { COLLISION_EVENT } from '../../../constants';


export enum SlipDirection {
    RIGHT = -1,
    LEFT = 1
}

export class Puddle extends Obstacle {
    private static readonly TEXTURE_URL = '/assets/racing/textures/puddle.jpg';
    private static readonly RADIUS: Meters = 1;
    private static readonly SEGMENTS: number = 40;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly SLIP_FACTOR = 3 * Math.PI / 2;
    private static readonly PUDDLE_TEXTURE_PROMISE = TextureLoader.getInstance().load(Puddle.TEXTURE_URL);
    private static readonly SLIP_FREQUENCY = 1; // Hz
    private static readonly TRACK_HEIGHT: Meters = 0.001;
    private static readonly FREQUENCY_SCALING_FACTOR = 1000; // ms / s

    public readonly waitToLoad: Promise<void> = Puddle.PUDDLE_TEXTURE_PROMISE.then(() => { });

    constructor(eventManager: EventManager, private slipDirection: SlipDirection) {
        super(new THREE.CircleGeometry(Puddle.RADIUS, Puddle.SEGMENTS).rotateX(Puddle.ORIENTATION_ON_MAP));
        CarPartsLoader.CAR_COLORED_PARTS.then((parts: THREE.Mesh[]) => {
            const mesh = new THREE.Mesh();
            mesh.add(...parts);
            const dimensions = PhysicUtils.getObjectDimensions(mesh);
            const scale = Math.sqrt((dimensions.x * dimensions.z) / Math.PI);
            this.scale.setScalar(scale);
        });
        Puddle.PUDDLE_TEXTURE_PROMISE.then(texture => {
            this.material = new THREE.MeshPhongMaterial({ map: texture, specular: 0 });
        });
        this.position.y = Puddle.TRACK_HEIGHT;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && collision.target instanceof Car) {
            const velocityFactor = collision.target.velocity.length() / Car.DEFAULT_TARGET_SPEED;
            collision.target.angularVelocity.set(0, velocityFactor * Puddle.SLIP_FACTOR * this.slipDirection *
                Math.sin(2 * Math.PI * Date.now() / Puddle.FREQUENCY_SCALING_FACTOR * Puddle.SLIP_FREQUENCY), 0);
        }
    }
}
