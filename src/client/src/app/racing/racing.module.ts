import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapService } from './services/map.service';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';
import { MapThumbnailComponent } from './initial-view/map-thumbnail/map-thumbnail.component';
import { UIInputs } from './services/ui-input.service';
import { RacingGameService } from './racing-game/racing-game.service';
import { PhysicEngine } from './racing-game/physic/engine';
import { SoundService } from './services/sound-service';
import { CarsService } from './racing-game/cars.service';
import { TextureLoader, textureLoaderValue } from './services/texture-loader';
import { CarsProgressionService } from './racing-game/cars-progression.service';
import { GameResultsComponent } from './racing-game/end-view/game-results/game-results.component';
import { BestTimeComponent } from './racing-game/end-view/best-time/best-time.component';
import { EndViewComponent } from './racing-game/end-view/end-view.component';
import { EndViewService } from './services/end-view.service';
import { GameInfoService } from './racing-game/game-info.service';
import { FormsModule } from '@angular/forms';
import { RainEngine } from './racing-game/physic/rain/rain-engine';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent,
        InitialViewComponent,
        RacingGameComponent,
        MapBestTimeComponent,
        MapThumbnailComponent,
        BestTimeComponent,
        EndViewComponent,
        GameResultsComponent,
        UIInputs
    ],
    providers: [
        MapService,
        RacingGameService,
        PhysicEngine,
        SoundService,
        GameInfoService,
        CarsService,
        CarsProgressionService,
        EndViewService,
        RainEngine,
        { provide: TextureLoader, useValue: textureLoaderValue }
    ]
})
export class RacingModule { }
