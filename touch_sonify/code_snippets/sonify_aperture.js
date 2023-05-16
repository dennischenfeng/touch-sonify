// Sonify the data points within the aperture.
// Assumes xRange, yRange, and data are in the namespace (should be passed in `args` in CustomJS)
let xStart = xRange.start;
let yStart = yRange.start;
    let x = cb_obj.x;
    let y = cb_obj.y;
    window.speechSynthesis.cancel();
    // let msg = new SpeechSynthesisUtterance(`x is ${x}, and y is ${y}`)
    let msg = new SpeechSynthesisUtterance(`xsStart is ${xStart}, and yStart is ${yStart}`)
    window.speechSynthesis.speak(msg);