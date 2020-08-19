import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { RacingGameComponent } from './racing-game.component';
import { RacingGameService } from './racing-game.service';
import { MapService } from '../services/map.service';
import { UIInputs } from '../services/ui-input.service';
import { EventManager } from '../../event-manager.service';
import { PhysicEngine } from './physic/engine';
import { SoundService } from '../services/sound-service';
import { CarsService } from './cars.service';
import { CarsProgressionService } from './cars-progression.service';
import { BestTimeComponent } from './end-view/best-time/best-time.component';
import { GameResultsComponent } from './end-view/game-results/game-results.component';
import { EndViewComponent } from './end-view/end-view.component';
import { EndViewService } from '../services/end-view.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { GameInfoService } from './game-info.service';
import { RainEngine } from './physic/rain/rain-engine';

describe('RacingGameComponent', () => {
    let component: RacingGameComponent;
    let fixture: ComponentFixture<RacingGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([{ path: 'racing/racing-game/:map-name', component: RacingGameComponent }]),
                HttpModule,
                NoopAnimationsModule,
                FormsModule
            ],
            declarations: [RacingGameComponent, UIInputs, GameResultsComponent, BestTimeComponent, EndViewComponent],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                RacingGameService,
                MapService,
                EventManager,
                PhysicEngine,
                CarsService,
                CarsProgressionService,
                SoundService,
                EndViewService,
                HttpClient,
                HttpHandler,
                GameInfoService,
                RainEngine
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
