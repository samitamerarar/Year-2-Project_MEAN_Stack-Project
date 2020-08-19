import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DefinitionFieldComponent } from './definition-field.component';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from './definitions.service';
import { GridService } from '../board/grid.service';
import { SelectionService } from '../selection.service';
import { GameHttpService } from '../services/game-http.service';
import { UserChoiceService } from '../config-menu/user-choice.service';

describe('DefinitionFieldComponent', () => {
    let component: DefinitionFieldComponent;
    let fixture: ComponentFixture<DefinitionFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionFieldComponent],
            imports: [
                HttpClientModule
            ],
            providers: [
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService,
                GridService,
                SelectionService,
                GameService,
                GameHttpService,
                UserChoiceService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
