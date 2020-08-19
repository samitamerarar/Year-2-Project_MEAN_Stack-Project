declare interface Math {
    /**
      * Returns a supplied numeric expression rounded to the nearest number.
      * @param x The value to be rounded to the nearest number.
      * @param decimal The number of significant decimals to keep.
      */
    round(x: number, decimal: number): number;
}

const oldRound = Math.round;
Math['round'] = (x: number, decimal: number = 0): number => oldRound(x * (10 ** decimal)) / (10 ** decimal);
