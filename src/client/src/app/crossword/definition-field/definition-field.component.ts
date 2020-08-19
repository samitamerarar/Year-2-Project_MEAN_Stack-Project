import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';

import { DefinitionsService, Definitions, Answers } from './definitions.service';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridService } from '../board/grid.service';
import { SelectionService } from '../selection.service';
import { Definition } from './definition';
import { GameService, GameState } from '../game.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent {

    public readonly HORIZONTAL = Direction.horizontal;
    public readonly VERTICAL = Direction.vertical;
    public verticalCollapsed = true;
    public acrossCollapsed = true;

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    public get cheatMode(): boolean {
        return this.gameService.isShowWordsOn();
    }

    constructor(private definitionService: DefinitionsService,
                private selectionService: SelectionService,
                private gridService: GridService,
                private gameService: GameService,
                private ngZone: NgZone) {
        this.definitionService.pushOnChangeCallback(() => {
            this.ngZone.run(() => { });
        });
    }

    public get definitions(): Definitions {
        return this.definitionService.definitions;
    }

    public get answers(): Answers {
        return this.definitionService.answers;
    }

    public isDefinitionClickable(id: number, direction: Direction): boolean {
        const isWordFound =
            this.gridService.getWord({id: id, direction: direction}).owner === Owner.none;
        return isWordFound;
    }

    public onDefinitionClicked(index: number, direction: Direction): void {
        if (this.isDefinitionClickable(index, direction)) {
            this.selectionService.updateSelectedGridWord({id: index, direction: direction});
        }
    }

    public onClickOutside(): void {
        if (this.gameService.stateValue >= GameState.started) {
            this.selectionService.updateSelectedGridWord(SelectionService.NO_SELECTION);
        }
    }

    public checkIfSelectedByPlayer(index: number, direction: Direction): boolean {
        return this.selectionService.isDefinitionSelected(
            new Definition(index, direction, ''),
            Owner.player
        );
    }

    public checkIfSelectedByOpponent(index: number, direction: Direction): boolean {
        return this.selectionService.isDefinitionSelected(
            new Definition(index, direction, ''),
            Owner.opponent
        );
    }

    public checkIfFound(index: number, direction: Direction): boolean {
        return this.gridService.checkIfWordIsFound(index, direction);
    }

    public checkDefinitionStatus(index: number, direction: Direction) { }

    public isCollapsedAcross(): void {
        this.acrossCollapsed = !this.acrossCollapsed;
    }

    public isCollapsedVertical(): void {
        this.verticalCollapsed = !this.verticalCollapsed;
    }

}
