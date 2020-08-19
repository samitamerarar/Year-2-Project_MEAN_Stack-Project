import { Component, OnInit } from '@angular/core';

import { GameService, GameState } from '../../game.service';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.css'],
})
export class WaitingComponent implements OnInit {

    public get waitingText(): string {
        if (this.gameService.data.currentNumberOfPlayers < this.gameService.data.maxNumberOfPlayers) {
            return 'Waiting for more awesome players to join...';
        }
        else {
            return 'Waiting for some cool data to arrive...';
        }
    }

    public get isWaiting(): boolean {
        return this.gameService.stateValue === GameState.waiting;
    }

    constructor(private gameService: GameService) { }

    public ngOnInit(): void {
    }

}
