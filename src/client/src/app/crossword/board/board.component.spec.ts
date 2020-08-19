import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { CrosswordTileComponent } from './crossword-tile/crossword-tile.component';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { GridService } from './grid.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { SelectionService } from '../selection.service';
import { UserChoiceService } from '../config-menu/user-choice.service';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BoardComponent, CrosswordTileComponent],
            providers: [
                GameService,
                {provide: PacketManagerClient, useValue: packetManagerClient},
                DefinitionsService,
                GridService,
                SelectionService,
                UserChoiceService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
