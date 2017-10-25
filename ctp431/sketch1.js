//for sample music
var canvasColor = '#78BDEE';
var lineColor = [255, 255, 255]
var decagonColor = '#001f4d';
var lineWeight = 3
var lineWeightMin = 0.1;
var lineWeightMax = 10;
var lineWeightStep = 0.1;
var opacity = 150;
var opacityMax = 255;
var gui;
var cx = "global";
var cy = "global";
var cs = 60; //Circle Size(radius)
var le = 1000; //Line Expansion factor
var ee = 2; //band energy expansion factor
var bandEng = []; //average energy of each frequency band
var bandCut = [20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480];

function preload() {
  sound = loadSound('./Right_here_waiting_for_you.mp3');
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cx = windowWidth/2; //x value of center
  cy = windowHeight/2; //y value of center
  gui = createGui('CONTROL BOX');
  gui.addGlobals('lineColor', 'lineWeight', 'canvasColor', 'decagonColor', 'opacity');
  angleMode(DEGREES);
  fft = new p5.FFT();
  sound.amp(0.7);
  cnv.mouseClicked(PlayOrPause);
}

function draw() {
  background(canvasColor);
  noFill();
  stroke(lineColor);
  strokeWeight(lineWeight);
  for (i = 1; i < sqrt(cx*cx + cy*cy); i++) {
    ellipse(cx, cy, cs*i, cs*i);
  }
  for (j = 0; j < 5; j++) {
    line(cx+le*sin(18+36*j), cy-le*cos(18+36*j), cx-le*sin(18+36*j), cy+le*cos(18+36*j))
  }
  push();
  stroke(rgb(0,0,0));
  line(cx, cy, cx+100*sin(18), cy-100*cos(18));
  pop();
  
  soundanl();

  var c = color(decagonColor);
  fill(red(c), green(c), blue(c), opacity);
  //noStroke();
  beginShape();
  for (i = 0; i < 10; i++) {
    vertex(cx+ee*bandEng[i]*sin(18+36*i), cy-ee*bandEng[i]*cos(18+36*i));
  }
  vertex(cx+ee*bandEng[0]*sin(18), cy-ee*bandEng[0]*cos(18));
  endShape();
}

function soundanl() {
  var spectrum = fft.analyze();
  for (i = 0; i < 10; i++) {
    bandEng[i] = fft.getEnergy(bandCut[i], bandCut[i+1]);
  }
}

function PlayOrPause() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
