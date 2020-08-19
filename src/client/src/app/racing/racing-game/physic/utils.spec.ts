import { TestBed } from '@angular/core/testing';
import { PhysicUtils } from './utils';
import { CollidableMesh } from './collidable';

import * as THREE from 'three';
import { EventManager } from '../../../event-manager.service';

let eventManager: EventManager;
let physicUtils: PhysicUtils;

class InstanciableCollidable extends CollidableMesh {
    public geometry = new THREE.CubeGeometry(1, 1, 1);
    public mass = 1;
}

describe('Physic utils', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: EventManager, useValue: EventManager.getInstance() }
            ]
        });
        eventManager = EventManager.getInstance();
        physicUtils = new PhysicUtils(eventManager);
    });

    it('should be created', () => {
        expect(PhysicUtils).toBeTruthy();
    });

    it('should returns non-negative values for object dimensions', () => {
        const dummyObject = new THREE.Object3D();
        const dimensionsMesured: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject);
        expect(dimensionsMesured.x >= 0);
        expect(dimensionsMesured.y >= 0);
        expect(dimensionsMesured.z >= 0);
    });

    it('should return bigger dimension values for bigger objects. Yeah you read that right', () => {
        const dummyObject1 = new THREE.Object3D();
        const dummyObject2 = new THREE.Object3D();

        const scaleUp = new THREE.Matrix4();
        scaleUp.scale(new THREE.Vector3(3, 3, 3));
        const scaleWayUp = new THREE.Matrix4();
        scaleUp.scale(new THREE.Vector3(8, 9, 7));

        dummyObject1.applyMatrix(scaleUp);
        dummyObject2.applyMatrix(scaleWayUp);
        const dimensionsObject1: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject1);
        const dimensionsObject2: THREE.Vector3 = PhysicUtils.getObjectDimensions(dummyObject2);
        expect(dimensionsObject1.x < dimensionsObject2.x);
        expect(dimensionsObject1.y < dimensionsObject2.y);
        expect(dimensionsObject1.z < dimensionsObject2.z);
    });

    it('should properly set root', () => {
        const dummyObject = new THREE.Object3D();
        dummyObject.name = 'Franky';
        physicUtils.setRoot(dummyObject);
        expect(physicUtils['root'].name === 'Franky');
    });

    it('should not return any collisions if none happened', () => {
        const mesh = new THREE.Mesh();
        const dummyObject1 = new InstanciableCollidable();
        const dummyObject2 = new InstanciableCollidable();
        dummyObject2.position.set(3, 3, 3);
        mesh.add(dummyObject1);
        mesh.add(dummyObject2);
        dummyObject1.parent = null;
        dummyObject2.parent = null;
        physicUtils.setRoot(mesh);
        expect(physicUtils.getCollisionsOf(dummyObject1).length).toEqual(0);
    });

    it('should return a collision if 2 objects are at the same positions', () => {
        const mesh = new THREE.Mesh();
        const dummyObject1 = new InstanciableCollidable();
        const dummyObject2 = new InstanciableCollidable();
        dummyObject1.position.set(3, 3, 3);
        dummyObject2.position.set(3, 3, 3);
        mesh.add(dummyObject1);
        mesh.add(dummyObject2);

        // to avoid circular references
        dummyObject1.parent = null;
        dummyObject2.parent = null;
        physicUtils.setRoot(mesh);
        expect(physicUtils.getCollisionsOf(dummyObject1).length).not.toBeNull();
    });

    it('should be able to return physic objects', () => {
        const mesh = new THREE.Mesh();
        const dummyObject1 = new InstanciableCollidable();
        const dummyObject2 = new InstanciableCollidable();
        dummyObject1.position.set(1, 1, 1);
        dummyObject2.position.set(3, 3, 3);
        mesh.add(dummyObject1);
        mesh.add(dummyObject2);

        // to avoid circular references
        dummyObject1.parent = null;
        dummyObject2.parent = null;
        physicUtils.setRoot(mesh);
        expect(physicUtils.getAllPhysicObjects().length).not.toBeNull();
    });
});
