import { Car } from './models/car/car';
import { Seconds } from '../../types';
import { CarsService } from './cars.service';
import { CarsProgressionService } from './cars-progression.service';

export class GameInfo {

    public maxLap = 3;

    public startTime: Seconds;
    private lapTimesInternal = new Array(this.maxLap).fill(0);

    public get userLapCompletionInPercent(): number {
        return this.carsProgressionService.userLapProgressionInPercent;
    }

    public get userLapNumber(): number {
        // return Math.floor(this.carsProgressionService.userLapCompletion);
        return this.carsProgressionService.userLapsCount;
    }

    // public getPosition(car: Car): Progression {
    //     return 0;
    // }

    public get lapTimes(): Seconds[] {
        // this.lapTimesInternal[this.lap - 1] = Date.now() / 1000 - this.startTime;
        return this.lapTimesInternal;
    }

    public get totalTime(): Seconds {
        return Date.now() / 1000 - this.startTime;
    }

    public get controlledCar(): Car {
        return this.carsService.getPlayerCar();
    }

    public get currentRank(): number {
        return this.carsProgressionService.computeUserRank();
    }

    constructor(
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService) { }

    public startTimer(delay: Seconds = 0): void {
        this.startTime = Date.now() / 1000 + delay;
    }
}
