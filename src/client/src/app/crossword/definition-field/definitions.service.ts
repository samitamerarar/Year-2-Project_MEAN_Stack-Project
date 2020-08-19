import { Injectable } from '@angular/core';

import { Definition } from './definition';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { PacketManagerClient } from '../../packet-manager-client';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';

import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import { GameService } from '../game.service';
import { GameHttpService } from '../services/game-http.service';

export interface Answers {
    horizontal: string[];
    vertical: string[];
}

export interface Definitions {
    horizontal: Definition[];
    vertical: Definition[];
}

/**
 * Contains the crossword's definitions, and the answers if cheat mode.
 */
@Injectable()
export class DefinitionsService {

    private horizontalDefinitions: Map<number, Definition> = new Map();
    private verticalDefinitions: Map<number, Definition> = new Map();
    private horizontalAnswers: string[] = [];
    private verticalAnswers: string[] = [];
    private onChangeCallbacks: (() => void)[] = [];

    constructor(private packetManager: PacketManagerClient,
                private gameService: GameService,
                private gameHttpService: GameHttpService) {
        this.gameService.onShowWords.subscribe((value) => {
            if (value) {
                this.fetchAnswers();
            }
        });
        registerHandlers(this, this.packetManager);
    }

    public get answers(): Answers {
        return {
            horizontal: this.horizontalAnswers.slice(),
            vertical: this.verticalAnswers.slice()
        };
    }

    public get definitions(): Definitions {
        return {
            horizontal: <Definition[]>Array.from(this.horizontalDefinitions.values()),
            vertical: <Definition[]>Array.from(this.verticalDefinitions.values())
        };
    }

    public pushOnChangeCallback(callback: () => void): void {
        this.onChangeCallbacks.push(callback);
    }

    @PacketHandler(ClearGridPacket)
    public clearDefinitions(): void {
        this.horizontalDefinitions.clear();
        this.verticalDefinitions.clear();
        this.horizontalAnswers = [];
        this.verticalAnswers = [];
        this.onChange();
    }

    private onChange(): void {
        this.onChangeCallbacks.forEach((callback) => {
            callback();
        });
    }

    private fetchAnswers(): void {
        this.horizontalAnswers = [];
        this.verticalAnswers = [];
        this.gameHttpService.getWords().then((words) => {
            words.forEach((word) => {
                if (word.direction === Direction.horizontal) {
                    this.horizontalAnswers.push(word.string);
                }
                else if (word.direction === Direction.vertical) {
                    this.verticalAnswers.push(word.string);
                }
                else {
                    throw new Error(`Answer direction "${word.direction}" is invalid`);
                }
            });
        });
    }

    @PacketHandler(GameDefinitionPacket)
    // tslint:disable-next-line:no-unused-variable
    private gameDefinitionHandler(event: PacketEvent<GameDefinitionPacket>) {
        const definitionIndex = event.value.index;
        const serializedDefinition = event.value.definition;
        const direction = event.value.direction;
        const definition =
            Definition.deserialize(definitionIndex, serializedDefinition);

        if (direction === Direction.horizontal) {
            this.horizontalDefinitions.set(definitionIndex, definition);
        } else if (direction === Direction.vertical) {
            this.verticalDefinitions.set(definitionIndex, definition);
        }
        this.onChange();
    }

}
