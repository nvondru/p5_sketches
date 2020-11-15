let clocks = [];

let tickSound;
let tickFilter;

let speedModifier = 1;
let p5Framerate = 60;

let soundEnabled = false;
let clickedX;
let clickedY;
let currentTime;

let tempClock;

function preload() {
  soundFormats("mp3", "ogg");
  tickSound = loadSound("./assets/tickSound");
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent("p5Container");
  canvas.mousePressed(canvasMousePressed);
  canvas.mouseReleased(canvasMouseReleased);
  angleMode(DEGREES);
  rectMode(CENTER);
  tickFilter = new p5.LowPass();
  tickFilter.freq(2000);
  tickSound.amp(0.1 / (speedModifier * 0.5));
}

function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(10);
  rect(width / 2, height / 2, width, height);
  frameRate(p5Framerate);
  clockPageController.updateActualFrameRateDisplay(
    Math.round(p5Framerate * (1 / (p5Framerate * (deltaTime / 1000))))
  );

  for (let i = 0; i < clocks.length; i++) {
    clocks[i].tick();
  }

  if (clickMode == CLICK_MODES.create) {
    push();
    tempClock.preview();
    pop();
  }
}

function canvasMousePressed() {
  if (clickMode == CLICK_MODES.definePosition) {
    clickMode = CLICK_MODES.create;

    if (clocks.length === 0) {
      currentTime =
        new Date().getHours() * 3600 +
        new Date().getMinutes() * 60 +
        new Date().getSeconds();
    }

    tempClock = new Clock(mouseX, mouseY, 0, currentTime);
  }
}

function canvasMouseReleased() {
  if (clickMode === CLICK_MODES.create) {
    clickMode = CLICK_MODES.default;
    clocks.push(tempClock);
    tempClock = {};
  }
}
class Clock {
  constructor(x, y, size, initialTime) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.initialTime = initialTime;

    // this.hourTicks = [];
    // this.minuteTicks = [];
    this.hourPointer = new ClockPointer(
      x,
      y,
      size * 0.25,
      size / 30,
      "hour",
      this.initialTime
    );
    this.minutePointer = new ClockPointer(
      x,
      y,
      size * 0.4,
      size / 60,
      "minute",
      this.initialTime
    );
    this.secondPointer = new ClockPointer(
      x,
      y,
      size * 0.5,
      size / 100,
      "second",
      this.initialTime
    );
    this.tick();
  }

  preview() {
    this.size = abs(mouseX - this.x) * 2;
    this.secondPointer.scaleSize(this.size * 0.5, this.size / 100);
    this.minutePointer.scaleSize(this.size * 0.4, this.size / 60);
    this.hourPointer.scaleSize(this.size * 0.25, this.size / 30);
    this.tick();
  }

  tick() {
    push();
    this.draw();
    this.hourPointer.draw();
    this.minutePointer.draw();
    this.secondPointer.draw();
    fill(100);
    ellipse(0, 0, this.size / 26);
    pop();
  }

  draw() {
    translate(this.x, this.y);
    noStroke();

    // draw inner and outer circles
    fill(0);
    ellipse(0, 0, this.size);
    fill(255);
    ellipse(0, 0, this.size / 13);
    noStroke();

    fill(255);
    // draw hour ticks
    for (let i = 0; i < 12; i++) {
      rect(-this.size / 2 + this.size / 26, 0, this.size / 13, this.size / 26);
      rotate(360 / 12);
    }

    // draw minute ticks
    for (let i = 0; i < 60; i++) {
      rect(-this.size / 2 + this.size / 56, 0, this.size / 26, this.size / 52);
      rotate(360 / 60);
    }
  }
}

class ClockPointer {
  constructor(x, y, length, width, pointerMode, initialTime) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.width = width;
    this.pointerMode = pointerMode;
    if (pointerMode === "hour") {
      this.angle = map(initialTime, 0, 43200, 0, 360);
    } else if (pointerMode === "minute") {
      this.angle = map(initialTime % 3600, 0, 3600, 0, 360);
    } else if (pointerMode === "second") {
      this.angle = (360 / 60) * (initialTime % 60);
    }
  }

  scaleSize(newLength, newWidth) {
    this.length = newLength;
    this.width = newWidth;
  }

  draw() {
    push();
    noStroke();
    fill(255);
    rotate(this.angle);
    rect(0, 0 - this.length / 2, this.width, this.length);

    if (frameCount != 0 && this.pointerMode === "second") {
      this.angle += (360 / (getFrameRate() * 60)) * speedModifier;
    } else if (this.pointerMode === "minute") {
      this.angle += (360 / (getFrameRate() * 3600)) * speedModifier;
    } else if (this.pointerMode === "hour") {
      this.angle += (360 / (getFrameRate() * 216000)) * speedModifier;
    }
    pop();
  }
}
