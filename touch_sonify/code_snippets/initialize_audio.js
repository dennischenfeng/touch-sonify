// Initialize audioContext for the initialize-audio button
//todo: test
let curData;

let previousPitchFreq = 300;
let apertureNormRadius = 0.2;

let audioCtx;
let oscNode;
let gainNode;

let audioBtn = document.getElementById("audio-button")

audioBtn .addEventListener("click", e => {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	oscNode = audioCtx.createOscillator();
	gainNode = audioCtx.createGain();

	oscNode.type = "sine";
	oscNode.frequency.setValueAtTime(400, audioCtx.currentTime);

	oscNode.connect(gainNode);
	gainNode.connect(audioCtx.destination);
	oscNode.start();
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
});