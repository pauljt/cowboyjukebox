
function AudioDataDestination(sampleRate, readFn) {
  // Initialize the audio output.
  var audio = new Audio();
  audio.mozSetup(1, sampleRate);

  var currentWritePosition = 0;
  var prebufferSize = sampleRate / 2; // buffer 500ms
  var tail = null;

  // The function called with regular interval to populate
  // the audio output buffer.
  setInterval(function() {
    var written;
    // Check if some data was not written in previous attempts.
    if(tail) {
      written = audio.mozWriteAudio(tail);
      currentWritePosition += written;
      if(written < tail.length) {
        // Not all the data was written, saving the tail...
        tail = tail.subarray(written);
        return; // ... and exit the function.
      }
      tail = null;
    }

    // Check if we need add some data to the audio output.
    var currentPosition = audio.mozCurrentSampleOffset();
    var available = currentPosition + prebufferSize - currentWritePosition;
    if(available > 0) {
      // Request some sound data from the callback function.
      var soundData = new Float32Array(parseFloat(available));
      readFn(soundData);

      // Writing the data.
      written = audio.mozWriteAudio(soundData);
      if(written < soundData.length) {
        // Not all the data was written, saving the tail.
        tail = soundData.slice(written);
      }
      currentWritePosition += written;
    }
  }, 100);
}

// Control and generate the sound.
var currentSoundSample;
var sampleRate = 44100;

function getS(f) {
  return 2 * Math.PI * f / sampleRate;
}

function requestSoundData(soundData) {
  var k = getS(tracks[0]);
  for (var i = 0, size = soundData.length; i < size; i++) {
    soundData[i] = Math.sin(k * currentSoundSample++);
  }

  // for (var i=0, size=soundData.length; i<size; i++) {
  //   // var components = 0.0;

  //   // for (var j = 0; j < tracks.length; j++) {
  //   //   components +=
  //   // }

  //   soundData[i] = Math.sin(tracks[0] * currentSoundSample++);
  //   //currentSoundSample++;
  // }
}

var audioDestination = new AudioDataDestination(sampleRate, requestSoundData);
var stopped = 0;
var tracks = [400.0, 0.0, 0.0, 0.0, 0.0];

function start() {
  currentSoundSample = 0;
  stopped = 0;
}

function alterFreq(i, freq) {
  if (!stopped) {
    tracks[i] = parseFloat(freq);
    if(freqnode){
       freqnode.textContent = tracks.join(",");
    }

  } else {
    tracks[i] = 0;
  }
}

function stop() {
  stopped = 1;
}