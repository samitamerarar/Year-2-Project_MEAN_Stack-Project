import { Car } from '../../models/car/car';
import { Line } from '../../../../../../../common/src/math';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { Obstacle } from '../../models/obstacles/obstacle';

export enum CarControllerState {
    DISABLED,
    ENABLED
}

export abstract class CarController {
    protected state = CarControllerState.DISABLED;
    protected readonly trackLines: Line[] = [];
    protected readonly obstacles: Obstacle[] = [];
    protected readonly opponentsCars: Car[] = [];

    public constructor(public readonly car: Car) {
        car.targetSpeed = 0;
        car.targetAngularSpeed = 0;
        car.speed = 0;
        car.angularSpeed = 0;
    }

    public start(): void {
        this.state = CarControllerState.ENABLED;
        this.car.setup();
    }

    public stop(): void {
        if (this.state === CarControllerState.ENABLED) {
            this.car.targetSpeed = 0;
            this.car.targetAngularSpeed = 0;
        }
        this.car.removeCarMass();
        this.state = CarControllerState.DISABLED;
    }

    public isControllerStateEnabled(): boolean {
        return this.state === CarControllerState.ENABLED ? true : false;
    }

    public setupContoller(map: RenderableMap, cars: Car[]): void {
        // Clear arrays
        this.trackLines.splice(0);
        this.obstacles.splice(0);
        this.opponentsCars.splice(0);

        this.trackLines.push(...map.mapLines);
        this.obstacles.push(...map.mapObstacles);
        this.opponentsCars.push(...cars.filter((car) => car !== this.car));
    }

    public setTrackLines(lines: Line[]): void {
        this.trackLines.splice(0); // clear array
        this.trackLines.push(...lines);
    }
}
