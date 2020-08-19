import { expect } from 'chai';

import { GameManager } from './game-manager';
import { Game } from './game';
import { createMockGameConfigs } from './create-mock-game-configs';

describe('The Game Manager Service', () => {
    it('should be created', (done) => {
        const CONSTRUCTOR = () => GameManager.getInstance();
        expect(CONSTRUCTOR).to.not.throw();
        done();
    });

    const gameManager: GameManager = GameManager.getInstance();
    beforeEach(() => {
        gameManager['games'].clear();
    });

    it('should return an id upon game creation', (done) => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        expect(idObtained).to.be.not.null;
        done();
    });

    it('should creates new games which are accessible by their ids', (done) => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        const foundGame: Game = gameManager.getGame(idObtained);
        expect(foundGame).to.be.not.null;
        done();
    });

    it('should return a game matching a predicate, or null if not found', () => {
        const idObtained = gameManager.newGame(createMockGameConfigs());
        expect(gameManager.getGame(idObtained)).to.not.be.null;
        expect(gameManager.getGame(idObtained - 1)).to.be.null;
    });

    it('should keep track of the number of game created', (done) => {
        const MAX_N = 8;
        const nGames = Math.floor(Math.random() * MAX_N);
        for (let i = 0; i < nGames; i++) {
            gameManager.newGame(createMockGameConfigs());
        }
        expect(gameManager.getNumberOfActiveGames()).to.be.equal(nGames);
        done();
    });

});
