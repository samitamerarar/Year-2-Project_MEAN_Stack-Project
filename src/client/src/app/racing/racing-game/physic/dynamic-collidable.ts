import * as THREE from 'three';
import { PhysicUtils } from './engine';
import { Seconds, Kilograms } from '../../../types';
import { DynamicPhysicMesh, DynamicPhysicElement, isDynamicPhysicElement } from './dynamic-object';
import { Collidable, CollisionInfo, isCollidable } from './collidable';

export interface DynamicCollidable extends DynamicPhysicElement, Collidable { }

export function isDynamicCollidable(obj: any): obj is DynamicCollidable {
    return isDynamicPhysicElement(obj) && isCollidable(obj);
}

export abstract class DynamicCollidableMesh extends DynamicPhysicMesh implements DynamicCollidable {

    public geometry: THREE.Geometry;
    public mass: Kilograms = 1;
    public velocity: THREE.Vector3 = new THREE.Vector3(0);

    public updatePhysic(utils: PhysicUtils, deltaTime: Seconds): void {
        const forceDirections = this.getCollisions(utils, deltaTime);
        forceDirections.forEach(([position, force]) => {
            const torque = position.clone().cross(force);
            const r = position.length();
            let momentOfInertia = (r ** 2) * this.mass; // I = r^2 * m
            momentOfInertia = momentOfInertia !== 0 ? momentOfInertia : 1;

            const acceleration = force.clone().divideScalar(this.mass !== 0 ? this.mass : 1); // F = m*a  =>  a = F/m
            const angularAcceleration = torque.clone().divideScalar(momentOfInertia); // ­tau = I*alpha  =>  alpha = tau/I

            this.velocity.addScaledVector(acceleration, deltaTime);
            this.angularVelocity.addScaledVector(angularAcceleration, deltaTime);
        });

        super.updatePhysic(utils, deltaTime);
    }

    protected getCollisions(utils: PhysicUtils, deltaTime: Seconds) {
        const collidingObjects: CollisionInfo[] = utils.getCollisionsOf(this);
        return collidingObjects.map((collision: CollisionInfo) => {
            return <[THREE.Vector3, THREE.Vector3]>[
                this.getVector3From(collision.applicationPoint),
                this.getVector3From(collision.force)
            ];
        });
    }

    private getVector3From(vector: THREE.Vector2): THREE.Vector3 {
        return new THREE.Vector3(vector.x, 0, vector.y);
    }
}
