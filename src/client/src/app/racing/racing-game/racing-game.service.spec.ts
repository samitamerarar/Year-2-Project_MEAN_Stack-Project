import { TestBed, inject } from '@angular/core/testing';
import { ConnectionBackend, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { RacingGameService } from './racing-game.service';
import { PhysicEngine } from './physic/engine';
import { UIInputs } from '../services/ui-input.service';
import { EventManager } from '../../event-manager.service';
import { MapService } from '../services/map.service';
import { SoundService } from '../services/sound-service';
import { CarsProgressionService } from './cars-progression.service';
import { CarsService } from './cars.service';
import { GameInfoService } from './game-info.service';
import { RainEngine } from './physic/rain/rain-engine';

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RacingGameService,
                PhysicEngine,
                EventManager,
                MapService,
                { provide: ConnectionBackend, useClass: MockBackend },
                { provide: RequestOptions, useClass: BaseRequestOptions },
                Http,
                UIInputs,
                CarsService,
                CarsProgressionService,
                SoundService,
                GameInfoService,
                RainEngine
            ]
        });
    });

    let service: RacingGameService;

    beforeEach(inject([RacingGameService, UIInputs], (injectedService: RacingGameService,
        userInputs: UIInputs) => {
        service = injectedService;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
