let agents = [];
let timestamp_clicked;
let timestamp_created;
let mouseDown = false;
let sizeModifier = 0.2;

let shapePreview = null;

function setup(){
    createCanvas(500, 500);
    rectMode(CENTER);
    timestamp_created = Date.now();
    frameRate(60);
}

function draw(){
    // background(120);
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        // agent.move();
        // agent.show();        
    }
    if (shapePreview != null) {
        shapePreview.showPreview();
    }

}

function mousePressed(event){
    if (keyIsDown(SHIFT)) {
        for (let i = 0; i < agents.length; i++) {
            const agent = agents[i];
            if (agent.gotClicked() === true) {
                agents.splice(i, 1);
                break;
            }
            
        }
    }else{
        timestamp_clicked = Date.now() - timestamp_created;
        mouseDown = true;

        if (keyIsDown(ALT)) {
            shapePreview = new RectAgent(mouseX, mouseY, 0, 0);
        }else{
            shapePreview = new BubbleAgent(mouseX, mouseY, 0);
        }
    }    
}

function mouseReleased(event){
    if (!keyIsDown(SHIFT)) {
        mouseDown = false;
        let timespan = (Date.now() - timestamp_created - timestamp_clicked);

        console.log("When releasing the mouse the calculated timespan was: " + timespan);
        console.log("When releasing the mouse the estimated timespan, used for preview was: " + (Date.now() - timestamp_created - timestamp_clicked));

        
        if (keyIsDown(ALT)) {
            agents.push(new RectAgent(mouseX, mouseY, timespan * sizeModifier, timespan * sizeModifier));
            
        } else {            
            agents.push(new BubbleAgent(mouseX, mouseY, timespan * sizeModifier));
        }

        shapePreview = null;
    }
}

class ShapeAgent{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    move(){
        this.x += random(-5, 5);
        this.y += random(-5, 5);
    }
}

class BubbleAgent extends ShapeAgent {
    constructor(x, y, radius){
      super(x, y);
      this.radius = radius;  
    }

    showPreview(){
        fill(0, 0, 0, 120);
        ellipse(mouseX, mouseY, (Date.now() - timestamp_created - timestamp_clicked) * sizeModifier);
    }

    show(){
        fill(255, 255, 255, 255);
        ellipse(this.x, this.y, this.radius);
    }

    gotClicked(){
        let distance = dist(mouseX, mouseY, this.x, this.y);
        if (distance <= this.radius) {
            return true;
        }
        return false;
    }
}

class RectAgent extends ShapeAgent{
    constructor(x, y, w, h){
      super(x, y);
      this.w = w;  
      this.h = h;
    }

    showPreview(){
        fill(0, 0, 0, 120);
        rect(mouseX, mouseY, (Date.now() - timestamp_created - timestamp_clicked) * sizeModifier, (Date.now() - timestamp_created - timestamp_clicked) * sizeModifier);
    }

    show(){
        strokeWeight(this.w / 20);
        fill(255, 255, 255, 255);
        rect(this.x, this.y, this.w, this.h);
    }  
    
    gotClicked(){
        let withinHorinzontalRange = ((mouseX >= this.x - this.w / 2) && (mouseX <= this.x + this.w / 2));
        let withinVerticalRange = ((mouseY >= this.y - this.h / 2) && (mouseY <= this.y + this.h / 2));
        return withinHorinzontalRange && withinVerticalRange;
    }
}
