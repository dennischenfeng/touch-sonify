// Sonify the data points within the aperture once
// Assumes xRange, yRange, and dataSource are in the namespace (should be passed in `args` in CustomJS)

let maxNumPoints = 2;
let terminateBeepAtEnd = false;
sonifyAperture(
    cb_obj,
    xRange,
    yRange,
    dataSource,
    appVars,
    maxNumPoints,
    terminateBeepAtEnd,
);
