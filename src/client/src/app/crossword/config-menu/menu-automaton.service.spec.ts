import { TestBed, inject } from '@angular/core/testing';

import { MenuAutomatonService } from './menu-automaton.service';
import { UserChoiceService } from './user-choice.service';

describe('MenuAutomatonService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MenuAutomatonService,
                UserChoiceService
            ]
        });
    });

    let menuAutomaton: MenuAutomatonService;

    beforeEach(inject([MenuAutomatonService], (injectedMenuAutomaton) => {
        menuAutomaton = injectedMenuAutomaton;
    }));

    it('should be created', () => {
        expect(menuAutomaton).toBeTruthy();
    });

    describe('chooseOption', () => {

        it('should accept an existing option', () => {
            const initialState = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            expect(menuAutomaton.state).toBeTruthy();
            expect(menuAutomaton.state).not.toEqual(initialState);
        });

        it('should not do anything when we should not go to next state', () => {
            const state0 = menuAutomaton.state;
            state0.canMoveToNextState = () => false;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            expect(menuAutomaton.state).toBe(state0);
            state0.canMoveToNextState = () => true;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            expect(menuAutomaton.state).not.toBe(state0);
        });

        it('should not accept an option that does not exist', () => {
            expect(() => menuAutomaton.chooseOption(null)).toThrow();
        });

    });

    describe('goBack', () => {

        it('should move us back by one state where we are not at the initial state', () => {
            const state0 = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            const state1 = menuAutomaton.state;
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            menuAutomaton.goBack();
            expect(menuAutomaton.state).toEqual(state1);
            menuAutomaton.goBack();
            expect(menuAutomaton.state).toEqual(state0);
        });

        it('should throw an error when we are at the initial state', () => {
            expect(() => menuAutomaton.goBack()).toThrow();
        });

    });

    it('should set callbacks to be called when the configuration ends', () => {
        let i = 0;
        let wasCallbackCalled = false;
        const callback = () => wasCallbackCalled = true;
        menuAutomaton.configEnd.subscribe(callback);
        while (i < 1000 && !wasCallbackCalled) {
            menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
            ++i;
        }
        expect(wasCallbackCalled).toEqual(true);
    });

    it('should tell whether it can go back one state', () => {
        expect(menuAutomaton.canGoBack()).toBe(false);
        menuAutomaton.chooseOption(menuAutomaton.state.options[0]);
        expect(menuAutomaton.canGoBack()).toBe(true);
        menuAutomaton.goBack();
        expect(menuAutomaton.canGoBack()).toBe(false);
    });

});
