import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { TimerService } from '../services/timer.service';
import { GridService } from '../board/grid.service';
import { GameMode } from '../../../../../common/src/crossword/crossword-enums';

@Component({
    selector: 'app-game-details',
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {

    constructor(public gameService: GameService,
                private timerService: TimerService,
                private gridService: GridService) { }

    public ngOnInit(): void {
    }

    public shouldDisplayTimer(): boolean {
        return this.gameService.data.mode === GameMode.Dynamic;
    }

    public get timerValue() {
        return this.timerService.timerValue * 1000;
    }

    public get playerWordsFound() {
        return this.gridService.getPlayerWordsFoundCount();
    }

    public get opponentWordsFound() {
        return this.gridService.getOpponentWordsFoundCount();
    }

}
