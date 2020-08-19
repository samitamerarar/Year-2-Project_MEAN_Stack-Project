import { Difficulty } from './difficulty';

export class DifficultyNormal extends Difficulty {

    public isWordCommon(): boolean {
        return true;
    }

    public toString(): string {
        return 'normal';
    }

}
