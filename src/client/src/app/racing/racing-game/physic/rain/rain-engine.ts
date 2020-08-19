import * as THREE from 'three';
import { Seconds, Meters } from '../../../../types';
import { Object3D, Vector3 } from 'three';
import { Track } from '../../../track';
import { Injectable } from '@angular/core';

export enum RainState {
    STOPPED,
    RAINING
}

@Injectable()
export class RainEngine {
    public static readonly RAIN_VELOCITY = new Vector3(0, -5, -1); // m/s
    public static readonly RAIN_INITIAL_HEIGHT: Meters = 15;

    public root: Object3D;

    private particleCountInternal = 300;
    private particles: THREE.Sprite[] = [];
    private state = RainState.RAINING;

    public get particleCount(): number {
        return this.particleCountInternal;
    }

    public set particleCount(newCount: number) {
        this.changeParticleCount(newCount);
    }

    public constructor() {
        this.generateSprites();
    }

    public initialize(root: Object3D): void {
        this.root = root;
        this.particles.forEach((particle) => root.add(particle));
    }

    public finalize(): void {
        this.particles.forEach((particle) => this.root.remove(particle));
        delete this.root;
    }

    public update(deltaTime: Seconds): void {
        if (this.state === RainState.RAINING) {
            this.particles.forEach((particle) => {
                particle.position.addScaledVector(RainEngine.RAIN_VELOCITY, deltaTime);
                particle.position.addScaledVector(this.generateVelocity().multiplyScalar(5), deltaTime);
                if (particle.position.y <= 0) {
                    particle.position.copy(this.generatePosition());
                }
            });
        }
        else {
            this.particles.forEach((particle) => {
                particle.position.set(0, -1, 0);
            });
        }
    }

    private generatePosition(): Vector3 {
        return new Vector3(
            Math.random() * Track.WIDTH_MAX,
            Math.random() * RainEngine.RAIN_INITIAL_HEIGHT,
            Math.random() * Track.HEIGHT_MAX);
    }

    private generateVelocity(): Vector3 {
        return new Vector3(0.5 - Math.random(), 0, 0.5 - Math.random());
    }

    private generateSprites(): void {
        const particle = new THREE.Sprite(new THREE.SpriteMaterial({
            color: 0xFFFFFF, opacity: 1
        }));
        particle.scale.set(0.1, 0.1, 0.1);
        for (let i = 0; i < this.particleCountInternal; ++i) {
            this.particles.push(particle.clone());
        }
    }

    private changeParticleCount(newCount: number): void {
        const deltaParticleCount = this.particleCountInternal - newCount;
        if (deltaParticleCount > 0) {
            for (let i = newCount; i < this.particleCountInternal; ++i) {
                this.root.remove(this.particles[i]);
            }
            this.particles.splice(Math.max(newCount, 1));
        }
        else if (deltaParticleCount < 0) {
            for (let i = 0; i < -deltaParticleCount; ++i) {
                const particle = this.particles[0].clone();
                this.particles.push(particle);
                this.root.add(particle);
            }
        }
        this.particleCountInternal = this.particles.length;
    }
}
