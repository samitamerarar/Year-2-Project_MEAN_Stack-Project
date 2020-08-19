import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AvailableGamesComponent } from './available-games.component';
import { GameHttpService } from '../../services/game-http.service';
import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';
import { SelectionService } from '../../selection.service';
import { GridService } from '../../board/grid.service';
import { GameService } from '../../game.service';
import { packetManagerClient } from '../../../packet-manager.service';
import { PacketManagerClient } from '../../../packet-manager-client';

describe('AvailableGamesComponent', () => {
    let component: AvailableGamesComponent;
    let fixture: ComponentFixture<AvailableGamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AvailableGamesComponent,
            ],
            imports: [
                HttpClientModule
            ],
            providers: [
                GameHttpService,
                MenuAutomatonService,
                UserChoiceService,
                GridService,
                GameService,
                SelectionService,
                {provide: PacketManagerClient, useValue: packetManagerClient},
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AvailableGamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
