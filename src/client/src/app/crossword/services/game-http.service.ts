import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserDisplayableGameData } from '../config-menu/available-games/user-displayable-game-data';
import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameService } from '../game.service';

@Injectable()
export class GameHttpService {

    private static readonly BASE_URL = 'http://localhost:3000/crossword/games';

    constructor(private http: HttpClient,
                private gameService: GameService) { }

    public getGames(filter: GameFilter): Promise<UserDisplayableGameData[]> {
        const url = GameHttpService.BASE_URL +
                    '/mode/' + filter.mode +
                    '/players/' + filter.playerNumber;
        const promise =
            this.http.get<CrosswordGameConfigs[]>(url).toPromise()
                .then((configs) => {
                    const twoPlayerGames = configs.filter((config) => config.playerNumber === 2);
                    return twoPlayerGames.map(
                        (config) => new UserDisplayableGameData(
                            config.playerName,
                            config.gameId,
                            config.gameMode,
                            config.difficulty
                        )
                    );
                });
        return promise;
    }

    public createGame(gameConfig: CrosswordGameConfigs): Promise<GameId> {
        const url = GameHttpService.BASE_URL;
        const promise =
            this.http.post<GameId>(url, gameConfig).toPromise()
            .then((id) => id !== null ? id : 0);
        return promise;
    }

    public getWords(): Promise<GridWord[]> {
        const url = GameHttpService.BASE_URL + '/' + this.gameService.data.id + '/words';
        const promise = this.http.get<GridWord[]>(url).toPromise();
        return promise;
    }

}
