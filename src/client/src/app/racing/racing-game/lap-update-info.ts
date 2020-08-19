import { Car } from './models/car/car';

export interface LapUpdateInfo {
    car: Car;
    lap: number;
    isUser: boolean;
}
