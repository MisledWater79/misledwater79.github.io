class Cell{
  constructor(i,j,w){
    this.i = i;
    this.j = j;
    this.x = i*w;
    this.y = j*w;
    this.w = w;
    this.bomb = false;
    this.shown = false;
    this.count = 0;
    this.flagged = false;
  }
  
  show(){
    if(this.shown){
      fill(120);
      stroke(0);
      square(this.x,this.y,this.w);
      if(this.bomb){
        fill(0);
        circle(this.x+this.w/2,this.y+this.w/2,this.w-8);
        if(this.flagged){
          fill(150,0,0);
          //circle(this.x+this.w/2,this.y+this.w/2,this.w-8);
          triangle(this.x+4,this.y+4,this.x+4,this.y+this.w-4,this.x+this.w-4,this.y+this.w/2)
        }
      }
      if(this.count > 0){
        textAlign(CENTER);
        fill(0);
        text(this.count, this.x + this.w * 0.5, this.y + this.w - 6);
      }
    } else {
      fill(80);
      stroke(0);
      square(this.x,this.y,this.w);
      if(this.flagged){
        fill(150,0,0);
        //circle(this.x+this.w/2,this.y+this.w/2,this.w-8);
        triangle(this.x+4,this.y+4,this.x+4,this.y+this.w-4,this.x+this.w-4,this.y+this.w/2)
      }
    }
  }
  
  countBombs(){
    if(this.bomb){
      this.count = -1;
      return;
    }
    for (var xoff = -1; xoff <= 1; xoff++) {
      var i = this.i + xoff;
      if (i < 0 || i >= cols) continue;
      for (var yoff = -1; yoff <= 1; yoff++) {
        var j = this.j + yoff;
        if (j < 0 || j >= rows) continue;
        if (cells[i][j].bomb) {
          this.count++;
        }
      }
    }
  }
  
  reveal(){
    this.shown = true;
    cellsShown++;
    if(this.count == 0){
      for(let xoff = -1; xoff <= 1; xoff++){
        let i = this.i + xoff;
        if(i < 0 || i >= cols) continue;
        for(let yoff = -1; yoff <= 1; yoff++){
          let j = this.j + yoff;
          if(j < 0 || j >= rows) continue;
          if(!cells[i][j].shown){
            cells[i][j].reveal();
          }
        }
      }
    }
  }
  
  contains(x,y){
    if(x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.w){
      return true;
    }
  }
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let cells;
let cols,rows;
let size = 20;
let flagMode = false;
let cSize = 400;
let bombs = 2;
let cellsFlagged = 0;
let cellsShown = 0;
let numCells;

function setup() {
  createCanvas(cSize, cSize);
  cols = width/size;
  rows = height/size;
  numCells = cols*rows;
  cells = make2DArray(cols,rows);
  document.querySelector("canvas").display = "none";
}

function makeGame(){
  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      cells[x][y] = new Cell(x,y,size);
    }
  }
  for(let n = 0; n < bombs; n++){
    let x = floor(random(cols));
    let y = floor(random(rows));
    if(cells[x][y].bomb){
      n--;
    } else {
      cells[x][y].bomb = true;
    }
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      cells[i][j].countBombs();
    }
  }
}

function gameOver(){
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      cells[x][y].shown = true;
    }
  }
}

function flagPressed(){
  flagMode = !flagMode;
  if(flagMode){
    document.querySelector("button").textContent = "Flag Toggle [On]";
  } else {
    document.querySelector("button").textContent = "Flag Toggle [Off]";
  }
}

function mousePressed(){
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      if (cells[x][y].contains(mouseX, mouseY)) {
        if(flagMode && !cells[x][y].shown){
          cells[x][y].flagged = !cells[x][y].flagged;
          if(cells[x][y].flagged){
            cellsFlagged++;
          } else {
            cellsFlagged--;
          }
        } else {
          if(!cells[x][y].flagged){
            if (cells[x][y].bomb) {
              gameOver();
            } else {
              cells[x][y].reveal();
            }
          }
        }
      }
    }
  }
  //console.log(cellsShown);
  //console.log(cellsFlagged);
}

function draw() {
  background(220);
  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      cells[x][y].show();
    }
  }
  if(cellsFlagged == bombs && cellsShown == numCells-bombs){
    gameOver();
    console.log("gg");
    noLoop();
  }
}