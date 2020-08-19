import {
    GridWordPacket,
    GameDefinitionPacket,
    ClearGridPacket,
    GameStartPacket,
    SelectedWordPacket,
    TimerPacket,
    WordGuessPacket,
    GameJoinPacket
} from '../../../../../common/src/crossword/packets';
import { PacketManagerServer } from '../../../packet-manager';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { DefinitionWithIndex } from './game-data';
import { Player } from '../player';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GameId } from '../../../../../common/src/communication/game-configs';

export class CommunicationHandler {

    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    public async clearPlayerGrid(player: Player): Promise<void> {
        this.packetManager.sendPacket(ClearGridPacket, new ClearGridPacket(), player.socketId);
    }

    public sendGameStart(players: Player[]) {
        players.forEach((player) => {
            this.packetManager.sendPacket(GameStartPacket, new GameStartPacket(), player.socketId);
        });
    }

    public sendGridWords(player: Player, gridwords: GridWord[]): void {
        gridwords.forEach((gridword) => {
            this.packetManager.sendPacket(
                GridWordPacket,
                new GridWordPacket(gridword),
                player.socketId
            );
        });
    }

    public sendDefinitions(player: Player, definitions: DefinitionWithIndex[]): void {
        const definitionsWithIndex = definitions;
        definitionsWithIndex.forEach((definitionWithIndex) => {
            const index = definitionWithIndex.index;
            const definition = definitionWithIndex.definition;
            this.packetManager.sendPacket(
                GameDefinitionPacket,
                new GameDefinitionPacket(index, definition.direction, definition),
                player.socketId
            );
        });
    }

    public updateOpponentSelectionOf(player: Player,
                                     selectionId: number,
                                     selectionDirection: Direction): void {
        this.packetManager.sendPacket(
            SelectedWordPacket,
            new SelectedWordPacket(selectionDirection, selectionId),
            player.socketId
        );
    }

    public sendFoundWord(foundWord: GridWord, finder: Player, opponent: Player = null): void {
        foundWord.owner = Owner.player;
        const finderPacket = new WordGuessPacket(foundWord);
        this.packetManager.sendPacket(
            WordGuessPacket,
            finderPacket,
            finder.socketId
        );
        if (opponent) {
            const opponentPacket = new WordGuessPacket(new GridWord(
                foundWord.id,
                foundWord.y,
                foundWord.x,
                foundWord.length,
                foundWord.direction,
                Owner.opponent,
                foundWord.string
            ));
            this.packetManager.sendPacket(
                WordGuessPacket,
                opponentPacket,
                opponent.socketId
            );
        }
    }

    public sendNewTimerValue(player: Player, countdown: number): void {
        this.packetManager.sendPacket(
            TimerPacket,
            new TimerPacket(countdown), player.socketId
        );
    }

    public notifyArrival(gameId: GameId, existingPlayer: Player, newPlayer: Player): void {
        this.packetManager.sendPacket(
            GameJoinPacket,
            new GameJoinPacket(gameId, newPlayer.name),
            existingPlayer.socketId
        );
        this.packetManager.sendPacket(
            GameJoinPacket,
            new GameJoinPacket(gameId, existingPlayer.name),
            newPlayer.socketId
        );
    }

}
