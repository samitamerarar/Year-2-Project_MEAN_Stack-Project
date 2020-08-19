import { Difficulty, GameMode } from '../crossword/crossword-enums';

export type PlayerNumber = number;
export type GameId = number;

export interface CrosswordGameConfigs {
    gameMode: GameMode;
    playerNumber: PlayerNumber;
    difficulty: Difficulty;
    playerName?: string;
    gameId?: GameId;
}
