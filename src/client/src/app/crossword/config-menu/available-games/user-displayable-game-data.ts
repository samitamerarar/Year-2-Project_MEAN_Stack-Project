import { GameId } from '../../../../../../common/src/communication/game-configs';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

/**
 * @class UserDisplayableGameData
 * @description Contains the data of a game as text so that it can be
 * displayed to the user.
 */
export class UserDisplayableGameData {

    private playerNameInternal: string;
    private idInternal: GameId;
    private modeInternal: GameMode;
    private difficultyInternal: Difficulty;

    constructor(playerName: string, gameId: GameId, gameMode: GameMode, difficulty: Difficulty) {
        this.playerNameInternal = playerName;
        this.idInternal = gameId;
        this.modeInternal = gameMode;
        this.difficultyInternal = difficulty;
    }

    public get playerName(): string {
        return this.playerNameInternal;
    }

    public get id(): GameId {
        return this.idInternal;
    }

    public get mode(): GameMode {
        return this.modeInternal;
    }

    public modeAsString(): string {
        switch (this.modeInternal) {
            case GameMode.Classic: return 'Classic';
            case GameMode.Dynamic: return 'Dynamic';
            default: throw new Error(`Game mode ${this.modeInternal} invalid`);
        }
    }

    public get difficulty(): Difficulty {
        return this.difficultyInternal;
    }

    public difficultyAsString(): string {
        switch (this.difficultyInternal) {
            case Difficulty.easy: return 'Easy';
            case Difficulty.normal: return 'Normal';
            case Difficulty.hard: return 'Hard';
            default: throw new Error(`Difficulty ${this.difficultyInternal} invalid`);
        }
    }

}
