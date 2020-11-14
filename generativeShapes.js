let clocks = [];

let tickSound;
let tickFilter;

let speedModifier = 1;

function preload() {
    soundFormats("mp3", "ogg");
    tickSound = loadSound("./assets/tickSound");
}

function setup(){
    createCanvas(800, 800);
    angleMode(DEGREES);
    rectMode(CENTER);
    frameRate(120);
    tickFilter = new p5.LowPass();
    tickFilter.freq(2000);
    tickSound.amp(0.1 / (speedModifier * 0.5));

    background(120);
  
    
    let currentHours = new Date().getHours();
    let currentMinutes = new Date().getMinutes(); 
    let currentSeconds = new Date().getSeconds();
  
    clocks.push(new Clock(400, 400, 400, currentHours, currentMinutes, currentSeconds));
    clocks.push(new Clock(200, 100, 50, 18, 23, 11));
}


function draw(){
    for(let i = 0; i < clocks.length; i++){
      let clock = clocks[i];
      clock.draw();
    }
}

class Clock {
    constructor(x, y, size, initialHours, initialMinutes, initialSeconds){
        this.x = x;
        this.y = y;
        this.size = size;   
        this.initialTime = initialHours * 3600 + initialMinutes * 60 + initialSeconds;     

        // this.hourTicks = [];
        // this.minuteTicks = [];
        this.hourPointer = new ClockPointer(x, y, size * 0.25, size / 30, "hour", this.initialTime);
        this.minutePointer = new ClockPointer(x, y, size * 0.4, size / 60, "minute", this.initialTime);
        this.secondPointer = new ClockPointer(x, y, size * 0.5, size / 100, "second", this.initialTime);   
        this.draw();     
    }

    draw(){
        push();
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
            rect(- this.size / 2 + this.size / 26 , 0, this.size / 13, this.size / 26);
            rotate(360 / 12);            
        }

        // draw minute ticks
        for (let i = 0; i < 60; i++) {
            rect(- this.size / 2 + this.size / 56, 0, this.size / 26, this.size / 52);
            rotate(360 / 60);            
        }      

        this.hourPointer.draw();
        this.minutePointer.draw();
        this.secondPointer.draw();

        fill(100);
        ellipse(0, 0, this.size / 26);

        pop();
    }

    play(){

    }

    stop(){

    }
}

class ClockPointer {
    constructor(x, y, length, width, pointerMode, initialTime){
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.pointerMode = pointerMode;
        if (pointerMode === "hour") {
            this.angle = map(initialTime, 0, 43200, 0, 360);
        } else if(pointerMode === "minute"){
            this.angle = map(initialTime % 3600, 0, 3600, 0, 360);         
        }else if(pointerMode === "second"){
            this.angle = (360 / 60) *  (initialTime % 60);
        }
    }

    draw(){
        push();
        noStroke();
        fill(255);
        rotate(this.angle);
        rect(0, 0 - this.length / 2, this.width, this.length);
        if (frameCount != 0 && frameCount % (60 / speedModifier) == 0 && this.pointerMode === "second") {
            this.angle += 360 / 60;   
            tickSound.disconnect();

            if (frameCount % (120 / speedModifier) === 0) {
             
                tickSound.connect(tickFilter);
                tickSound.play();
            }else{
                tickSound.connect();
                tickSound.play();
            }
            
        }else if (this.pointerMode === "minute"){
            this.angle += 360 / (216000 / speedModifier);
        }else if (this.pointerMode === "hour"){
            this.angle += 360 / (12960000 / speedModifier);

        }
        pop();
    }
}