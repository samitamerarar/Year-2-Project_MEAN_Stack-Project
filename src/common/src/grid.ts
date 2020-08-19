import { Word } from './word';

export class Grid {
    public static readonly DIMENSIONS = 10;
    public static readonly BLACK_TILE = '0';
    public static readonly EMPTY_TILE = ' ';
    public horizontalWords: Word[];
    public verticalWords: Word[];
}
