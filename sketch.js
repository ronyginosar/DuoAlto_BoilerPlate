

let backgroundcolor = 220;
let canvas;

// ===== audio plumbing =====
// let srcMode = "off";   // "off" | "mic" | "file"
let mic, fft, amp, audiofile;
// future: put this in a soundController
var audio;
let micEnabled = false;
// end section

let PRMODE = false; // for debug
let INTERNALAUDIOMODE = false; // for debug
// future make mic and internal mutex
let DEBUG = false; // for debug

let btnMic, btnExport, btnInternalAudio;

// TIME SCALES FOR PARAM CHANGES
let FIVE_SECONDS = 60*5;
let TEN_SECONDS = 60*10;
let TWO_MINUTES = 60*2*60; // 2 minutes


function preload(){
  // TODO
    // audiofile = loadSound('/assets/Alto_score_simulation-for-rony_5th-movement.wav');
}


function setup() {
  if (PRMODE) {
    pixelDensity(10);
  }


  canvas = createCanvas(windowWidth, windowHeight-40); // 40 for buttons
  reset();

  glyphs = generateIntensities(chars);

    
  // ui
  btnMic = createButton("Mic ON/OFF");
  btnExport = createButton("Export");
  btnInternalAudio = createButton("Internal Audio");

  btnExport.mousePressed(() => {saveCanvas('spatial.png');});

  // toggle inputs
  btnMic.mousePressed(toggleMic);
  btnInternalAudio.mousePressed(toggleInternalAudio);

  audio = new p5.AudioIn(); // init as mic, later we can switch to audiofile
  fft = new p5.FFT();
  amp = new p5.Amplitude();
}

function draw() {

  if ((micEnabled || INTERNALAUDIOMODE) && !PRMODE) {

      var ampLevel = amp.getLevel(); // get the level of the audio file
    var waveform = fft.waveform(); 
    fft.analyze();

    reset(); // clean canvas


    
  }
}


// ########## Boiler Helpers #################

function keyPressed() {
  if (keyCode === LEFT_ARROW) {


  } else if (keyCode === RIGHT_ARROW) {


  } else if (keyCode === UP_ARROW) {


  } else if (keyCode === DOWN_ARROW) {

  // } else if (key === ('r' || 'R')) { // 


  }
  // prevent any default behavior.
  return false;
}

function doubleClicked() {
  if (PRMODE) {
    canvas.background(backgroundcolor);
    // TODO draw PR
    noLoop();
  }
  else {
    console.log("Double clicked, not in PRMODE");
  }
}

function reset() {
  canvas.background(backgroundcolor);
}

function toggleMic() {
  console.log("Toggling mic");
    if (micEnabled) {
        console.log("Mic OFF");
        audio.stop();
        fft.setInput();  // reset to default, can't reset amp  
    }
    else {
      console.log("Mic ON");
      audio.start(() => {
        fft.setInput(audio);
        amp.setInput(audio);
      });
    }
      micEnabled = !micEnabled;
}

function toggleInternalAudio() {
  console.log("Toggling internal audio mode");
  try { getAudioContext().resume(); } catch(e) {}
    if (!INTERNALAUDIOMODE) {
      if (micEnabled) { audio.stop(); micEnabled = false; } // <-- simple mutex
        if (!audiofile) { console.warn("No audiofile loaded"); return; }
        audiofile.play();
        fft.setInput(audiofile); //  set the input source for the FFT object to the mic
        amp.setInput(audiofile);
    } else {
      audiofile.pause(); // to continue from where we left off 
      // future make this a toggle between pause and audiofile.stop();
      fft.setInput();   // reset to default, can't reset amp 
    }
  INTERNALAUDIOMODE = !INTERNALAUDIOMODE;
}



