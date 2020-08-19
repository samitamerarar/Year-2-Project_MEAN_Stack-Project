import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingComponent } from './waiting.component';
import { PacketManagerClient } from '../../../packet-manager-client';
import { packetManagerClient } from '../../../packet-manager.service';
import { GameService } from '../../game.service';
import { UserChoiceService } from '../user-choice.service';

describe('WaitingComponent', () => {
    let component: WaitingComponent;
    let fixture: ComponentFixture<WaitingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WaitingComponent ],
            providers: [
                {provide: PacketManagerClient, useValue: packetManagerClient},
                GameService,
                UserChoiceService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
