import { Component, Input, OnDestroy } from '@angular/core';

import { GameHttpService } from '../../services/game-http.service';
import { UserDisplayableGameData } from './user-displayable-game-data';
import { Subscription } from 'rxjs/Subscription';
import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';
import { GameFilter } from '../../../../../../common/src/crossword/game-filter';

@Component({
    selector: 'app-available-games',
    templateUrl: './available-games.component.html',
    styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent implements OnDestroy {

    private gamesInternal: UserDisplayableGameData[] = [];
    private subscriptions: Subscription[] = [];

    @Input() public shouldDisplay = true;

    constructor(public gameHttpService: GameHttpService,
                private menuAutomaton: MenuAutomatonService,
                private userChoiceService: UserChoiceService) {
        // Refresh the list whenever we move to the 'chooseGame' screen.
        const chooseGameState = this.menuAutomaton.states.chooseGame;
        const chooseGameArriveSubscription =
            chooseGameState.arrive.subscribe(() => {
                this.refresh();
            });
        this.subscriptions.push(chooseGameArriveSubscription);

        // We can leave the screen only if we picked a game.
        chooseGameState.canMoveToNextState =
            () => this.userChoiceService.chosenGame !== null;
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public get games(): UserDisplayableGameData[] {
        return this.gamesInternal;
    }

    public select(index: number): void {
        if (index >= 0 && index < this.gamesInternal.length) {
            this.userChoiceService.chosenGame = this.gamesInternal[index].id;
            this.userChoiceService.difficulty = this.gamesInternal[index].difficulty;
        }
        else {
            throw new Error(`Choice index ${index} invalid`);
        }
    }

    public unselect(): void {
        this.userChoiceService.chosenGame = null;
    }

    public isSelected(index: number): boolean {
        return this.gamesInternal[index].id === this.userChoiceService.chosenGame;
    }

    public async refresh(): Promise<void> {
        this.unselect();
        this.gamesInternal = []; // Display nothing while we refresh
        this.gamesInternal =
            await this.gameHttpService.getGames(
                new GameFilter(this.userChoiceService.gameMode, 2)
            );
    }

}
