import { GameData, DefinitionWithIndex } from './game-data';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';
import { Player } from '../player';
import { Grid } from '../grid-generator/grid';

interface MutationData {
    grid: Grid;
    definitions: DefinitionWithIndex[];
}

export class GameDataDynamic extends GameData {

    private mutator: GridMutator;
    private mutationPromise: Promise<MutationData>;

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.mutator = new GridMutator(toGridGeneratorDifficulty(difficulty));
        this.startMutatingGrid();
    }

    public applyMutation(): Promise<void> {
        const promise = this.mutationPromise.then(mutationData => {
            this.grid = mutationData.grid;
            this.definitionsInternal = mutationData.definitions;
            this.startMutatingGrid();
        });
        return promise;
    }

    protected get mutatedGrid(): Promise<Grid> {
        return new Promise((resolve, reject) => {
            this.mutationPromise.then(mutationData => {
                if (mutationData.grid !== null) {
                    resolve(mutationData.grid);
                }
                else {
                    reject('[GameDataDynamic]: Grid generation cancelled');
                }
            });
        });
    }

    public validateWord(wordGuess: GridWord, player: Player): boolean {
        const validated = super.validateWord(wordGuess, player);

        if (validated) {
            this.mutator.cancelMutation();
            if (this.wordsLeftToFind.length > 0) {
                this.startMutatingGrid();
            }
        }

        return validated;
    }

    private startMutatingGrid(): void {
        const promise = this.mutator.mutateGrid(
            this.grid.words
                .filter(word => word.owner !== Player.NO_PLAYER)
        );

        this.mutationPromise = promise.then(grid => {
            if (grid !== null) {
                return this.fetchDefinitionsOf(grid).then(definitions => {
                    return {
                        grid: grid,
                        definitions: definitions
                    };
                });
            }
            else {
                // Mutation cancelled ; don't change our data.
                return this.mutationPromise;
            }
        });
    }

}
