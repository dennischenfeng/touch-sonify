// Sonify the data points within the aperture.
// Assumes xRange, yRange, and data are in the namespace (should be passed in `args` in CustomJS)

//todo:test
curData = dataSource;

let pitchFreqRange = [300,800];
let beepDuration = 0.2;

let xTap = cb_obj.x;
let yTap = cb_obj.y;
let xTapNorm = normalizePositionScalar(xTap, xRange.start, xRange.end);
let yTapNorm = normalizePositionScalar(yTap, yRange.start, yRange.end);

console.log(`xTapNorm: ${xTapNorm}, yTapNorm: ${yTapNorm}`);
console.log(`xRange: ${xRange.start}, ${xRange.end},      yRange: ${yRange.start}, ${yRange.end}`);

let df = new dfd.DataFrame(dataSource.data);
let xNorms = normalizePosition(df.x, xRange.start, xRange.end);
let yNorms = normalizePosition(df.y, yRange.start, yRange.end);
df = df.addColumn("xNorm", xNorms);
df = df.addColumn("yNorm", yNorms);

let distanceNorms = getDistance(df.xNorm, df.yNorm, xTapNorm, yTapNorm);
df = df.addColumn("distanceNorm", distanceNorms);

console.log("df before wrangle");
df.print();
curData = df;
console.log(`radius: ${apertureNormRadius}`);

let cMin = Math.min(...df.c.values);
let cMax = Math.max(...df.c.values);

// wrangle df
df = df.query(df.distanceNorm.lt(apertureNormRadius));
if (df.shape[0] > 0) {
    df = df.sortValues("distanceNorm");
};
df = df.resetIndex();

console.log("after wrangle");
df.print();



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

    console.log(`cMin: ${cMin}`);
    console.log(`cMax: ${cMax}`);

    console.log(`cNorm: ${cNorm}`);
    console.log(`distanceNorm: ${distanceNorm}`);
    console.log(`gain: ${gain}`);
    console.log(`pitch: ${pitchFreq}`);
	oscNode.frequency.setValueAtTime(pitchFreq, startTime + i * beepDuration);
	gainNode.gain.setValueAtTime(gain, startTime + i * beepDuration);
	gainNode.gain.setValueAtTime(0, startTime + (i + 1) * beepDuration);
};

// window.speechSynthesis.cancel();
// let msg = new SpeechSynthesisUtterance(`x is ${xTap}, and y is ${yTap}`)
// // let msg = new SpeechSynthesisUtterance(`xsStart is ${xStart}, and yStart is ${yStart}`)
// window.speechSynthesis.speak(msg);

function normalizePosition(pos, lowerBound, upperBound) {
    // Compute the position, normalized within the bounds (lower bound corresponds to 0, upper bound corresponds to 1)
    // Assumes `pos` has binary arithmetic operator methods, like add() and sub(). E.g. Danfojs series.
    // Assumes lowerBound and upperBound are numbers (int or float)
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
