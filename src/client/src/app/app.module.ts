import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppHeaderComponent } from './app-header/app-header.component';

import { AppComponent } from './app.component';

import { CrosswordModule } from './crossword/crossword.module';
import { RacingModule } from './racing/racing.module';

import { SelectionScreenComponent } from './selection-screen/selection-screen.component';

import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { MapEditorComponent } from './admin-screen/map-editor/map-editor.component';

import { AppRoutingModule } from './app-routing.module';

import { PacketManagerService, packetManagerClient } from './packet-manager.service';
import { PacketManagerClient } from './packet-manager-client';
import { MapService } from './racing/services/map.service';
import { AdminConfigComponent } from './admin-screen/admin-config/admin-config.component';
import { AdminConfigService } from './admin-screen/admin-config.service';
import { EventManager, eventManagerValue } from './event-manager.service';
import { ItemGenerator } from './admin-screen/map-editor/items/item-generator';
import { RacingGameService } from './racing/racing-game/racing-game.service';
import { PhysicEngine } from './racing/racing-game/physic/engine';
import { SoundService } from './racing/services/sound-service';
import { TextureLoader, textureLoaderValue } from './racing/services/texture-loader';
import { GameInfoService } from './racing/racing-game/game-info.service';

@NgModule({
    declarations: [
        AppComponent,
        SelectionScreenComponent,
        AppHeaderComponent,
        AdminScreenComponent,
        MapEditorComponent,
        AdminConfigComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        CrosswordModule,
        RacingModule,
        AppRoutingModule
    ],
    providers: [
        PacketManagerService,
        { provide: PacketManagerClient, useValue: packetManagerClient },
        MapService,
        AdminConfigService,
        { provide: EventManager, useValue: eventManagerValue },
        ItemGenerator,
        MapService,
        RacingGameService,
        PhysicEngine,
        SoundService,
        GameInfoService,
        { provide: TextureLoader, useValue: textureLoaderValue }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
