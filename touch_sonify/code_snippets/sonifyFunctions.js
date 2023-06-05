// Sonification functions

function sonifyAperture(
    cb_obj,
    xRange,
    yRange,
    dataSource,
    appVars,
    maxNumPoints=10,
    terminateBeepAtEnd=true,
) {
    // cursor
    let xCursor = cb_obj.x;
    let yCursor = cb_obj.y;
    let xCursorNorm = normalizePositionScalar(xCursor, xRange.start, xRange.end);
    let yCursorNorm = normalizePositionScalar(yCursor, yRange.start, yRange.end);

    // Dataframe to organize data points
    let df = new dfd.DataFrame(dataSource.data);
    let zMin = Math.min(...df.z.values);
    let zMax = Math.max(...df.z.values);

    let xNorms = normalizePosition(df.x, xRange.start, xRange.end);
    let yNorms = normalizePosition(df.y, yRange.start, yRange.end);
    df = df.addColumn("xNorm", xNorms);
    df = df.addColumn("yNorm", yNorms);

    let distanceNorms = getDistance(df.xNorm, df.yNorm, xCursorNorm, yCursorNorm);
    df = df.addColumn("distanceNorm", distanceNorms);

    // Filter df for data within aperture
    df = df.query(df.distanceNorm.lt(appVars.apertureNormRadius));
    if (df.shape[0] > 0) {
        df = df.sortValues("distanceNorm");
    };
    df = df.resetIndex();

    // Play the beeps
    let numPoints = Math.min(maxNumPoints, df.shape[0])
    let startTime = appVars.audioCtx.currentTime;
    if (numPoints == 0) {
        appVars.gainNode.gain.setValueAtTime(0, startTime);
    };

    for (let i = 0; i < numPoints; i++) {
        let z = df.z.values[i];

        let zNorm;
        if (zMin != zMax) {
            zNorm = normalizePositionScalar(z, zMin, zMax);
        } else {
            zNorm = 0.5;
        };

        let distanceNorm = df.distanceNorm.values[i];
        let pitchFreq = appVars.pitchFreqRange[0] + zNorm * (appVars.pitchFreqRange[1] - appVars.pitchFreqRange[0]);
        let gain = (appVars.apertureNormRadius - distanceNorm) / appVars.apertureNormRadius;

        if (pitchFreq != appVars.previousPitchFreq) {
            appVars.oscNode.frequency.setValueAtTime(pitchFreq, startTime + i * appVars.beepDuration);
            appVars.previousPitchFreq = pitchFreq;
        }
        appVars.gainNode.gain.setValueAtTime(gain, startTime + i * appVars.beepDuration);
    };

    if (terminateBeepAtEnd) {
        appVars.gainNode.gain.setValueAtTime(0, startTime + numPoints * appVars.beepDuration);
    };
};

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
