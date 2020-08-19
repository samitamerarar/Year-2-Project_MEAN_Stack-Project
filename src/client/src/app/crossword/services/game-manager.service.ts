import { Injectable } from '@angular/core';

import { UserChoiceService, CreateOrJoin } from '../config-menu/user-choice.service';
import { GameService, GameState } from '../game.service';
import { GameHttpService } from './game-http.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { GridService } from '../board/grid.service';
import { MenuAutomatonService } from '../config-menu/menu-automaton.service';

/**
 * @class GameManagerService
 * @description Has the responsibility of managing the key moments of a game's life :
 * 1) Creation
 * 2) Completion
 * 3) Reset and deletion
 * This service was basically created to solve circular dependency problems between
 * GameService and GameHttpService. Yes, this probably denotes a slight architectural problem.
 */
@Injectable()
export class GameManagerService {

    constructor(private userChoiceService: UserChoiceService,
                private gameService: GameService,
                private gameHttpService: GameHttpService,
                private definitionsService: DefinitionsService,
                private gridService: GridService,
                private menuAutomatonService: MenuAutomatonService) {
        this.gameService.state.subscribe((state) => {
            switch (state) {
                case GameState.waiting: {
                    this.startGame();
                    break;
                }
                case GameState.finished: {
                    this.finishGame(
                        this.gridService.getPlayerWordsFoundCount(),
                        this.gridService.getOpponentWordsFoundCount()
                    );
                    break;
                }
            }
        });
    }

    public finalize(): void {
        this.menuAutomatonService.goBackToInitialState();
        this.definitionsService.clearDefinitions();
        this.gameService.finalize();
        this.gridService.reinitialize();
    }

    private startGame(): void {
        const isJoiningGame = this.userChoiceService.createOrJoin === CreateOrJoin.join;
        if (isJoiningGame) {
            this.gameService.joinGame(
                this.userChoiceService.chosenGame,
                this.userChoiceService.playerName
            );
        }
        else {
            this.gameHttpService.createGame(this.userChoiceService.toGameConfiguration())
                .then((gameId) => {
                    this.gameService.joinGame(
                        gameId,
                        this.userChoiceService.playerName
                    );
                });
        }
    }

    private finishGame(wordsFound: number, opponentWordsFound: number): void {
        let message: string;
        if (wordsFound > opponentWordsFound) {
            message = 'Congratulations ; you win!';
        }
        else if (wordsFound < opponentWordsFound) {
            message = 'Congratulations ; you (almost) win!';
        }
        else {
            message = 'Congratulations ; you equaled your opponent!';
        }
        if (this.gameService.data.maxNumberOfPlayers === 1) {
            message += '\nStart over with the same settings?';
            if (confirm(message)) {
                this.resetGame();
                this.startGame();
            }
            else {
                this.resetUserConfiguration();
            }
        }
        else {
            this.resetUserConfiguration();
            alert(message);
        }
    }

    private resetUserConfiguration(): void {
        this.gameService.reinitialize();
        this.userChoiceService.reinitialize();
        this.menuAutomatonService.goBackToInitialState();
    }

    private resetGame(): void {
        this.definitionsService.clearDefinitions();
        this.gameService.finalize();
        this.gridService.reinitialize();
    }

}
