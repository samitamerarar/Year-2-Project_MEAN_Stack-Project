import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { WhoIsSelecting } from './highlight-grid';
import { Grid } from '../grid';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent {

    @Input() public readonly tileRow: number;
    @Input() public readonly tileColumn: number;

    @Input() public highlighted: WhoIsSelecting;
    @Input() public filled: WhoIsSelecting;

    @Input() public tileChar: string;

    @ViewChild('caseInput') public caseInput: ElementRef;

    public readonly WhoIsSelecting = WhoIsSelecting;

    public isBlackTile(): boolean {
        return this.tileChar === Grid.BLACK_TILE;
    }

}
