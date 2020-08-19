import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameManagerService } from './game-manager.service';
import { GameService } from '../game.service';
import { UserChoiceService } from '../config-menu/user-choice.service';
import { GameHttpService } from './game-http.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { GridService } from '../board/grid.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { SelectionService } from '../selection.service';
import { MenuAutomatonService } from '../config-menu/menu-automaton.service';

describe('GameManagerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                { provide: PacketManagerClient, useValue: packetManagerClient },
                GameManagerService,
                GameHttpService,
                GameService,
                UserChoiceService,
                DefinitionsService,
                GridService,
                SelectionService,
                MenuAutomatonService
            ]
        });
    });

    it('should be created', inject([GameManagerService], (service: GameManagerService) => {
        expect(service).toBeTruthy();
    }));

});
