import { Meters } from '../../../../types';

export interface AiWeights {
    readonly track: number;
    readonly obstacles: number;
    readonly opponents: number;
}

export class AiMode {
    public static readonly AMATEUR = new AiMode(
        { track: 1, obstacles: 1, opponents: 0 }, // weights
        2,                                        // track factor
        -0.3,                                     // obstacles factor
        0,                                        // opponents factor
        5,                                        // distance to target
        5,                                        // distance for slowing
        2,                                        // distance to avoid obstacles
        0                                         // distance to avoid opponents
    );
    public static readonly PROFESSIONAL = new AiMode(
        { track: 2, obstacles: 1, opponents: 1 }, // weights
        7,                                        // track factor
        1,                                        // obstacles factor
        5,                                        // opponents factor
        20,                                       // distance to target
        30,                                       // distance for slowing
        10,                                       // distance to avoid obstacles
        1.15                                      // distance to avoid opponents
    );

    private constructor(
        public readonly angularWeights: AiWeights,
        public readonly angularSpeedForTrackFactor: number,
        public readonly angularSpeedForObstaclesFactor: number,
        public readonly angularSpeedForOpponentsFactor: number,
        public readonly distanceOfTargetFromCar: Meters,
        public readonly distanceToSlow: Meters,
        public readonly distanceToStartAvoidingObstacles: Meters,
        public readonly distanceToStartAvoidingOpponents: Meters) { }
}
