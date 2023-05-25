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

