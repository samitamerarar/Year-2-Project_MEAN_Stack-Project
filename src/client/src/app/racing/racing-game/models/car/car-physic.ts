import * as THREE from 'three';

import { DynamicCollidableMesh } from '../../physic/dynamic-collidable';
import { Seconds } from '../../../../types';
import { UP_DIRECTION } from '../../physic/engine';
import { EventManager } from '../../../../event-manager.service';

// The front direction when the rotation is 0.
const INITIAL_FRONT = new THREE.Vector3(0, 0, -1);

const POWER_STEERING_FACTOR = 0.8;

/**
 * @abstract @class CarPhysic
 * @extends DynamicCollidableMesh
 *
 * @description An representation of a car in terme of physic interactions.
 */
export abstract class CarPhysic extends DynamicCollidableMesh {
    public static readonly DEFAULT_ACCELERATION = 20; // m/s^2
    public static readonly DEFAULT_TARGET_SPEED = 30; // m/s

    public static readonly DEFAULT_ANGULAR_ACCELERATION = 2 * Math.PI; // rad/s^2
    public static readonly DEFAULT_TARGET_ANGULAR_SPEED = 3 * Math.PI / 4; // rad/s

    protected acceleration = CarPhysic.DEFAULT_ACCELERATION;
    public targetSpeed = 0; // m/s

    protected angularAcceleration = CarPhysic.DEFAULT_ANGULAR_ACCELERATION;
    public targetAngularSpeed = 0; // rad/s

    public get front(): THREE.Vector3 {
        return INITIAL_FRONT.clone().applyEuler(this.rotation);
    }

    public get speed(): number {
        return this.velocity.dot(this.front);
    }

    public set speed(value: number) {
        this.velocity.copy(this.front).multiplyScalar(value);
    }

    public get angularSpeed(): number {
        return this.angularVelocity.dot(UP_DIRECTION);
    }

    public set angularSpeed(value: number) {
        this.angularVelocity.copy(UP_DIRECTION).multiplyScalar(value);
    }

    public constructor() {
        super();
        EventManager.getInstance().registerClass(this, CarPhysic.prototype);
    }

    public updateVelocity(deltaTime: Seconds): void {
        this.updateVelocityDirection();
        this.updateSpeed(deltaTime);

        super.updateVelocity(deltaTime);
    }

    public updateAngularVelocity(deltaTime: Seconds): void {
        this.updateAngularSpeed(deltaTime);
        super.updateAngularVelocity(deltaTime);
    }

    public updateRotation(deltaTime: Seconds): void {
        let speed = this.velocity.length();
        speed = speed === 0 ? DynamicCollidableMesh.MIN_SPEED : speed;
        const powerSteering = POWER_STEERING_FACTOR / speed;
        const rotationRestriction = this.velocity.dot(this.front) * powerSteering;

        this.rotation.y += rotationRestriction * this.angularVelocity.y * deltaTime + 2 * Math.PI;
        this.rotation.y %= 2 * Math.PI;
    }

    private updateVelocityDirection(): void {
        this.speed = this.speed;
    }

    private updateSpeed(deltaTime: Seconds) {
        const speedDifference = (this.targetSpeed - this.speed);
        let accelerationFactor = speedDifference / Math.abs(this.targetSpeed);
        accelerationFactor = this.targetSpeed === 0 ? Math.sign(speedDifference) : accelerationFactor;
        const acceleration = accelerationFactor * this.acceleration;

        this.speed += acceleration * deltaTime;
    }

    private updateAngularSpeed(deltaTime: Seconds): void {
        const speedDifference = (this.targetAngularSpeed - this.angularSpeed);
        let angularAccelerationFactor = speedDifference / Math.abs(this.targetAngularSpeed);
        angularAccelerationFactor = this.targetAngularSpeed === 0 ? Math.sign(speedDifference) : angularAccelerationFactor;
        const angularAcceleration = angularAccelerationFactor * this.angularAcceleration;

        this.angularSpeed += angularAcceleration * deltaTime;
    }
}
