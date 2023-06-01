// Initialize appVars, which will be used by the events triggered by bokeh

let appVars = {
	previousPitchFreq : 300,
	apertureNormRadius: 0.2,
	pitchFreqRange: [300, 800],
	beepDuration: 0.5,
	AudioCtx: null,
	oscNode: null,
	gainNode: null,
	origXStart: null,
	origYStart: null,
	origXEnd: null,
	origYEnd: null,
};
