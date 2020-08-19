import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { EventManager } from '../../../../event-manager.service';
import * as THREE from 'three';
import { Kilograms, Meters } from '../../../../types';
import { Car } from '../car/car';
import { COLLISION_EVENT } from '../../../constants';

const SLOW_FACTOR = 0.8;
/**
 * DEBUG_MODE disables the walls completely for testing (DEBUG)
 */
const DEBUG_MODE = false;

export class InvisibleWall extends CollidableMesh {
    public static readonly WALL_HEIGHT: Meters = 10.0;
    public static readonly WALL_DEPTH: Meters = 1.0;

    public get mass(): Kilograms {
        return DEBUG_MODE ? 0 : Infinity;
    }

    public set mass(value: Kilograms) {
        return;
    }

    constructor(public readonly length: number) {
        super(new THREE.CubeGeometry(length, InvisibleWall.WALL_HEIGHT, InvisibleWall.WALL_DEPTH)
            .translate(0, InvisibleWall.WALL_HEIGHT / 2, 0));
        this.visible = false;
        EventManager.getInstance().registerClass(this, InvisibleWall.prototype);
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (!DEBUG_MODE && collision.source === this && collision.target instanceof Car) {
            collision.target.velocity.multiplyScalar(SLOW_FACTOR);
        }
    }

}
