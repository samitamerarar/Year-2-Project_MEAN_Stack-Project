import * as THREE from 'three';
import { PhysicUtils } from './engine';
import { Seconds } from '../../../types';
import { hasFunctions, hasAttributes } from '../../../../../../common/src/index';

export interface IPhysicElement extends THREE.Object3D {
    position: THREE.Vector3;
    rotation: THREE.Euler;

    updatePhysic(engine: PhysicUtils, deltaTime: Seconds): void;
}

export abstract class PhysicMesh extends THREE.Mesh implements IPhysicElement {
    public castShadow = true;
    public receiveShadow = true;
    public updatePhysic(engine: PhysicUtils, deltaTime: Seconds) { }
}

export function isPhysicElement(object: THREE.Object3D): object is IPhysicElement {
    return object != null &&
        hasFunctions(object, [{ name: 'updatePhysic', parameterCount: 2 }]) &&
        hasAttributes(object, [
            { name: 'position', parent: THREE.Vector3 },
            { name: 'rotation', parent: THREE.Euler }
        ]);
}
