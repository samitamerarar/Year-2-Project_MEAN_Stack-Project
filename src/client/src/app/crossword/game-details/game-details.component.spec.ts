import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsComponent } from './game-details.component';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { GameService } from '../game.service';
import { GameDetailsService } from './game-details.service';
import { TimerService } from '../services/timer.service';
import { GridService } from '../board/grid.service';
import { SelectionService } from '../selection.service';
import { UserChoiceService } from '../config-menu/user-choice.service';

describe('GameDetailsComponent', () => {
    let component: GameDetailsComponent;
    let fixture: ComponentFixture<GameDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameDetailsComponent],
            providers: [
                {provide: PacketManagerClient, useValue: packetManagerClient},
                GameService,
                GameDetailsService,
                TimerService,
                GridService,
                SelectionService,
                UserChoiceService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
