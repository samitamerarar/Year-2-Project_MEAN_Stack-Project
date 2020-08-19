/*import { MenuAutomatonChoices, CreateOrJoin } from './menu-automaton-choices';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';

describe('MenuAutomatonChoices', () => {

    let menuAutomatonChoices: MenuAutomatonChoices;

    beforeEach(() => {
        menuAutomatonChoices = new MenuAutomatonChoices();
    });

    it('should be created', () => {
        expect(menuAutomatonChoices).toBeTruthy();
        const otherChoices = new MenuAutomatonChoices(
            GameMode.Classic,
            1,
            Difficulty.hard,
            CreateOrJoin.create
        );
        expect(otherChoices.gameMode).toEqual(GameMode.Classic);
        expect(otherChoices.playerNumber).toEqual(1);
        expect(otherChoices.difficulty).toEqual(Difficulty.hard);
        expect(otherChoices.createOrJoin).toEqual(CreateOrJoin.create);
    });

    it('should create a game configuration', () => {
        const otherChoices = new MenuAutomatonChoices(
            GameMode.Classic,
            1,
            Difficulty.hard,
            CreateOrJoin.create
        );
        const gameConfiguration = otherChoices.toGameConfiguration();
        expect(gameConfiguration.gameMode).toEqual(GameMode.Classic);
        expect(gameConfiguration.playerNumber).toEqual(1);
        expect(gameConfiguration.difficulty).toEqual(Difficulty.hard);
    });

});
*/
