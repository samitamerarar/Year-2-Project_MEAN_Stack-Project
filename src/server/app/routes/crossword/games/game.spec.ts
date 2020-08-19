import { expect } from 'chai';
import { Game } from './game';
import { createMockGameConfigs } from './create-mock-game-configs';
import { Difficulty, GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { Player } from '../player';
import { GameFilter } from '../../../../../common/src/crossword/game-filter';
import { GameClassic } from './game-classic';

class MockGame extends GameClassic {}

describe('The Crossword Game', () => {
    it('should be created', (done) => {
        const mockConfig = createMockGameConfigs();
        const game = new MockGame(mockConfig);
        expect(game).to.be.not.null;
        done();
    });

    let gameToTest: Game;
    beforeEach(() => {
        gameToTest = new MockGame(createMockGameConfigs());
    });

    it('should contain grid words', (done) => {
        const PLAYER = new Player('Homer', 'd0NUt');
        const OPPONENT = new Player('Burns', 'Nucl3ar');
        expect(gameToTest.data.getGridWords(PLAYER, OPPONENT)).to.be.not.null;
        done();
    });

    describe('addPlayer', () => {
        it('should players to the game', () => {
            const GAME = new MockGame({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = new Player('asdf123', '123a');
            const PLAYER2 = new Player('qwertyuiop', '123b');
            GAME.addPlayer(PLAYER1);
            GAME.addPlayer(PLAYER2);
            expect(GAME.isSocketIdInGame(PLAYER1.socketId)).to.be.true;
            expect(GAME.isSocketIdInGame(PLAYER2.socketId)).to.be.true;
        });

        it('should not add more players to the game than the max number of players', () => {
            const GAME1PLAYER = new MockGame({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 1
            });
            const GAME2PLAYERS = new MockGame({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const PLAYER1 = new Player('TAM ARAR', '123a');
            const PLAYER2 = new Player('ERIC CHAO', '123a');
            GAME1PLAYER.addPlayer(PLAYER1);
            expect(() => GAME1PLAYER.addPlayer(PLAYER2)).to.throw;

            GAME2PLAYERS.addPlayer(PLAYER1);
            GAME2PLAYERS.addPlayer(PLAYER2);
            expect(() => GAME2PLAYERS.addPlayer(new Player('PASCAL LACASSE', '123c'))).to.throw;
        });
    });

    describe('matchesFilter', () => {

        it('should return that a game matches a filter if it does', () => {
            const FILTER = new GameFilter(GameMode.Classic, 2);
            const game = new MockGame({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            expect(game.matchesFilter(FILTER)).to.be.true;
        });

        it('should return that a game does not match a filter when it does not', () => {
            const game = new MockGame({
                difficulty: Difficulty.easy,
                gameMode: GameMode.Classic,
                playerNumber: 2
            });
            const FILTER1 = new GameFilter(GameMode.Classic, 1);
            const FILTER2 = new GameFilter(GameMode.Dynamic, 2);
            expect(game.matchesFilter(FILTER1)).to.be.false;
            expect(game.matchesFilter(FILTER2)).to.be.false;
        });

    });

    it('should tell whether a certain player is in the game', () => {
        const GAME = new MockGame({
            difficulty: Difficulty.easy,
            gameMode: GameMode.Classic,
            playerNumber: 2
        });
        const PLAYER1 = new Player('ADAM CÔTÉ', '123a');
        const PLAYER2 = new Player('EMIR BELHADDAD', '123b');
        GAME.addPlayer(PLAYER1);
        GAME.addPlayer(PLAYER2);
        expect(GAME.isSocketIdInGame(PLAYER1.socketId)).to.be.true;
        expect(GAME.isSocketIdInGame(PLAYER2.socketId)).to.be.true;
        expect(GAME.isSocketIdInGame('CHUCK NORRIS')).to.be.false;
    });
});
