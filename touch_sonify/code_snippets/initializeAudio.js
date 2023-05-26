// Initialize audioContext for the initialize-audio button

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

let audioBtn = document.getElementById("audio-button")

audioBtn .addEventListener("click", e => {
	appVars.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	appVars.oscNode = appVars.audioCtx.createOscillator();
	appVars.gainNode = appVars.audioCtx.createGain();

	appVars.oscNode.type = "sine";
	appVars.oscNode.frequency.setValueAtTime(400, appVars.audioCtx.currentTime);

	appVars.oscNode.connect(appVars.gainNode);
	appVars.gainNode.connect(appVars.audioCtx.destination);
	appVars.oscNode.start();
	appVars.gainNode.gain.setValueAtTime(0, appVars.audioCtx.currentTime + 0.5);
});
