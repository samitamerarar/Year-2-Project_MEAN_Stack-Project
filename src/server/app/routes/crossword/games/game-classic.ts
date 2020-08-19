import { Game } from './game';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { GameDataClassic } from './game-data-classic';

export class GameClassic extends Game {

    constructor(configs: CrosswordGameConfigs) {
        super(configs, new GameDataClassic(configs.difficulty));
    }

}
