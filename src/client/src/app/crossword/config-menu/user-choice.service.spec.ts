import { TestBed, inject } from '@angular/core/testing';

import { UserChoiceService, CreateOrJoin } from './user-choice.service';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';

describe('UserChoiceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserChoiceService]
        });
    });

    let userChoiceService: UserChoiceService;

    beforeEach(inject([UserChoiceService], (userChoiceServiceInjected) => {
        userChoiceService = userChoiceServiceInjected;
    }));

    it('should be created', () => {
        expect(userChoiceService).toBeTruthy();
    });

    it('should create a game configuration', () => {
        userChoiceService.gameMode = GameMode.Classic;
        userChoiceService.playerNumber = 1;
        userChoiceService.difficulty = Difficulty.hard;
        userChoiceService.createOrJoin = CreateOrJoin.create;
        const gameConfiguration = userChoiceService.toGameConfiguration();
        expect(gameConfiguration.gameMode).toEqual(GameMode.Classic);
        expect(gameConfiguration.playerNumber).toEqual(1);
        expect(gameConfiguration.difficulty).toEqual(Difficulty.hard);
    });

});
