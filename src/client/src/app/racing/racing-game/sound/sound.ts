export enum Sound {
    NONE = -1,
    TETRIS = 0,
    CAR_ENGINE,
    CAR_CRASH,
    START_SOUND,
    END_OF_RACE,
    POTHOLE,
    PUDDLE,
    BOOST_START,
    BOOST_END,
    CAR_HITTING_WALL,
    AIR_HORN,
    COUNT // The number of sounds
}

export type SoundType = 'event' | 'constant';
