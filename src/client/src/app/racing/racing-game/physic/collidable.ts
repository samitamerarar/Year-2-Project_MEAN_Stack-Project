import * as THREE from 'three';
import { IPhysicElement, PhysicMesh } from './object';
import { Kilograms } from '../../../types';
import { hasAttributes, hasNativeAttributes } from '../../../../../../common/src/index';

export interface Collidable extends IPhysicElement {
    geometry: THREE.Geometry | THREE.BufferGeometry;
    mass: Kilograms;
}

export abstract class CollidableMesh extends PhysicMesh implements Collidable {
    public geometry: THREE.Geometry | THREE.BufferGeometry;
    public mass: Kilograms = Infinity; // Immovable by default
}

export function isCollidable(object: IPhysicElement): object is Collidable {
    return object != null && hasNativeAttributes(object, [
        { name: 'mass', type: 'number' }
    ]) && (
        hasAttributes(object, [{ name: 'geometry', parent: THREE.Geometry }]) ||
        hasAttributes(object, [{ name: 'geometry', parent: THREE.BufferGeometry }])
    );
}

export interface CollisionInfo {
    /**
     * The object on which the effects of the collision are calculated.
     */
    target: Collidable;
    /**
     * The object colliding with the target.
     */
    source: Collidable;

    /**
     * The collision point relative to the target.
     */
    applicationPoint: THREE.Vector2;

    /**
     * The normal force applied at the collision point.
     */
    force: THREE.Vector2;
}
