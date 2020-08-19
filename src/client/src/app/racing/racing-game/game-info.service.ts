import { Car } from './models/car/car';
import { Seconds } from '../../types';
import { CarsService } from './cars.service';
import { CarsProgressionService, CAR_LAP_UPDATE_EVENT } from './cars-progression.service';
import { EventManager } from '../../event-manager.service';
import { Injectable } from '@angular/core';
import { LapUpdateInfo } from './lap-update-info';

@Injectable()
export class GameInfoService {

    public maxLap = 3;

    private startTimeInternal: Seconds;

    public lapTimesTable: Map<Car, Seconds[]> = new Map(); // reduce pour total

    public get userLapCompletionInPercent(): number {
        return this.carsProgressionService.userLapProgressionInPercent;
    }

    public get userLapNumber(): number {
        return this.carsProgressionService.userLapsCount;
    }

    public get userLapTimes(): Seconds[] {
        return this.lapTimesTable.get(this.carsService.getPlayerCar());
    }

    public get startTime(): Seconds {
        return this.startTimeInternal;
    }

    public get totalTime(): Seconds {
        return Date.now() / 1000 - this.startTimeInternal;
    }

    public get controlledCar(): Car {
        return this.carsService.getPlayerCar();
    }

    public get currentRank(): number {
        return this.carsProgressionService.computeUserRank();
    }

    constructor(
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService,
        eventManager: EventManager) {
        this.carsService.cars.forEach((car) => {
            this.lapTimesTable.set(car, [0]);
        });
        eventManager.registerClass(this, GameInfoService.prototype);
    }

    public startTimer(delay: Seconds = 0): void {
        this.startTimeInternal = Date.now() / 1000 + delay;
        this.carsService.cars.forEach((car) => {
            this.lapTimesTable.set(car, [this.startTimeInternal]);
        });
    }

    @EventManager.Listener(CAR_LAP_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateRaceResultTimeTable(event: EventManager.Event<LapUpdateInfo>) {
        this.lapTimesTable.get(event.data.car).push(Date.now() / 1000);
    }
}
