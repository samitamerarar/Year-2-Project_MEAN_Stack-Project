import { GameMode } from './crossword-enums';
import { PlayerNumber } from '../communication/game-configs';

export class GameFilter {

    constructor(public mode: GameMode,
                public playerNumber: PlayerNumber) {}

}
