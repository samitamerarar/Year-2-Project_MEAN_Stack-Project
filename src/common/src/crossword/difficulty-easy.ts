import { Difficulty } from './difficulty';

export class DifficultyEasy extends Difficulty {

    public isWordCommon(): boolean {
        return true;
    }

    public toString(): string {
        return 'easy';
    }

}
