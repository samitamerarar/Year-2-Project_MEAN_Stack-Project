import { Injectable } from '@angular/core';

import {
    WordGuessPacket,
    GridWordPacket,
    ClearGridPacket
} from '../../../../../common/src/crossword/packets';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { mockHorizontalGridWords, mockVerticalGridWords } from '../mocks/grid-mock';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { Grid } from './grid';
import { SelectionService } from '../selection.service';
import { GameService, GameState } from '../game.service';
import { WordByIdAndDirection } from './selected-grid-word';

@Injectable()
export class GridService {

    private readonly grid = new Grid();
    private callbacks: (() => void)[] = [];

    constructor(private packetManager: PacketManagerClient,
                private selectionService: SelectionService,
                private gameService: GameService) {
        registerHandlers(this, packetManager);

        this.reinitialize();
    }

    public reinitialize(): void {
        this.grid.clear();

        // This mock is meant to stay as an initial view
        mockHorizontalGridWords().forEach((word) => {
            this.grid.addWord(word);
        });
        mockVerticalGridWords().forEach((word) => {
            this.grid.addWord(word);
        });

        const mockSelection = {direction: Direction.vertical, id: 2};
        this.selectionService.reinitialize();
        this.selectionService.updateSelectedGridWord(mockSelection);

        this.onChange();
    }

    public get words(): GridWord[] {
        return this.grid.words;
    }

    public getCharAt(row: number, column: number): string {
        return this.grid.getCharAt(row, column);
    }

    public getWord(wordSearch: WordByIdAndDirection): GridWord {
        if (wordSearch.id !== SelectionService.NO_SELECTION.id) {
            return this.grid.getWord(wordSearch.id, wordSearch.direction);
        }
        else {
            return null;
        }
    }

    public setUserInput(word: GridWord): void {
        this.grid.userInput = word;
        if (word.length === word.string.length && word.length !== 0) {
            this.sendWordToServer(word);
        }
    }

    public addOnChangeCallback(callback: () => void): void {
        this.callbacks.push(callback);
    }

    public checkIfWordIsFound(wordId: number, wordDirection: Direction): boolean {
        return this.grid.getWord(wordId, wordDirection).owner !== Owner.none;
    }

    private sendWordToServer(word: GridWord): void {
        this.packetManager.sendPacket(WordGuessPacket, new WordGuessPacket(word));
    }

    private onChange(): void {
        this.callbacks.forEach((callback) => callback());
    }

    @PacketHandler(GridWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private updateGridWord(event: PacketEvent<GridWordPacket>): void {
        this.selectionService.updateSelectedGridWord(SelectionService.NO_SELECTION);
        this.gameService.onShowWords.next(false);
        this.grid.addWord(event.value.gridword);
        this.onChange();
    }

    @PacketHandler(ClearGridPacket)
    // tslint:disable-next-line:no-unused-variable
    private clearGrid(): void {
        this.selectionService.updateSelectedGridWord(SelectionService.NO_SELECTION);
        this.gameService.onShowWords.next(false);
        this.grid.clear();
        this.onChange();
    }

    @PacketHandler(WordGuessPacket)
    // tslint:disable-next-line:no-unused-variable
    private wordWasFound(event: PacketEvent<WordGuessPacket>): void {
        const word = event.value.wordGuess;
        this.grid.updateWord(word);
        const isWordSelected =
            this.selectionService.selectionValue.player !== SelectionService.NO_SELECTION &&
            this.selectionService.selectionValue.player.id === word.id &&
            this.selectionService.selectionValue.player.direction === word.direction;
        if (isWordSelected) {
            this.selectionService.updateSelectedGridWord(SelectionService.NO_SELECTION);
        }
        if (this.getPlayerWordsFoundCount() + this.getOpponentWordsFoundCount() >= this.grid.numberOfWords) {
            this.gameService.state.next(GameState.finished);
        }
        this.onChange();
    }

    public getPlayerWordsFoundCount() {
        return this.grid.getPlayerWordsFoundCount();
    }

    public getOpponentWordsFoundCount() {
        return this.grid.getOpponentWordsFoundCount();
    }

}
