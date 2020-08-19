import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { CrosswordTileComponent } from './board/crossword-tile/crossword-tile.component';
import { GridService } from './board/grid.service';
import { GameDetailsService } from './game-details/game-details.service';
import { SelectionService } from './selection.service';
import { CheatModeComponent } from './cheat-mode/cheat-mode.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { AvailableGamesComponent } from './config-menu/available-games/available-games.component';
import { WaitingComponent } from './config-menu/waiting/waiting.component';
import { ConfirmationComponent } from './config-menu/confirmation/confirmation.component';
import { GameService } from './game.service';
import { UserChoiceService } from './config-menu/user-choice.service';
import { GameHttpService } from './services/game-http.service';
import { GameManagerService } from './services/game-manager.service';
import { MenuAutomatonService } from './config-menu/menu-automaton.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ClickOutsideModule,
        RouterModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent,
        GameDetailsComponent,
        CrosswordTileComponent,
        CheatModeComponent,
        ConfigMenuComponent,
        AvailableGamesComponent,
        WaitingComponent,
        ConfirmationComponent
    ],
    providers: [
        HttpClient,
        GameHttpService,
        SimpleTimer,
        DefinitionsService,
        GridService,
        GameDetailsService,
        SelectionService,
        GameService,
        UserChoiceService,
        GameManagerService,
        MenuAutomatonService
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }


