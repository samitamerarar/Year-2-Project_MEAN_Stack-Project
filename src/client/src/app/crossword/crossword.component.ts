import { Component, OnDestroy } from '@angular/core';
import { TimerService } from './services/timer.service';
import { GameHttpService } from './services/game-http.service';
import { GameManagerService } from './services/game-manager.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        TimerService,
        GameHttpService
    ]
})
export class CrosswordComponent implements OnDestroy {

    public gameIsBeingConfigured = true;

    constructor(private gameManagerService: GameManagerService) { }

    public ngOnDestroy(): void {
        this.gameManagerService.finalize();
    }

}
