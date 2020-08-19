import { Component } from '@angular/core';

import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

    constructor(public menuAutomaton: MenuAutomatonService,
                public userChoiceService: UserChoiceService) {
        const confirmState = this.menuAutomaton.states.confirm;
        confirmState.canMoveToNextState = () => this.userChoiceService.playerName !== '';
    }

}
