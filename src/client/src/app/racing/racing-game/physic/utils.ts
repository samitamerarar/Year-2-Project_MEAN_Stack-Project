import * as THREE from 'three';
import { IPhysicElement, isPhysicElement } from './object';
import { Collidable, isCollidable, CollisionInfo } from './collidable';
import { Point, Line } from '../../../../../../common/src/math';
import { EventManager } from '../../../event-manager.service';
import { COLLISION_EVENT } from '../../constants';

export const UP_DIRECTION = new THREE.Vector3(0, 1, 0);

export class PhysicUtils {
    public static readonly G = new THREE.Vector3(0, -9.81, 0); // N/kg
    private static readonly SPRING_CONSTANT = 1; // N*m^2

    private root: THREE.Object3D;
    private boundingBoxes: Map<Collidable, THREE.Box3> = new Map();

    constructor(private eventManager: EventManager) { }

    public static getObjectDimensions(obj: THREE.Object3D): THREE.Vector3 {
        const rotation = obj.rotation.toArray();
        obj.rotation.set(0, 0, 0);
        const box1 = new THREE.Box3().setFromObject(obj);
        obj.rotation.fromArray(rotation);
        box1.translate(obj.position.clone().negate());
        return new THREE.Vector3().subVectors(box1.max, box1.min);
    }

    public static getChildren(object: THREE.Object3D): THREE.Object3D[] {
        const children: THREE.Object3D[] = [];
        if (object) {
            children.push(...object.children);
            for (const child of object.children) {
                children.push(...PhysicUtils.getChildren(child));
            }
        }
        return children;
    }

    public setRoot(root: THREE.Object3D): void {
        this.root = root;
    }

    public getCollisionsOf(target: Collidable): CollisionInfo[] {
        const collisions: CollisionInfo[] = [];
        const collidables: Collidable[] = this.getAllPhysicObjects()
            .filter((object) => isCollidable(object)) as Collidable[];
        let collision: CollisionInfo;
        for (const collidable of collidables) {
            collision = this.getCollision(target, collidable);
            if (collision != null) {
                collisions.push(collision);
            }
        }

        return collisions;
    }

    public getAllPhysicObjects(): IPhysicElement[] {
        const objects: THREE.Object3D[] = [this.root];
        objects.push(...PhysicUtils.getChildren(this.root));
        return objects.filter((child) => isPhysicElement(child)) as IPhysicElement[];
    }

    private getCollision(target: Collidable, source: Collidable): CollisionInfo {
        if (target === source || !this.areEnoughCloseToCollide(target, source)) {
            return null;
        }

        let collision: CollisionInfo = null;

        const targetLines: Line[] = this.getBoundingLines(target);
        const sourceLines: Line[] = this.getBoundingLines(source);

        const intersectionPoints: [Line, Line, Point][] = this.getFirstIntersection(targetLines, sourceLines);

        // We need at least 2 points of intersection to calculate the collision
        if (intersectionPoints.length < 2) {
            return null;
        }

        const intersection1: Point = intersectionPoints[0][2];
        const intersection2: Point = intersectionPoints[1][2];
        const intersectionLine: Line = new Line(intersection1, intersection2);

        const lineVector = this.getVector3FromPoint(intersectionLine.translation);
        // The point of application of the force (against the target's position)
        const applicationPoint = this.getVector2FromPoint(intersectionLine.interpolate(0.5))
            .sub(this.getVector2FromVector3(target.position));

        // Check if the points are in the rigth order (to have them point clockwise against the target)
        const order = lineVector.clone().cross(UP_DIRECTION).dot(this.getVector3FromVector2(applicationPoint));
        if (order > 0) {
            lineVector.negate();
        }

        const sourceMass = Number.isFinite(source.mass) ? source.mass : target.mass;

        // Calculation of the force implied in the collision
        const targetRadius = this.getVector2FromPoint(targetLines[0].origin)
            .sub(this.getVector2FromVector3(target.position)).length();
        const distanceToTarget = applicationPoint.length();
        const scalarAcceleration = target.mass * PhysicUtils.SPRING_CONSTANT / ((distanceToTarget / targetRadius) ** 2);
        const scalarForce = sourceMass * scalarAcceleration; // F = m*a

        const force: THREE.Vector2 = this.getVector2FromVector3(
            lineVector.normalize().cross(UP_DIRECTION).multiplyScalar(scalarForce)
        );

        collision = {
            target,
            source,
            applicationPoint,
            force
        };

        this.eventManager.fireEvent(COLLISION_EVENT, { name: COLLISION_EVENT, data: collision });
        return collision;
    }

    private areEnoughCloseToCollide(target: Collidable, source: Collidable): boolean {
        if (!this.boundingBoxes.has(target) || !this.boundingBoxes.has(source)) {
            this.getBoundingBoxFromCollidable(target);
            this.getBoundingBoxFromCollidable(source);
        }
        const targetRadius = this.boundingBoxes.get(target).getBoundingSphere().radius;
        const sourceRadius = this.boundingBoxes.get(source).getBoundingSphere().radius;
        return target.position.distanceTo(source.position) < targetRadius + sourceRadius;
    }

    private getFirstIntersection(targetLines: Line[], sourceLines: Line[]): [Line, Line, Point][] {
        const intersections: [Line, Line, Point][] = [];
        for (const targetLine of targetLines) {
            for (const sourceLine of sourceLines) {
                const intersectionPoints = targetLine.intersectsWith(sourceLine);

                if (intersectionPoints.length > 0) {
                    intersections.push(...intersectionPoints.map(point =>
                        [targetLine, sourceLine, point] as [Line, Line, Point]));
                }
            }

            if (intersections.length >= 2) { // We need 2 intersections to compute the collision.
                break;
            }
        }

        return intersections;
    }

    private getBoundingLines(collidable: Collidable): Line[] {
        const targetLines: Line[] = [];

        if (!this.boundingBoxes.has(collidable)) {
            this.getBoundingBoxFromCollidable(collidable);
        }
        const box: THREE.Box3 = this.boundingBoxes.get(collidable) || new THREE.Box3();

        // Corners in counter clockwise order (positive rotation)
        const corners: Point[] = [
            new Point(box.min.x, box.min.z),
            new Point(box.max.x, box.min.z),
            new Point(box.max.x, box.max.z),
            new Point(box.min.x, box.max.z)
        ];

        // Make positions relative to the world
        for (const corner of corners) {
            const vector = new THREE.Vector3(corner.x, 0, corner.y);
            vector.applyEuler(collidable.rotation);
            corner.x = vector.x + collidable.position.x;
            corner.y = vector.z + collidable.position.z;
        }

        for (let i = 0; i < corners.length; ++i) {
            targetLines.push(new Line(corners[i].clone(), corners[(i + 1) % corners.length].clone()));
        }

        return targetLines;
    }

    private getBoundingBoxFromCollidable(collidable: Collidable): void {
        const box = new THREE.Box3();
        collidable.geometry.computeBoundingSphere();
        if (collidable.geometry.boundingSphere.radius > 0) {
            collidable.geometry.computeBoundingBox();
            box.copy(collidable.geometry.boundingBox);
        }
        else {
            const originalRotation = collidable.rotation.clone();
            collidable.rotation.set(0, 0, 0);
            box.setFromObject(collidable);
            collidable.rotation.copy(originalRotation);
            box.translate(collidable.position.clone().negate());
        }
        this.boundingBoxes.set(collidable, box);
    }

    private getVector2FromVector3(vector: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2(vector.x, vector.z);
    }

    private getVector2FromPoint(point: Point): THREE.Vector2 {
        return new THREE.Vector2(point.x, point.y);
    }

    private getVector3FromVector2(vector: THREE.Vector2): THREE.Vector3 {
        return new THREE.Vector3(vector.x, 0, vector.y);
    }

    private getVector3FromPoint(point: Point): THREE.Vector3 {
        return new THREE.Vector3(point.x, 0, point.y);
    }
}

