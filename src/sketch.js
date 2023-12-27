// Sound objects
let sound,
  originSound,
  lowpassFilter,
  dynamicCompressor,
  reverb,
  waveshaper,
  masterVolume,
  fft,
  fftoutput;

// playback controls
let pauseButton;
let playButton;
let stopButton;
let skipStartButton;
let skipEndButton;
let loopButton;
let recordButton;

// low-pass filter
let lp_cutOffSlider;
let lp_resonanceSlider;
let lp_dryWetSlider;
let lp_outputSlider;

// dynamic compressor
let dc_attackSlider;
let dc_kneeSlider;
let dc_releaseSlider;
let dc_ratioSlider;
let dc_thresholdSlider;
let dc_dryWetSlider;
let dc_outputSlider;

// master volume
let mv_volumeSlider;

// reverb
let rv_durationSlider;
let rv_decaySlider;
let rv_dryWetSlider;
let rv_outputSlider;
let rv_reverseButton;

// waveshaper distortion
let wd_amountSlider;
let wd_oversampleSlider;
let wd_dryWetSlider;
let wd_outputSlider;

function preload() {
  sound = loadSound("../assets/sound.wav");
}

function setup() {
  createCanvas(800, 600);
  background(180);
  initSound();
  gui_configuration();
  sondControlConfig();
}

function initSound() {
  // Initialize p5.sound objects
  fft = new p5.FFT();
  fftoutput = new p5.FFT();

  lowpassFilter = new p5.LowPass();
  dynamicCompressor = new p5.Compressor();
  reverb = new p5.Reverb();
  waveshaper = new p5.Distortion();

  // Connect the effects in the desired order
  sound.disconnect(); // Disconnect from the default output
  fft.setInput(sound);

  sound.connect(lowpassFilter);
  const soundChain = lowpassFilter.chain(waveshaper)
  // const soundchain = lowpassFilter.chain(waveshaper, dynamicCompressor, reverb);
  fftoutput.setInput(soundChain)
  // fftoutput.setInput(lowpassFilter)
}

function draw() {
   // Map mouseX to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  const filterFreq = map(lp_cutOffSlider.value(), 0, 1, 10, 22050);

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  const filterRes = map(lp_resonanceSlider.value(), 0, 1, 15, 5);
  lowpassFilter.set(filterFreq, filterRes)
  lowpassFilter.drywet(lp_dryWetSlider.value());
  lowpassFilter.amp(lp_outputSlider.value());

  // TODO: change oversample value
  waveshaper.set(wd_amountSlider.value(), 'none')
  waveshaper.drywet(wd_dryWetSlider.value());
  waveshaper.amp(wd_outputSlider.value())

  // draw the visuals
  drawSpectrum(fft, 560, 210, 200, 100);
  drawSpectrum(fftoutput, 560, 355, 200, 100);
}

// functionality

function sondControlConfig() {
  playButton.mousePressed(play);
  stopButton.mousePressed(stop);
  pauseButton.mousePressed(pause);
  skipStartButton.mousePressed(skipToStart);
  skipEndButton.mousePressed(skipToEnd);
  loopButton.mousePressed(loopSound);
}

function play() {
  if (!sound.isPlaying()) {
    sound.play();
  }
}

function stop() {
  if (sound.isPlaying()) {
    sound.stop();
  }
}

function pause() {
  if (sound.isPlaying()) {
    sound.pause()
  }
}

function skipToStart() {
  sound.jump(0);
}

function skipToEnd() {
  sound.jump(sound.duration() - 0.00000000001)
}

function loopSound() {
  sound.setLoop(!sound.isLooping())
}

function gui_configuration() {
  // Playback controls
  pauseButton = createButton("pause");
  pauseButton.position(10, 20);
  playButton = createButton("play");
  playButton.position(70, 20);
  stopButton = createButton("stop");
  stopButton.position(120, 20);
  skipStartButton = createButton("skip to start");
  skipStartButton.position(170, 20);
  skipEndButton = createButton("skip to end");
  skipEndButton.position(263, 20);
  loopButton = createButton("loop");
  loopButton.position(352, 20);
  recordButton = createButton("record");
  recordButton.position(402, 20);

  // Important: you may have to change the slider parameters (min, max, value and step)

  // low-pass filter
  textSize(14);
  text("low-pass filter", 10, 80);
  textSize(10);
  lp_cutOffSlider = createSlider(0, 1, 0.5, 0.01);
  lp_cutOffSlider.position(10, 110);
  text("cutoff frequency", 10, 105);
  lp_resonanceSlider = createSlider(0, 1, 0.5, 0.01);
  lp_resonanceSlider.position(10, 155);
  text("resonance", 10, 150);
  lp_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  lp_dryWetSlider.position(10, 200);
  text("dry/wet", 10, 195);
  lp_outputSlider = createSlider(0, 1, 0.5, 0.01);
  lp_outputSlider.position(10, 245);
  text("output level", 10, 240);

  // dynamic compressor
  textSize(14);
  text("dynamic compressor", 210, 80);
  textSize(10);
  dc_attackSlider = createSlider(0, 1, 0.5, 0.01);
  dc_attackSlider.position(210, 110);
  text("attack", 210, 105);
  dc_kneeSlider = createSlider(0, 1, 0.5, 0.01);
  dc_kneeSlider.position(210, 155);
  text("knee", 210, 150);
  dc_releaseSlider = createSlider(0, 1, 0.5, 0.01);
  dc_releaseSlider.position(210, 200);
  text("release", 210, 195);
  dc_ratioSlider = createSlider(0, 1, 0.5, 0.01);
  dc_ratioSlider.position(210, 245);
  text("ratio", 210, 240);
  dc_thresholdSlider = createSlider(0, 1, 0.5, 0.01);
  dc_thresholdSlider.position(360, 110);
  text("threshold", 360, 105);
  dc_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  dc_dryWetSlider.position(360, 155);
  text("dry/wet", 360, 150);
  dc_outputSlider = createSlider(0, 1, 0.5, 0.01);
  dc_outputSlider.position(360, 200);
  text("output level", 360, 195);

  // master volume
  textSize(14);
  text("master volume", 560, 80);
  textSize(10);
  mv_volumeSlider = createSlider(0, 1, 0.5, 0.01);
  mv_volumeSlider.position(560, 110);
  text("level", 560, 105);

  // reverb
  textSize(14);
  text("reverb", 10, 305);
  textSize(10);
  rv_durationSlider = createSlider(0, 1, 0.5, 0.01);
  rv_durationSlider.position(10, 335);
  text("duration", 10, 330);
  rv_decaySlider = createSlider(0, 1, 0.5, 0.01);
  rv_decaySlider.position(10, 380);
  text("decay", 10, 375);
  rv_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  rv_dryWetSlider.position(10, 425);
  text("dry/wet", 10, 420);
  rv_outputSlider = createSlider(0, 1, 0.5, 0.01);
  rv_outputSlider.position(10, 470);
  text("output level", 10, 465);
  rv_reverseButton = createButton("reverb reverse");
  rv_reverseButton.position(10, 510);

  // waveshaper distortion
  textSize(14);
  text("waveshaper distortion", 210, 305);
  textSize(10);
  wd_amountSlider = createSlider(0, 1, 0.5, 0.01);
  wd_amountSlider.position(210, 335);
  text("distortion amount", 210, 330);
  wd_oversampleSlider = createSlider(0, 1, 0.5, 0.01);
  wd_oversampleSlider.position(210, 380);
  text("oversample", 210, 375);
  wd_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  wd_dryWetSlider.position(210, 425);
  text("dry/wet", 210, 420);
  wd_outputSlider = createSlider(0, 1, 0.5, 0.01);
  wd_outputSlider.position(210, 470);
  text("output level", 210, 465);

  // spectrums
  textSize(14);
  text("spectrum in", 560, 200);
  text("spectrum out", 560, 345);
}

function Slider() {
  const slider = createSlider(0, 1, 0.5, 0.01);
  slider.position(210, 470);
  text("output level", 210, 465);
}

function drawSpectrum(fft, x, y, w, h) {
  let spectrum = fft.analyze();

  // reset the spectrum rectangle
  fill(255);
  rect(x, y, w, h);

  beginShape();
  noFill();
  stroke(0); // Set the stroke color to black

  for (let i = 0; i < spectrum.length; i++) {
    const barX = map(i, 0, spectrum.length, x, x + w); // Distribute bars evenly along the x-axis
    const barY = map(spectrum[i], 0, 255, y + h, y); // Map the spectrum values to the height of the canvas

    vertex(barX, barY);
  }

  endShape();
}
