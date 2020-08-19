import { UserDisplayableGameData } from './user-displayable-game-data';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

const DEFAULT_PLAYER_NAME = 'CHUCK NORRIS';
const DEFAULT_ID = 0;
const DEFAULT_MODE = GameMode.Classic;
const DEFAULT_DIFFICULTY = Difficulty.easy;

describe('UserDisplayableGameData', () => {

    it('should be created', () => {
        const DATA = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, DEFAULT_MODE, DEFAULT_DIFFICULTY);
        expect(DATA).toBeTruthy();
    });

    it('should deserialize game ids', () => {
        const DATA = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, -42, DEFAULT_MODE, DEFAULT_DIFFICULTY);
        expect(DATA.id).toEqual(-42);
    });

    it('should deserialize game modes', () => {
        const DATA1 = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, GameMode.Classic, DEFAULT_DIFFICULTY);
        expect(DATA1.modeAsString()).toMatch(/^classic$/i);
        const DATA2 = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, GameMode.Dynamic, DEFAULT_DIFFICULTY);
        expect(DATA2.modeAsString()).toMatch(/^dynamic$/i);
    });

    it('should deserialize game difficulties', () => {
        const DATA1 = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, DEFAULT_MODE, Difficulty.easy);
        expect(DATA1.difficultyAsString()).toMatch(/^easy$/i);
        const DATA2 = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, DEFAULT_MODE, Difficulty.normal);
        expect(DATA2.difficultyAsString()).toMatch(/^normal$/i);
        const DATA3 = new UserDisplayableGameData(DEFAULT_PLAYER_NAME, DEFAULT_ID, DEFAULT_MODE, Difficulty.hard);
        expect(DATA3.difficultyAsString()).toMatch(/^hard$/i);
    });

});
