declare interface Math {
    /**
      * Returns the given value if it is between the given interval.
      * Returns the boundery nearest to the clamped value.
      * @param x The value to be clamped.
      * @param min The lower boundary of the interval.
      * @param max The higher boundary of the interval.
      */
    clamp(x: number, min: number, max: number): number;
}

Math.clamp = (x: number, min: number, max: number): number => {
    if (min > max) {
        const swapBuffer = min;
        min = max;
        max = swapBuffer;
    }
    return x < min ? min : (x > max ? max : x);
};
