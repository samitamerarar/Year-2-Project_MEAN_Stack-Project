import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Definition } from './definition-field/definition';
import { SelectedGridWords, WordByIdAndDirection } from './board/selected-grid-word';
import { PacketManagerClient } from '../packet-manager-client';
import { SelectedWordPacket } from '../../../../common/src/crossword/packets/selected-word.packet';
import '../../../../common/src/crossword/packets/selected-word.parser';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../common/src/index';
import { Direction, Owner } from '../../../../common/src/crossword/crossword-enums';

@Injectable()
export class SelectionService {

    public static readonly NO_SELECTION: WordByIdAndDirection = {id: -1, direction: Direction.horizontal};

    private selectionValueInternal: SelectedGridWords;
    private selectionSubject = new Subject<SelectedGridWords>();
    private serverSubscription: Subscription;

    constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, this.packetManager);

        this.selectionSubject.subscribe((selection) => {
            this.selectionValueInternal = selection;
        });
        this.serverSubscription = this.selectionSubject.subscribe((selection) => {
            this.sendSelectionToServer();
        });

        this.reinitialize();
    }

    public reinitialize(): void {
        this.selectionSubject.next(new SelectedGridWords(SelectionService.NO_SELECTION, SelectionService.NO_SELECTION));
    }

    public finalize(): void {
        this.serverSubscription.unsubscribe();
    }

    public get selection(): Subject<SelectedGridWords> {
        return this.selectionSubject;
    }

    public get selectionValue(): SelectedGridWords {
        return this.selectionValueInternal;
    }

    public isDefinitionSelected(definition: Definition, player: Owner): boolean {
        let selection: WordByIdAndDirection;
        if (player === Owner.player) {
            selection = this.selectionValueInternal.player;
        }
        else {
            selection = this.selectionValueInternal.opponent;
        }
        return selection != null &&
               definition.index === selection.id &&
               definition.direction === selection.direction;
    }

    public updateSelectedGridWord(word: WordByIdAndDirection): void {
        this.selectionSubject.next(
            new SelectedGridWords(word, this.selectionValueInternal.opponent)
        );
    }

    @PacketHandler(SelectedWordPacket)
    // tslint:disable-next-line:no-unused-variable
    private opponentSelected(event: PacketEvent<SelectedWordPacket>): void {
        this.serverSubscription.unsubscribe();
        this.selectionSubject.next({
            player: this.selectionValue.player,
            opponent: {id: event.value.id, direction: event.value.direction}
        });
        this.serverSubscription = this.selectionSubject.subscribe((selection) => {
            this.sendSelectionToServer();
        });
    }

    private sendSelectionToServer(): void {
        const selection = this.selectionValue.player;
        this.packetManager.sendPacket(
            SelectedWordPacket,
            new SelectedWordPacket(selection.direction, selection.id)
        );
    }

}
