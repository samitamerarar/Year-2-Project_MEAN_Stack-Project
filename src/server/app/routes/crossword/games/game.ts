import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Owner, Direction } from '../../../../../common/src/crossword/crossword-enums';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameData } from './game-data';
import { CommunicationHandler } from './communication-handler';
import { Player } from '../player';
import { Logger, warn } from '../../../../../common/src';

const logger = Logger.getLogger('Crossword Game');

export abstract class Game {

    private static idCounter = 0;

    public readonly id: GameId;

    protected started = false;

    protected readonly dataInternal: GameData;
    protected readonly players: Player[] = [];
    protected readonly maxPlayers: PlayerNumber;
    protected readonly configurationInternal: CrosswordGameConfigs;
    protected communicationHandler: CommunicationHandler;

    constructor(configs: CrosswordGameConfigs, data: GameData) {
        this.communicationHandler = new CommunicationHandler();
        this.configurationInternal = configs;
        this.dataInternal = data;

        this.id = Game.idCounter++;
        this.maxPlayers = configs.playerNumber;
    }

    public get data(): GameData {
        return this.dataInternal;
    }

    public get configuration(): CrosswordGameConfigs {
        const config: CrosswordGameConfigs = {
            difficulty: this.configurationInternal.difficulty,
            gameId: this.id,
            gameMode: this.configurationInternal.gameMode,
            playerNumber: this.maxPlayers,
            playerName: this.players.length > 0 ? this.players[0].name : ''
        };
        return config;
    }

    public get currentPlayerCount(): number {
        return this.players.length;
    }

    public addPlayer(player: Player): PlayerNumber {
        if (this.players.length < this.maxPlayers) {
            this.notifyArrival(player);

            // Actually add player
            this.players.push(player);

            // Start game if max players reached.
            if (this.players.length === this.maxPlayers) {
                this.start();
            }
        }
        return this.players.length;
    }

    public deletePlayerBySocketid(socketId: string): void {
        const index =
            this.players.findIndex((existingPlayer) => existingPlayer.socketId === socketId);
        const found = index >= 0;
        if (found) {
            this.players.splice(index, 1);
        }
    }

    public findPlayer(predicate: (player: Player) => boolean): Player {
        return this.players.find(predicate);
    }

    public matchesFilter(filter: GameFilter): boolean {
        return this.configurationInternal.gameMode === filter.mode &&
            this.maxPlayers === filter.playerNumber;
    }

    public validateUserAnswer(wordGuess: GridWord, player: Player): boolean {
        if (this.dataInternal.validateWord(wordGuess, player)) {
            this.sendWordFound(wordGuess, player.socketId);
            return true;
        }
        return false;
    }

    protected notifyArrival(player: Player): void {
        this.players.forEach((existingPlayer) => {
            this.communicationHandler.notifyArrival(this.id, existingPlayer, player);
        });
    }

    protected sendWordFound(foundWord: GridWord, finderId: string): void {
        foundWord.owner = Owner.player;
        const finderPlayer =
            this.players.find(player => player.socketId === finderId);
        const opponent =
            this.players.find((player) => player.socketId !== finderId);
        this.communicationHandler.sendFoundWord(foundWord, finderPlayer, opponent);
    }

    public updateSelectionOf(player: Player, id: number, direction: Direction): void {
        const opponents = this.players.filter(
            (existingPlayer) => existingPlayer.socketId !== player.socketId
        );
        opponents.forEach((opponent) => {
            this.communicationHandler.updateOpponentSelectionOf(opponent, id, direction);
        });
    }

    public isSocketIdInGame(socketId: string): boolean {
        return this.players.findIndex((id) => id.socketId === socketId) >= 0;
    }

    protected start(): void {
        this.dataInternal.initialized.then(() => {

            this.players.forEach(player => {
                this.communicationHandler.clearPlayerGrid(player);
                this.communicationHandler.sendGridWords(
                    player,
                    this.dataInternal.wordsViewedByPlayer(player)
                );
                this.communicationHandler.sendDefinitions(player, this.dataInternal.definitions);
            });

            this.players.forEach((player) => {
                this.communicationHandler.sendGameStart(this.players);
            });

        }).catch(warn(logger));
    }

}
