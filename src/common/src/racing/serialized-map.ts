import { Point } from '../math/point';
import { SerializedPothole } from './serialized-pothole';
import { SerializedPuddle } from './serialized-puddle';
import { SerializedSpeedBoost } from './serialized-speed-boost';
import { SerializedBestTime } from './serialized-best-time';

export class SerializedMap {

    public name: string;
    public description: string;
    public type: string;
    public sumRatings: number;
    public numberOfRatings: number;
    public numberOfPlays: number;

    public points: Point[];
    public potholes: SerializedPothole[];
    public puddles: SerializedPuddle[];
    public speedBoosts: SerializedSpeedBoost[];
    public bestTimes: SerializedBestTime[];


    public constructor(name: string = '',
                       description: string = '',
                       type: string = 'Amateur',
                       sumRatings: number = 0,
                       numberOfRatings: number = 0,
                       numberOfPlays: number = 0,
                       points: Point[] = [],
                       potholes: SerializedPothole[] = [],
                       puddles: SerializedPuddle[] = [],
                       speedBoosts: SerializedSpeedBoost[] = [],
                       bestTimes: SerializedBestTime[] = []) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.sumRatings = sumRatings;
        this.numberOfRatings = numberOfRatings;
        this.numberOfPlays = numberOfPlays;
        this.points = points;
        this.potholes = potholes;
        this.puddles = puddles;
        this.speedBoosts = speedBoosts;
        this.bestTimes = bestTimes;
    }

}
