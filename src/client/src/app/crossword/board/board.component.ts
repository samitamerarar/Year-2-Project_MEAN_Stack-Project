import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ApplicationRef } from '@angular/core';
import { GridService } from './grid.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { SelectionService } from '../selection.service';

import { HighlightGrid, WhoIsSelecting } from './crossword-tile/highlight-grid';
import { Subscription } from 'rxjs/Subscription';
import { Grid } from '../../../../../common/src/grid';
import { Owner, Direction } from '../../../../../common/src/crossword/crossword-enums';
import { SelectedGridWords } from './selected-grid-word';
import { Logger } from '../../../../../common/src/logger';
import { Selection } from './crossword-tile/highlight-grid';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
    private static readonly UPDATE_PERIOD = 200; // ms

    public readonly DIMENSIONS = Array(Grid.DIMENSIONS);

    public readonly logger = Logger.getLogger('BoardComponent');

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    private highlightGrid = new HighlightGrid();
    private selectionSubscription: Subscription;
    private updateTimer: any = null;

    constructor(private gridService: GridService,
                private selectionService: SelectionService,
                private appRef: ApplicationRef) {
        this.gridService.
            addOnChangeCallback(() => this.appRef.tick());
    }

    public ngOnInit(): void {
        this.selectionSubscription =
            this.selectionService.selection.subscribe(
                () => this.onChange()
            );
            this.gridService.addOnChangeCallback(() => this.onChange());
        this.updateTimer = setInterval(() => this.appRef.tick(), BoardComponent.UPDATE_PERIOD);
        this.onChange();
    }

    public ngOnDestroy(): void {
        this.selectionSubscription.unsubscribe();
        clearTimeout(this.updateTimer);
    }

    public getGridCharAt(row: number, column: number) {
        return this.gridService.getCharAt(row, column);
    }

    private onChange(): void {
        const selected = this.selectionService.selectionValue;
        const playerSelection = this.gridService.getWord(selected.player);
        const opponentSelection = this.gridService.getWord(selected.opponent);
        const selection: Selection = {player: playerSelection, opponent: opponentSelection};
        this.highlightGrid = new HighlightGrid(selection, this.gridService.words);

        // Don't focus on invisible input if we didn't select anything.
        if (selected.player.id !== SelectionService.NO_SELECTION.id) {
            this.inputBuffer.nativeElement.focus();
        }
        this.inputBuffer.nativeElement.value = '';
        this.onInputChange('');
    }

    public onInputChange(inputValue: string) {
        if (this.selectionService.selectionValue.player !== null) {
            const USER_WORD = this.makeWordFromInput(inputValue);
            this.inputBuffer.nativeElement.value = USER_WORD.string;
            this.gridService.setUserInput(USER_WORD);
        }
    }

    public isHighlighted(row: number, column: number): WhoIsSelecting {
        return this.highlightGrid.isSelected(row, column);
    }

    public isFilled(row: number, column: number): WhoIsSelecting {
        return this.highlightGrid.hasBeenFound(row, column);
    }

    private makeWordFromInput(input: string): GridWord {
        input = input.replace(/[^a-zA-Z]/g, '');
        input = input.toLowerCase();

        const SELECTED_WORD =
            this.gridService.getWord(this.selectionService.selectionValue.player);
        if (SELECTED_WORD !== null) {
            if (input.length > SELECTED_WORD.length) {
                input = input.substr(0, SELECTED_WORD.length);
            }
            return new GridWord(
                -1,
                SELECTED_WORD.y,
                SELECTED_WORD.x,
                SELECTED_WORD.length,
                SELECTED_WORD.direction,
                Owner.none,
                input
            );
        }
        return new GridWord(0, 0, 0, 0, Direction.horizontal, Owner.none, '');
    }

}
