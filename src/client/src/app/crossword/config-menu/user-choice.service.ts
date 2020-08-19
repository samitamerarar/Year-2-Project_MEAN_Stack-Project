import { Injectable } from '@angular/core';

import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GameId, CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';

export enum CreateOrJoin {
    create,
    join
}

/**
 * @class UserChoiceService
 * @description Has the responsibility of containing the choices of the user.
 */
@Injectable()
export class UserChoiceService {

    public gameMode: GameMode;
    public playerNumber: PlayerNumber;
    public createOrJoin: CreateOrJoin;
    public difficulty: Difficulty;
    public chosenGame: GameId;
    public playerName = '';

    constructor() { }

    public toGameConfiguration(): CrosswordGameConfigs {
        return {
            gameMode: this.gameMode,
            difficulty: this.difficulty,
            playerNumber: this.playerNumber
        };
    }

    public reinitialize(): void {
        this.gameMode = undefined;
        this.playerNumber = undefined;
        this.createOrJoin = undefined;
        this.difficulty = undefined;
        this.chosenGame = undefined;
        this.playerName = '';
    }

}
