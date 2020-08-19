import { TestBed, inject } from '@angular/core/testing';

import { GridService } from './grid.service';
import { GameService } from '../game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { SelectionService } from '../selection.service';
import { UserChoiceService } from '../config-menu/user-choice.service';

describe('GridService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GridService,
                GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                DefinitionsService,
                SelectionService,
                GameService,
                UserChoiceService
            ]
        });
    });

    let gridService: GridService;

    beforeEach(inject([GridService], (injectedService) => {
        gridService = injectedService;
    }));

    it('should be created', () => {
        expect(gridService).toBeTruthy();
    });

});
