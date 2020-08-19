export class WordPosition {

    public row: number;
    public column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }

    public equals(that: WordPosition): boolean {
        return this.row === that.row &&
               this.column === that.column;
    }

    public clone(): WordPosition {
        return new WordPosition(this.row, this.column);
    }

}
