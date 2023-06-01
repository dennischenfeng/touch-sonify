// Initialize audioCtx object, which handles generating audio waveforms.
appVars.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
appVars.oscNode = appVars.audioCtx.createOscillator();
appVars.gainNode = appVars.audioCtx.createGain();

appVars.oscNode.type = "sine";
appVars.oscNode.frequency.setValueAtTime(400, appVars.audioCtx.currentTime);

appVars.oscNode.connect(appVars.gainNode);
appVars.gainNode.connect(appVars.audioCtx.destination);
appVars.oscNode.start();
appVars.gainNode.gain.setValueAtTime(0, appVars.audioCtx.currentTime + 0.5);
