import { Injectable } from '@angular/core';
import { EventManager } from '../../event-manager.service';
import { Seconds } from '../../types';
import { CarController } from './physic/ai/car-controller';
import { Car } from './models/car/car';
import { Line } from '../../../../../common/src/math/line';
import { LapProgression } from './racing-types';
import { Projection } from '../util/projection';
import { MapPositionAlgorithms } from '../util/map-position-algorithms';
import { Point } from '../../../../../common/src/math/point';
import { UserCarController } from './physic/ai/user-car-controller';
import { AFTER_PHYSIC_UPDATE_EVENT } from '../constants';
import { LapUpdateInfo } from './lap-update-info';

export const CAR_LAP_UPDATE_EVENT = 'carlapupdate';

enum ProgressionState {
    FIRST_QUARTER = 0,
    SECOND_QUARTER,
    THIRD_QUARTER,
    FOURTH_QUARTER
}

@Injectable()
/**
 * Keeps Track of all cars progression relative to the map
 * (On a linear scale)
 */
export class CarsProgressionService {

    public carsLapProgression: Map<Car, number> = new Map();
    public carsLapNumber: Map<Car, number> = new Map();

    public carPositionTrackingState: Map<Car, boolean> = new Map();

    public get userLapsCount(): number {
        return this.carsLapNumber.get(this.userCar);
    }

    public get userLapProgressionInPercent(): number {
        return Math.floor((this.carsLapProgression.get(this.userCar) % 1) * 100);
    }

    private carProgressionState: Map<Car, ProgressionState> = new Map();

    private controllers: CarController[] = [];
    private userCar: Car;
    private mapLines: Line[];
    private mapLength: number;
    private progressionUpdateCounter = 0;

    public constructor(private eventManager: EventManager) {
        eventManager.registerClass(this);
    }

    public initialize(controllers: CarController[], mapLines: Line[]): void {
        this.mapLength = mapLines.map((line) => line.length).reduce((sum, val) => sum + val);
        this.mapLines = mapLines;
        this.controllers = controllers;
        for (const controller of controllers) {
            this.carsLapProgression.set(controller.car, 0);
            this.carsLapNumber.set(controller.car, 1);
            this.carProgressionState.set(controller.car, ProgressionState.FIRST_QUARTER);
            if (controller instanceof UserCarController) {
                this.userCar = controller.car;
            }
            this.carPositionTrackingState.set(controller.car, true);
        }
    }

    public getCarCompletion(car: Car): number {
        return this.carsLapNumber.get(car) + this.carsLapProgression.get(car);
    }

    private get cars(): Car[] {
        return this.controllers.map((controller) => controller.car);
    }

    public computeUserRank(): number {
        const sortedCars: Car[] = this.cars.sort(this.compareCarPosition.bind(this));
        return sortedCars.indexOf(this.userCar) + 1;
    }

    private compareCarPosition(carA: Car, carB: Car): number {
        const completionA: number = this.getCarCompletion(carA);
        const completionB: number = this.getCarCompletion(carB);
        return (completionB - completionA);
    }

    @EventManager.Listener(AFTER_PHYSIC_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateCarsProgression(event: EventManager.Event<{ deltaTime: Seconds }>): void {
        if (++this.progressionUpdateCounter === 30) {
            this.progressionUpdateCounter = 0;
            for (const controller of this.controllers) {
                if (!this.carPositionTrackingState.get(controller.car)) {
                    continue;
                }
                const newLapProgression: number = this.computeLapProgression(controller.car);
                if (newLapProgression > 0.00 && newLapProgression < 0.25 &&
                    this.carProgressionState.get(controller.car) === ProgressionState.FOURTH_QUARTER) {
                    this.carProgressionState.set(controller.car, ProgressionState.FIRST_QUARTER);
                    this.carsLapNumber.set(controller.car, this.carsLapNumber.get(controller.car) + 1);
                    const info: LapUpdateInfo = {
                        car: controller.car,
                        lap: this.carsLapNumber.get(controller.car),
                        isUser: (controller instanceof UserCarController)
                    };
                    this.eventManager.fireEvent(CAR_LAP_UPDATE_EVENT, {
                        name: CAR_LAP_UPDATE_EVENT,
                        data: info
                    });
                } else if (newLapProgression > 0.25 && newLapProgression < 0.50 &&
                    this.carProgressionState.get(controller.car) === ProgressionState.FIRST_QUARTER) {
                    this.carProgressionState.set(controller.car, ProgressionState.SECOND_QUARTER);
                } else if (newLapProgression > 0.50 && newLapProgression < 0.75 &&
                    this.carProgressionState.get(controller.car) === ProgressionState.SECOND_QUARTER) {
                    this.carProgressionState.set(controller.car, ProgressionState.THIRD_QUARTER);
                } else if (newLapProgression > 0.75 && newLapProgression < 1.00 &&
                    this.carProgressionState.get(controller.car) === ProgressionState.THIRD_QUARTER) {
                    this.carProgressionState.set(controller.car, ProgressionState.FOURTH_QUARTER);
                }
                this.carsLapProgression.set(controller.car, this.computeLapProgression(controller.car));
            }
        }
    }

    private computeLapProgression(car: Car): LapProgression {
        let progression: LapProgression = 0;
        const projection: Projection = MapPositionAlgorithms.getClosestProjection(
            new Point(car.position.x, car.position.z), this.mapLines);

        const currentSegment: number = this.mapLines.indexOf(projection.segment);

        // Add completed segments
        for (let i = 0; i < currentSegment; ++i) {
            progression += this.mapLines[i].length;
        }

        // Add fraction of current segment
        progression += this.mapLines[currentSegment].length * projection.interpolation;

        // Divide by map length to get a [0,1) value
        progression /= this.mapLength;

        // To avoid starting out at ~99% if starting on back row
        if (this.carProgressionState.get(car) === ProgressionState.FIRST_QUARTER &&
            this.carsLapNumber.get(car) === 1 &&
            progression > 0.80) {
            progression = 0;
        }
        return progression;
    }
}
