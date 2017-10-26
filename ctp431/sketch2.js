//for mic
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
var ee = 1.8; //band energy expansion factor
var bandEng = []; //average energy of each frequency band
var bandCut = [20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480];

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cx = windowWidth/2; //x value of center
  cy = windowHeight/2; //y value of center
  gui = createGui('CONTROL BOX');
  gui.addGlobals('lineColor', 'lineWeight', 'canvasColor', 'decagonColor', 'opacity');
  angleMode(DEGREES);
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  mic.start();
  fft.setInput(mic);
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
