import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Car } from './models/car/car';
import { SoundService } from '../services/sound-service';
import { Loadable } from '../../loadable';
import { RenderableMap } from './racing-game-map/renderable-map';
import { Progression } from './racing-types';
import { EventManager } from '../../event-manager.service';
import { CarController } from './physic/ai/car-controller';
import { UserCarController } from './physic/ai/user-car-controller';
import { AiCarController } from './physic/ai/ai-car-controller';
import { UIInputs } from '../services/ui-input.service';
import { CarsProgressionService } from './cars-progression.service';
import { CAR_COMPLETED_RACE, GAME_COMPLETED_EVENT } from '../constants';

@Injectable()
export class CarsService implements Loadable {

    public static readonly CAR_COUNT: number = 4;

    private static readonly CAR_COLORS: string[] = [
        'green',
        'yellow',
        'blue',
        'red'];

    public readonly waitToLoad: Promise<void>;

    private readonly carsProgression: Map<Car, Progression> = new Map();
    private readonly controllers: CarController[] = [];

    private userControllerIndex: number = Math.floor(Math.random() * CarsService.CAR_COUNT);

    public get cars(): Car[] {
        return this.controllers.map((controller) => controller.car);
    }

    public get controller(): CarController[] {
        return this.controllers;
    }

    public constructor(
        eventManager: EventManager,
        private carsProgressionService: CarsProgressionService) {
        for (let index = 0; index < CarsService.CAR_COUNT; ++index) {
            this.controllers.push(index === this.userControllerIndex ?
                new UserCarController(new Car(new THREE.Color(CarsService.CAR_COLORS[index]))) :
                new AiCarController(new Car(new THREE.Color(CarsService.CAR_COLORS[index]))));
            this.controllers[this.controllers.length - 1].car.name = CarsService.CAR_COLORS[index];
            this.carsProgression.set(this.controllers[index].car, 0);
        }

        this.waitToLoad = Promise.all(
            this.controllers.map((controller) => controller.car.waitToLoad)
        ).then(() => { });

        eventManager.registerClass(this);
    }

    public initialize(soundService: SoundService, userInput: UIInputs, map: RenderableMap) {
        this.cars.forEach(soundService.registerEmitter, soundService);
        (this.controllers[this.userControllerIndex] as UserCarController).setUIInput(userInput);
        this.controllers.forEach(controller => {
            controller.setupContoller(map, this.cars);
            if (controller instanceof AiCarController) {
                controller.setMode(map.mapMode);
            }
        });
        this.carsProgressionService.initialize(this.controllers, map.mapLines);
    }

    public finalize() {
        this.controllers.map((controller) => {
            if (controller instanceof UserCarController) {
                controller.removeUIInput();
            }
            controller.stop();
            return controller.car;
        }).forEach(car => {
            car.stopSounds();
        });
    }

    public get playerCoordinates(): THREE.Vector {
        return this.getPlayerCar().position;
    }

    public getCarsProgression(): Map<Car, Progression> {
        return this.carsProgression;
    }

    public getMapLength(): number {
        return 0; // MOCK
    }

    public getPlayerCar(): Car {
        return this.controllers[this.userControllerIndex].car;
    }

    public addToMap(map: RenderableMap): void {
        map.addCars(...this.cars);
    }

    public removeFromMap(map: RenderableMap): void {
        this.cars.forEach(map.remove, map);
    }

    public startControllers(): void {
        this.controllers.forEach(controller => controller.start());
    }

    @EventManager.Listener(CAR_COMPLETED_RACE)
    // tslint:disable-next-line:no-unused-variable
    private ghostModeAfterFinalLineCross(event: EventManager.Event<Car>): void {
        let carIndex;
        for (let i = 0; i < this.controller.length; i++) {
            carIndex = this.controller[i].car === event.data ? i : carIndex;
        }
        this.controllers[carIndex].car.makeCarTransparent(true);
        this.controller[carIndex].stop();
    }

    @EventManager.Listener(GAME_COMPLETED_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private ghostModeAfterGameEnd(event: EventManager.Event<void>): void {
        this.controllers.forEach((controller) => {
            controller.car.makeCarTransparent(true);
            controller.stop();
        });
    }

}
