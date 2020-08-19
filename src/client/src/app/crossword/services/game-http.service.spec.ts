import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GameHttpService } from './game-http.service';
import { GameService } from '../game.service';
import { packetManagerClient } from '../../packet-manager.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { UserChoiceService } from '../config-menu/user-choice.service';

describe('GameHttpService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                GameHttpService,
                GameService,
                { provide: PacketManagerClient, useValue: packetManagerClient },
                UserChoiceService
            ]
        });
    });

    it('should be created', inject([GameHttpService], (service: GameHttpService) => {
        expect(service).toBeTruthy();
    }));
});
