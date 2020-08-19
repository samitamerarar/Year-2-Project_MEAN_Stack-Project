import * as THREE from 'three';
import { CollisionInfo, Collidable } from '../../physic/collidable';
import { Meters } from '../../../../types';
import { EventManager } from '../../../../event-manager.service';
import { CarPartsLoader } from '../car/car-parts-loader';
import { Car } from '../car/car';
import { CarPhysic } from '../car/car-physic';
import { TextureLoader } from '../../../services/texture-loader';
import { Obstacle } from './obstacle';
import { COLLISION_EVENT } from '../../../constants';
import { PhysicUtils } from '../../physic/utils';

export class SpeedBooster extends Obstacle {
    private static readonly TEXTURE_URL = '/assets/racing/textures/speed-boost.png';
    private static readonly SIDE: Meters = 1;
    private static readonly ORIENTATION_ON_MAP = 3 * Math.PI / 2;

    private static readonly BOOST_SPEED = 40; // m/s
    private static readonly BOOST_INTERVAL = 2000; // ms
    private static readonly TRACK_HEIGHT: Meters = 0.001;
    private static readonly SPEEDBOOSTER_TEXTURE_PROMISE = TextureLoader.getInstance().load(SpeedBooster.TEXTURE_URL);

    public readonly waitToLoad: Promise<void> = SpeedBooster.SPEEDBOOSTER_TEXTURE_PROMISE.then(() => { });
    private boostedTargets: Set<Collidable> = new Set();

    constructor(eventManager: EventManager) {
        super(new THREE.PlaneGeometry(SpeedBooster.SIDE, SpeedBooster.SIDE)
            .rotateX(SpeedBooster.ORIENTATION_ON_MAP).rotateY(Math.PI));
        CarPartsLoader.CAR_COLORED_PARTS.then((parts: THREE.Mesh[]) => {
            const mesh = new THREE.Mesh();
            mesh.add(...parts);
            const dimension = PhysicUtils.getObjectDimensions(mesh).x;
            this.scale.setScalar(dimension);
        });
        SpeedBooster.SPEEDBOOSTER_TEXTURE_PROMISE.then(texture => {
            this.material = new THREE.MeshPhongMaterial({ map: texture, specular: 0.2, emissiveIntensity: 0.2, emissive: 0xffffff });
        });
        this.position.y = SpeedBooster.TRACK_HEIGHT;
        eventManager.registerClass(this);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && collision.target instanceof Car) {
            if (!this.boostedTargets.has(collision.target)) {
                this.boostedTargets.add(collision.target);
                const car = <Car>collision.target;
                car['acceleration'] = 0;
                car['angularAcceleration'] *= 3;
                car.velocity.copy(car.front.multiplyScalar(SpeedBooster.BOOST_SPEED));
                setTimeout(() => {
                    car['acceleration'] = CarPhysic.DEFAULT_ACCELERATION;
                    car['angularAcceleration'] /= 3;
                    this.boostedTargets.delete(collision.target);
                    car.velocity.copy(car.front.multiplyScalar(CarPhysic.DEFAULT_TARGET_SPEED));
                }, SpeedBooster.BOOST_INTERVAL);
            }
        }
    }
}
