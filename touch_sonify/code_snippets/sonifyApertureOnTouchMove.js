// Sonify data in aperture, continuously playing only the first data point

let maxNumPoints = 1;
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