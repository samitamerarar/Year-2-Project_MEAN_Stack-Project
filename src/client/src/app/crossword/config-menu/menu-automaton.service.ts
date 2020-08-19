import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MenuState, Option } from './menu-state';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { UserChoiceService, CreateOrJoin } from './user-choice.service';

interface States {
    gameMode:     MenuState;
    playerNumber: MenuState;
    difficulty:   MenuState;
    createOrJoin: MenuState;
    chooseGame:   MenuState;
    confirm:      MenuState;
}

interface Transition {
    state: MenuState;
    option: Option;
}

/**
 * @class MenuAutomatonService
 * @description Represents the Finite State Machine of the configuration menu.
 * For example, with choice '1' (2-player game) while in 'Player Number?' state,
 * we go to state 'Create or Join?'.
 *
 * See doc/architectures/ConfigurationMenu_FSA.jpg
 */
@Injectable()
export class MenuAutomatonService {

    private statesInternal: States;
    private path: Transition[];
    private stateInternal: MenuState = null;
    private configEndInternal = new Subject<void>();

    public get state(): MenuState {
        return this.stateInternal;
    }

    public get states(): States {
        return this.statesInternal;
    }

    public get configEnd(): Subject<void> {
        return this.configEndInternal;
    }

    constructor(private userChoiceService: UserChoiceService) {
        this.initialize();
    }

    public chooseOption(option: Option): void {
        const index = this.state.options.findIndex(
            optionOfState => optionOfState === option
        );
        const found = index >= 0;
        if (found) {
            if (this.state.canMoveToNextState()) {
                this.changeState(option.nextState, option);
            }
        }
        else {
            throw new Error(`Option inexistant.`);
        }
    }

    public goBack(): void {
        if (this.path.length >= 1) {
            const oldState = this.state;
            this.userChoiceService[this.stateInternal.fieldName] = undefined;
            this.stateInternal = this.path.pop().state;
            oldState.leave.next();
            this.stateInternal.arrive.next();
        }
        else {
            throw new Error('Cannot go back: already at the initial configuration menu');
        }
    }

    public canGoBack(): boolean {
        return this.path.length > 0;
    }

    public goBackToInitialState(): void {
        while (this.canGoBack()) {
            this.goBack();
        }
    }

    private initialize(): void {
        this.createStates();
        this.addStateTransitions();
        this.moveToInitialState();
    }

    private createStates(): void {
        this.statesInternal = {
            gameMode: new MenuState('Select game mode', 'gameMode'),
            playerNumber: new MenuState('Select number of players', 'playerNumber'),
            difficulty: new MenuState('Select difficulty', 'difficulty'),
            createOrJoin: new MenuState('Create or join game?', 'createOrJoin'),
            chooseGame: new MenuState('Choose game', null),
            confirm: new MenuState('Confirm choice?', null)
        };
    }

    private addStateTransitions(): void {
        this.states.gameMode.addOption({name: 'Classic', nextState: this.states.playerNumber, value: GameMode.Classic});
        this.states.gameMode.addOption({name: 'Dynamic', nextState: this.states.playerNumber, value: GameMode.Dynamic});

        this.states.playerNumber.addOption({name: 'One player', nextState: this.states.difficulty, value: 1});
        this.states.playerNumber.addOption({name: 'Two players', nextState: this.states.createOrJoin, value: 2});

        this.states.difficulty.addOption({name: 'Easy', nextState: this.states.confirm, value: Difficulty.easy});
        this.states.difficulty.addOption({name: 'Normal', nextState: this.states.confirm, value: Difficulty.normal});
        this.states.difficulty.addOption({name: 'Hard', nextState: this.states.confirm, value: Difficulty.hard});

        this.states.createOrJoin.addOption({name: 'Create game', nextState: this.states.difficulty, value: CreateOrJoin.create});
        this.states.createOrJoin.addOption({name: 'Join game', nextState: this.states.chooseGame, value: CreateOrJoin.join});

        this.states.chooseGame.addOption({name: 'Done', nextState: this.states.confirm});

        this.states.confirm.addOption({name: 'Start', nextState: MenuState.none});
    }

    private moveToInitialState(): void {
        this.stateInternal = this.states.gameMode;
        this.stateInternal.leave.next();
        this.states.gameMode.arrive.next();
        this.path = [];
    }

    private changeState(newState: MenuState, option: Option): void {
        const oldState = this.state;
        if (this.stateInternal.fieldName !== null) {
            // Set user choice
            this.userChoiceService[this.stateInternal.fieldName] = option.value;
        }
        this.path.push({state: this.state, option: option});
        this.stateInternal = option.nextState;
        oldState.leave.next();
        this.state.arrive.next();

        if (this.state === MenuState.none) {
            this.configEndInternal.next();
        }
    }

}
