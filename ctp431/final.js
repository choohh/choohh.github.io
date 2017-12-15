var cnv = document.getElementById('canvas');
cnv.width  = window.innerWidth;
cnv.height = window.innerHeight+60;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var pitch = [
  ['E', 329.628, 'F', 349.228, 'F#', 369.994, 'G', 391.995, 'G#', 415.305, 'A', 440.000, 'A#', 466.164, 'B', 493.883, 'C', 523.251, 'C#', 554.365, 'D', 587.330, 'D#', 622.254, 'E', 659.255, 'F', 698.456, 'F#', '739.989'],
  ['B', 246.942, 'C', 261.626, 'C#', 277.183, 'D', 293.665, 'D#', 311.127, 'E', 329.628, 'F', 349.228, 'F#', 369.994, 'G', 391.995, 'G#', 415.305, 'A', 440.000, 'A#', 466.164, 'B', 493.883, 'C', 523.251, 'C#', 554.365],
  ['G', 195.998, 'G#', 207.652, 'A', 220.000, 'A#', 233.082, 'B', 246.942, 'C', 261.626, 'C#', 277.183, 'D', 293.665, 'D#', 311.127, 'E', 329.628, 'F', 349.228, 'F#', 369.994, 'G', 391.995, 'G#', 415.305, 'A', 440.000],
  ['D', 146.832, 'D#', 155.563, 'E', 164.814, 'F', 174.614, 'F#', 184.997, 'G', 195.998, 'G#', 207.652, 'A', 220.000, 'A#', 233.082, 'B', 246.942, 'C', 261.626, 'C#', 277.183, 'D', 293.665, 'D#', 311.127, 'E', 329.628],
  ['A', 110.000, 'A#', 116.541, 'B', 123.471, 'C', 130.813, 'C#', 138.591, 'D', 146.832, 'D#', 155.563, 'E', 164.814, 'F', 174.614, 'F#', 184.997, 'G', 195.998, 'G#', 207.652, 'A', 220.000, 'A#', 233.082, 'B', 246.942],
  ['E', 82.4069, 'F', 87.3071, 'F#', 92.4986, 'G', 97.9989, 'G#', 103.826, 'A', 110.000, 'A#', 116.541, 'B', 123.471, 'C', 130.813, 'C#', 138.591, 'D', 146.832, 'D#', 155.563, 'E', 164.814, 'F', 174.614, 'F#', 184.997]
];
var check = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var gamestart = 0; //0 : not yet, 1:yes it began!
var restart = 0;
var order = 0;
var score = 0;
var progress = 0;
var startfret = 0; //default setting. this will be changed randomly
var chordpitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var chordtype = ['maj', [4, 7], 'min', [3, 7], 'maj7', [4, 7, 11], 'min7', [3, 7, 10]]; //2nd order arrays mean fret interval of each notes from bass note
//interval : 0, 2, 4, 5, 7, 9, 11
var correctAns = [];
var userAns = [];
var d1, d2, n1, n2 = 0; //for timer
var onlyoneinline = [0, 0, 0, 0, 0, 0];

function cal_fret(n) { //this function calculates the location of nth fret (length from the left end)
  return 4*(cnv.width-100)/(4-Math.pow(2, 5/6)) - Math.exp(Math.log(4*(cnv.width-100)/(4-Math.pow(2, 5/6)))-(n/12)*Math.log(2));
}

function init_drawing() {
  var background = cnv.getContext('2d');
  background.beginPath();
  background.rect(0, 0, cnv.width-4, cnv.height);
  background.fillStyle = '#E0ECF8';
  background.fill();

  var title = cnv.getContext('2d');
  title.font = 'bold 55px Trebuchet MS'
  title.fillStyle = 'black';
  title.fillText('CHORD BUILDER', 25, 70);
  title.font = '20px Trebuchet MS'
  title.fillText('Created by Heonho Choo', 450, 45);
  title.fillText('Please enjoy and be the master of guitar chords! :-)', 450, 70);

  var scoreboard = cnv.getContext('2d');
  scoreboard.beginPath();
  scoreboard.rect(560, 330, 270, 254);
  scoreboard.fillStyle = '#0070c0';
  scoreboard.fill();

  var namepad = cnv.getContext('2d');
  namepad.font = '30px Trebuchet MS'
  namepad.fillStyle = 'white';
  namepad.fillText('Progress : ', 580, 387);
  namepad.fillText('Score     : ', 580, 467);
  namepad.fillText('Time      : ', 580, 547);

  var fretboard = cnv.getContext('2d');
  fretboard.beginPath();
  fretboard.rect(27, 100, cnv.width-100, 204);
  fretboard.fillStyle = '#E6B749';
  fretboard.fill();
  fretboard.lineWidth = 1;
  fretboard.strokeStyle = 'black';
  fretboard.stroke();

  var dot1 = cnv.getContext('2d');
  dot1.beginPath();
  dot1.fillStyle = 'white';
  dot1.arc(27 + (cal_fret(2)+cal_fret(3))/2,202,12,0,2*Math.PI);
  dot1.arc(27 + (cal_fret(4)+cal_fret(5))/2,202,12,0,2*Math.PI);
  dot1.arc(27 + (cal_fret(6)+cal_fret(7))/2,202,12,0,2*Math.PI);
  dot1.arc(27 + (cal_fret(8)+cal_fret(9))/2,202,12,0,2*Math.PI);
  dot1.fill();
  var dot2 = cnv.getContext('2d');
  dot2.beginPath();
  dot2.fillStyle = 'white';
  dot2.arc(27 + (cal_fret(11)+cal_fret(12))/2,152,12,0,2*Math.PI);
  dot2.arc(27 + (cal_fret(11)+cal_fret(12))/2,252,12,0,2*Math.PI);
  dot2.fill();

  var fret = cnv.getContext('2d');
  fret.beginPath();
  fret.lineWidth = 6;
  fret.strokeStyle = 'black';
  for (i=1; i<14; i=i+1) {
    fret.moveTo(27 + cal_fret(i), 100);
    fret.lineTo(27 + cal_fret(i), 304);
  }
  fret.stroke();

  var line = cnv.getContext('2d');
  for (i=0; i<6; i=i+1) {
    line.beginPath();
    line.lineWidth = 1+0.25*Math.pow(i,1.3);
    line.moveTo(27, 117+34*i);
    line.lineTo(cnv.width-73, 117+34*i);
    line.stroke();
  }

  var nubjuk = cnv.getContext('2d');
  var img = new Image();
  img.onload = function () {
    nubjuk.drawImage(img, 27, 330, 300, 173);
  }
  img.src = "teacher.png";
  img.onload();
}

function setup() {
  var playboard = createCanvas(window.innerWidth, window.innerHeight-4);
  playboard.position(0, 0);
}

function mouseClicked() {
  var x = mouseX;
  var y = mouseY;
  var tempfret = 0;
  if (x < cnv.width-100 && y > 100 && y < 304) {
    if(x > 25 && x < 25+cal_fret(1)) {
      tempfret = 1;
    }
    for(i=2; i<15; i=i+1) {
      if(x > 25+cal_fret(i-1) && x < 25+cal_fret(i)) {
        tempfret = i;
      }
    }
    if (check[parseInt((y-100)/34)].indexOf(1) >= 0) {
      onlyoneinline[parseInt((y-100)/34)] = 1;
    }

    var osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = pitch[parseInt((y-100)/34)][2*tempfret+1]; // value in hertz
    osc.connect(audioCtx.destination);
    if (check[parseInt((y-100)/34)][tempfret] == 0) {
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    }

    if(gamestart == 1 && tempfret > startfret-1 && tempfret < startfret+4) {
      if(check[parseInt((y-100)/34)][tempfret] == 0 && onlyoneinline[parseInt((y-100)/34)] == 0) {
        check[parseInt((y-100)/34)][tempfret] = 1;
        userAns.push(pitch[parseInt((y-100)/34)][2*tempfret]);
      } else if (check[parseInt((y-100)/34)][tempfret] == 1) {
        var index = userAns.indexOf(pitch[parseInt((y-100)/34)][2*tempfret]);
        userAns.splice(index, 1);
        check[parseInt((y-100)/34)][tempfret] = 0;
        onlyoneinline[parseInt((y-100)/34)] = 0;
      }
      console.log(userAns);
      console.log(check);
    }
  }
  return false;
}

function draw() {
  clear();
  for (i=0; i<6; i=i+1) {
    for (j=startfret; j<startfret+4; j=j+1) {
      if (check[i][j] == 1) {
        if (j==0) {
          fill('white');
          ellipse(13, 117+34*i, 25, 25);
        } else {
          fill('white');
          ellipse(27+(cal_fret(j)+cal_fret(j-1))/2, 117+34*i, 27, 27);
        }
      }
    }
  }
}

function setrange() {
    startfret = parseInt(random(12));
    var range = cnv.getContext('2d');
    if (startfret == 0) {
      range.beginPath();
      range.globalAlpha = 0.3;
      range.rect(0, 100, 27+cal_fret(3), 204);
      range.fillStyle = 'black';
      range.fill();
      range.globalAlpha = 1.0
    } else {
      range.beginPath();
      range.globalAlpha = 0.3;
      range.rect(27+cal_fret(startfret-1), 100, cal_fret(startfret+3)-cal_fret(startfret-1), 204);
      range.fillStyle = 'black';
      range.fill();
      range.globalAlpha = 1.0
    }
}

function decideChord() {
  var num1 = parseInt(random(12));
  var num2 = parseInt(random(4));
  correctAns.push(chordpitch[num1]);
  for(i=0; i<chordtype[2*num2+1].length; i=i+1) {
    correctAns.push(chordpitch[(num1 + chordtype[2*num2+1][i])%12]);
  }
  var showchordbg = cnv.getContext('2d');
  showchordbg.beginPath();
  showchordbg.moveTo(350, 370);
  showchordbg.lineTo(350, 410);
  showchordbg.lineTo(320, 440);
  showchordbg.lineTo(370, 430);
  showchordbg.lineTo(520, 430);
  showchordbg.lineTo(520, 370);
  showchordbg.lineTo(350, 370);
  //showchordbg.rect(350, 400, 160, 60);
  showchordbg.fillStyle = 'white';
  showchordbg.fill();
  showchordbg.lineWidth = 3;
  showchordbg.strokeStyle = '#545362';
  showchordbg.stroke();

  var showchord = cnv.getContext('2d');
  showchord.font = 'bold 40px Trebuchet MS';
  showchord.fillStyle = 'black';
  showchord.fillText(chordpitch[num1] + chordtype[2*num2], 365, 413);
  //showpitch.fillText(pitch[parseInt((mouseY-100)/34)][2*tempfret], 347, 420)
  console.log('Answer is '+correctAns);
}

function notinArray(needle, haystack) {
  if (haystack.length == 0) {return true;}
  else {
    for(j=0; j<haystack.length; j=j+1) {
      if (haystack[j]==needle) {return false;}
    }
    return true;
  }
}

function checkAns(arr1, arr2) {
  var new1 = [];
  var new2 = [];
  if (arr1.length == 0 && arr2.length == 0) {return true;}
  else if (arr1.length == 0 || arr2.length == 0) {return false;}
  else {
    for (i=0; i < arr1.length; i=i+1) {
      if (notinArray(arr1[i], new1)) {new1.push(arr1[i]);} }
    for (i=0; i < arr2.length; i=i+1) {
      if (notinArray(arr2[i], new2)) {new2.push(arr2[i]);
      } else {}
    }
    new1.sort();
    new2.sort();
    if (new1.length != new2.length) {
      return false;
    } else {
      for (i=0; i < new1.length; i=i+1) {
        if (new1[i] != new2[i]) {return false;}
      }
      return true;
    }
  }
}

function showProgress() {
  var progressbg = cnv.getContext('2d');
  progressbg.beginPath();
  progressbg.rect(730, 355, 80, 40);
  progressbg.fillStyle = '#0070c0';
  progressbg.fill();

  var progresstxt = cnv.getContext('2d');
  progresstxt.font = '30px Trebuchet MS';
  progresstxt.fillStyle = 'white';
  progresstxt.fillText(progress, 740, 387);
}

function showScore() {
  var scorebg = cnv.getContext('2d');
  scorebg.beginPath();
  scorebg.rect(730, 437, 80, 40);
  scorebg.fillStyle = '#0070c0';
  scorebg.fill();

  var scoretxt = cnv.getContext('2d');
  scoretxt.font = '30px Trebuchet MS';
  scoretxt.fillStyle = 'white';
  scoretxt.fillText(score, 740, 467);
}

function submit() {
  if (checkAns(correctAns, userAns)) {
      score = score + 10;
      progress = progress + 1;
      gamestart = 0;
      check = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]; //reset check
      d2 = new Date();
      n2 = d2.getTime();

      init_drawing();
      showProgress();
      showScore();

      var timebg = cnv.getContext('2d');
      timebg.beginPath();
      timebg.rect(730, 520, 80, 50);
      timebg.fillStyle = '#0070c0';
      timebg.fill();

      var timetxt = cnv.getContext('2d');
      timetxt.font = '30px Trebuchet MS';
      timetxt.fillStyle = 'white';
      timetxt.fillText(parseInt((n2-n1)/1000) + 's', 740, 547);

      correctAns = [];
      userAns = [];
      onlyoneinline = [0, 0, 0, 0, 0, 0];
  } else {
    alert("Wrong! Try again.");
  }
}

function playonce(n) {
  gamestart = 1;
  setrange();
  decideChord(n);
  return false;
}

function playGame1() {
  showProgress();
  showScore();
  if (gamestart == 0) {
    d1 = new Date();
    n1 = d1.getTime();
    //for (i=0; i<6; i=i+1) {
    playonce(0);
    //startgame = 0;
    //'check array' reset
  } else if (gamestart ==1) {
    alert("Wait! Game is now ongoing. First finish the ongoing stage!");
  }
}

/*
function playGame2() {
  d2 = new Date();
  n2 = d2.getTime();
  text((n2-n1)/1000, 600, 700);
  return false;
}
*/

init_drawing();
