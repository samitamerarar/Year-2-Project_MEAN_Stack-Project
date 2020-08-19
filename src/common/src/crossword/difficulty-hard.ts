import { Difficulty } from './difficulty';

export class DifficultyHard extends Difficulty {

    public isWordCommon(): boolean {
        return false;
    }

    public toString(): string {
        return 'hard';
    }

}
