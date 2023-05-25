// Sonification functions

function normalizePosition(pos, lowerBound, upperBound) {
    // Compute the position, normalized within the bounds (lower bound corresponds to 0, upper bound corresponds to 1)
    // Assumes `pos` has binary arithmetic operator methods, like add() and sub(). E.g. Danfojs series.
    // Assumes lowerBound and upperBound are scalars (int or float)
    let numerator = pos.sub(lowerBound);
    let denominator = upperBound - lowerBound;
    return numerator.div(denominator);
};

function normalizePositionScalar(pos, lowerBound, upperBound) {
    // Compute the position, normalized within the bounds (lower bound corresponds to 0, upper bound corresponds to 1)
    // Assumes all params are scalars
    let numerator = pos - lowerBound;
    let denominator = upperBound - lowerBound;
    return numerator / denominator;
};

function getDistance(x1, y1, x2, y2) {
    // Assumes x1 and y1 have binary operator methods, like danfojs series do.
    let expressionX = x1.sub(x2).pow(2);
    let expressionY = y1.sub(y2).pow(2);
    return expressionX.add(expressionY).pow(0.5);
};
