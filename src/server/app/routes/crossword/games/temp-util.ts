import { Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { Difficulty as GeneratorDifficulty } from '../../../../../common/src/crossword/difficulty';
import { DifficultyEasy } from '../../../../../common/src/crossword/difficulty-easy';
import { DifficultyNormal } from '../../../../../common/src/crossword/difficulty-normal';
import { DifficultyHard } from '../../../../../common/src/crossword/difficulty-hard';

export function toGridGeneratorDifficulty(difficulty: Difficulty): GeneratorDifficulty {
    switch (difficulty) {
        case Difficulty.easy: return new DifficultyEasy();
        case Difficulty.normal: return new DifficultyNormal();
        case Difficulty.hard: return new DifficultyHard();
        default: throw new Error(`Unknown difficulty: ${difficulty}`);
    }
}
