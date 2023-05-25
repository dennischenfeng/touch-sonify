// Sonify the data points within the aperture once
// Assumes xRange, yRange, and dataSource are in the namespace (should be passed in `args` in CustomJS)

// cursor
let xCursor = cb_obj.x;
let yCursor = cb_obj.y;
let xCursorNorm = normalizePositionScalar(xCursor, xRange.start, xRange.end);
let yCursorNorm = normalizePositionScalar(yCursor, yRange.start, yRange.end);

// Dataframe to organize data points
let df = new dfd.DataFrame(dataSource.data);
let cMin = Math.min(...df.c.values);
let cMax = Math.max(...df.c.values);

let xNorms = normalizePosition(df.x, xRange.start, xRange.end);
let yNorms = normalizePosition(df.y, yRange.start, yRange.end);
df = df.addColumn("xNorm", xNorms);
df = df.addColumn("yNorm", yNorms);

let distanceNorms = getDistance(df.xNorm, df.yNorm, xCursorNorm, yCursorNorm);
df = df.addColumn("distanceNorm", distanceNorms);

// Filter df for data within aperture
df = df.query(df.distanceNorm.lt(apertureNormRadius));
if (df.shape[0] > 0) {
    df = df.sortValues("distanceNorm");
};
df = df.resetIndex();

// Play the beeps
let startTime = audioCtx.currentTime;
for (let i = 0; i < df.shape[0]; i++) {
	let c = df.c.values[i];

    let cNorm;
    if (cMin != cMax) {
        cNorm = normalizePositionScalar(c, cMin, cMax);
    } else {
        cNorm = 0.5;
    };

	let distanceNorm = df.distanceNorm.values[i];
	let pitchFreq = pitchFreqRange[0] + cNorm * (pitchFreqRange[1] - pitchFreqRange[0]);
	let gain = (apertureNormRadius - distanceNorm) / apertureNormRadius;

    if (pitchFreq != previousPitchFreq) {
        oscNode.frequency.setValueAtTime(pitchFreq, startTime + i * beepDuration);
        previousPitchFreq = pitchFreq;
    }
	gainNode.gain.setValueAtTime(gain, startTime + i * beepDuration);
	gainNode.gain.setValueAtTime(0, startTime + (i + 1) * beepDuration);
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
    console.log("GET DISTANCE ", x1, y1, x2, y2);
    let expressionX = x1.sub(x2).pow(2);
    let expressionY = y1.sub(y2).pow(2);
    return expressionX.add(expressionY).pow(0.5);
};
