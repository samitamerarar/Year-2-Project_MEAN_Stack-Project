import { Injectable } from '@angular/core';

import { PacketManagerClient } from '../packet-manager-client';

import { GameJoinPacket } from '../../../../common/src/crossword/packets/game-join.packet';
import '../../../../common/src/crossword/packets/game-join.parser';
import { Subject } from 'rxjs/Subject';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../common/src/index';
import { UserChoiceService } from './config-menu/user-choice.service';
import { GameData } from './game-data';
import { GameStartPacket, GameLeavePacket } from '../../../../common/src/crossword/packets';
import { GameMode } from '../../../../common/src/crossword/crossword-enums';

export enum GameState {
    configuring,
    waiting,
    started,
    finished
}

/**
 * @class GameService
 * @description Represents the current game. Has the resposibilities of:
 * 1) Containing the game's data
 * 2) Sending all socket packets from the client to the server
 * The response from the server usually goes directly to the appropriate
 * service
 */
@Injectable()
export class GameService {

    private stateValueInternal: GameState;
    private stateInternal = new Subject<GameState>();

    private cheatModeOn = false;
    private isShowWordsOnInternal = false;
    private onShowWordsInternal = new Subject<boolean>();
    private changeTimerValueOn = false;

    private dataInternal: GameData;

    public get data(): GameData {
        return this.dataInternal.clone();
    }

    public get stateValue(): GameState {
        return this.stateValueInternal;
    }

    public get state(): Subject<GameState> {
        return this.stateInternal;
    }

    constructor(private packetManager: PacketManagerClient,
                private userChoiceService: UserChoiceService) {
        this.onShowWordsInternal.subscribe((value) => {
            this.isShowWordsOnInternal = value;
        });
        this.stateInternal.subscribe(state => this.stateValueInternal = state);
        this.stateInternal.next(GameState.configuring);
        this.reinitialize();

        registerHandlers(this, packetManager);
    }

    public joinGame(id: number, playerName: string): void {
        this.dataInternal.currentNumberOfPlayers = 1;

        if (!this.dataInternal.id) {
            this.dataInternal.id = id;
            this.dataInternal.playerName = playerName;
            this.packetManager.sendPacket(
                GameJoinPacket,
                new GameJoinPacket(this.dataInternal.id, this.dataInternal.playerName)
            );
        }
    }

    public reinitialize(): void {
        this.dataInternal = new GameData();
    }

    public finalize(): void {
        this.cheatModeOn = false;
        this.changeTimerValueOn = false;
        this.dataInternal = new GameData();
        this.stateInternal.next(GameState.configuring);
        this.packetManager.sendPacket(GameLeavePacket, new GameLeavePacket());
    }

    public setCheatModeOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }

    public getCheatModeState(): boolean {
        return this.cheatModeOn;
    }

    public isShowWordsOn(): boolean {
        return this.isShowWordsOnInternal;
    }

    public get onShowWords(): Subject<boolean> {
        return this.onShowWordsInternal;
    }

    public setTimerOnOff(): void {
        if (this.dataInternal.mode === GameMode.Dynamic) {
            this.changeTimerValueOn = !this.changeTimerValueOn;
        }
    }

    public getTimerState(): boolean {
        return this.changeTimerValueOn;
    }

    @PacketHandler(GameJoinPacket)
    // tslint:disable-next-line:no-unused-variable
    private opponentJoined(event: PacketEvent<GameJoinPacket>): void {
        this.dataInternal.opponentName = event.value.playerName;
        ++this.dataInternal.currentNumberOfPlayers;
    }

    @PacketHandler(GameStartPacket)
    // tslint:disable-next-line:no-unused-variable
    private gameStarted(event: PacketEvent<GameStartPacket>): void {
        this.stateInternal.next(GameState.started);
        this.dataInternal.mode = this.userChoiceService.gameMode;
        this.dataInternal.difficulty = this.userChoiceService.difficulty;
        this.dataInternal.maxNumberOfPlayers = this.userChoiceService.playerNumber;
    }

}
