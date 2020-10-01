// Array holding all possible shapes in row/col coordinates
const SHAPES = [
  {shape: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  color: 'blue', length: 4}, // I
  {shape:[
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0],
  ],
  color: 'yellow', length: 2}, // O
  {shape: [
    [0, 0],
    [1, 1],
    [0, 1],
    [1, 2],
  ],
  color: 'hotpink'}, //Z
  {shape:[
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  color: 'green'}, // S
  {shape:[
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ],
  color: 'purple'}, // J
  {shape: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  color: 'orange'}, // L
  {shape: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
  ],
  color: 'red'}, // T
];

const rotateShape = (shape)=>{
  let newShape = shape.map((piece)=>{
    let newR = 1 - (piece[1]-(3-2));
    let newC = piece[0];
    return [newR,newC]
  })
  return newShape
}

class Shape {
  constructor(shape, offset, color, length=3) {
    this.shape = shape;
    this.offset = offset;
    this.color = color;
    this.length = length;
  }
  moveLeft(){
    this.clearShape();
    this.offset[1]--
    this.drawShape();
  }
  moveRight(){
    this.clearShape();
    this.offset[1]++
    this.drawShape();
  }
  moveDown(){
    this.clearShape();
    this.offset[0]++;
    this.drawShape();
  }
  // function which renders the shape onto the board
  drawShape() {
    // iterate over shape's coordinates
    for (let i = 0; i < this.shape.length; i++) {
      // place shape at r,c position on the board
      let r = this.shape[i][0] + this.offset[0];
      let c = this.shape[i][1] + this.offset[1];
      while(r<0){
        this.offset[0]++;
        r++
      }
      while(c<0){
        this.offset[1]++;
        c++
      }
      console.log(r,c)
      let target = document.querySelector(`#row${r}col${c}`);
      target.style.backgroundColor = this.color;
    }
  }
  // clear the shape from the DOM
  clearShape(){
    // iterate over shape's coordinates
    for (let i = 0; i < this.shape.length; i++) {
      // clear shape at r,c position on the board
      let r = this.shape[i][0] + this.offset[0];
      let c = this.shape[i][1] + this.offset[1];
      let target = document.querySelector(`#row${r}col${c}`);
      target.style.backgroundColor = 'lightblue'
    }
  }
  rotateShape(){

    let newShape = this.shape.map((piece)=>{
      // need to account for length of the piece otherwise you can get negative numbers
      let newR = 1 - (piece[1]-(this.length-2));
      let newC = piece[0];
      return [newR,newC]
    })
    this.shape= newShape
  }
}




// Game object
const game = {
  currentShape: null,
  HEIGHT: 20,
  WIDTH: 10,
  BOARD: [],
  gameIsOver: false,
  score: 0,
  int: null, // will hold the setInterval for gravity

  // called when the DOM is loaded. Creates initial board array, gets first shape, and renders everything
  start: function() {
    //function to make the initial board array
    for (let i = 0; i < this.HEIGHT; i++) {
      this.BOARD.push([]);
      for (let j = 0; j < this.WIDTH; j++) {
        this.BOARD[i].push({
          occupied: false,
        });
      }
    }
    this.currentShape = this.getNewShape();
    this.renderBoard();
    this.currentShape.drawShape();
    this.int = setInterval(()=>{
      this.gravity()
    }, 500)
  },

  // print the board state to console in a nice way, a helper
  printBoard : function(){
    this.BOARD.forEach(row=>{
      console.table(row)
    })
  },

  //return a random entry from the array of shapes
  getRandomShape : function(){
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
  },

  // a function which renders the board array to the DOM
  renderBoard: function() {
    const boardDOM = document.createElement("div");
    boardDOM.classList.add("board");
    document.body.appendChild(boardDOM);
    // loop through the rows
    for (let i = 0; i < this.BOARD.length; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      // loop through the items in each row
      for (let j = 0; j < this.BOARD[i].length; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        // square.innerText = "" + i + "," + j;
        square.setAttribute("id", `row${i}col${j}`);
        if (this.BOARD[i][j].occupied) {
          square.classList.add("occupied");
        }
        row.appendChild(square);
      }
      boardDOM.appendChild(row);
    }
  },

  //removes the board from the dom
  clearBoard : function(){
    document.querySelector('.board').remove()
  },

  // returns a new random shape placed at the top of the board
  getNewShape: function() {
    const shape = this.getRandomShape(); // get random shape from the array of shapes
    const offset = [0, Math.floor(this.WIDTH / 2)]; //set its initial coordinates to be top of the board, in the middle
    return new Shape(shape.shape, offset, shape.color, shape.length);
  },

  // return true if a collision will occur to check: left right walls
  isHitWall : function(direction){
    // if direction is left, look at every point in the shape and see if shape point[0] + offsetC !== 0
    let collision = false;
    let offsetC = this.currentShape.offset[1];
    if (direction === "left") {
      collision = this.currentShape.shape.some((piece) => {
        return offsetC + piece[1] === 0;
      });
    } else if (direction === "right") {
      collision = this.currentShape.shape.some((piece) => {
        return offsetC + piece[1] === this.WIDTH - 1;
      });
    }
    return collision;
  },

  // returns true if the piece hits the bottom of the board
  isHitBottom : function(){
    let collision = false;
    let offsetR = this.currentShape.offset[0];
    // collision is true if any single square from the shape is hitting bottom
    collision = this.currentShape.shape.some((piece)=>{
      return offsetR + piece[0] === this.HEIGHT - 1;
    });
    return collision;
  },


  // adds the current shape to the board, setting the places where shape was to occupied
  addShapeToBoard : function(){
    const pieceToPlace = this.currentShape;
    const offsetR = this.currentShape.offset[0];
    const offsetC = this.currentShape.offset[1];
    pieceToPlace.shape.forEach((piece)=>{
      // get the piece's row and coloumn, add to the shape's offset
      let pieceR = piece[0] + offsetR;
      let pieceC = piece[1] + offsetC;
      this.BOARD[pieceR][pieceC].occupied = true;
      // change the board array;
    });
    // clear shape
    this.currentShape.clearShape();
    //  remove the existing board from the DOM
    this.clearBoard()
    // render the newly updated board
    this.renderBoard();
    // check if any rows are full
    this.handleFullRows();// - eventually set a timeout
  },

  // scan the board for full rows and handle them
  handleFullRows : function(){
    // check if all columns in each row are occupied
    this.BOARD.forEach((row, rowindex)=>{
      if(row.every((square) =>  square.occupied)){
        // if so splice out the row(s) from board array
        this.BOARD.splice(rowindex,1)
        // update the score
        this.score += 10;
        // add a new empty row to the start of board array
        this.BOARD.unshift(new Array(this.WIDTH).fill({occupied: false}));
        // update dom
        this.updateScore()
        this.clearBoard();
        this.renderBoard();
      }
    });
  },

  // takes a new offset row and column and checks if current piece will cause a collision if placed there
  checkCollision : function(newRow,newColumn){
    let collision = false;
    this.currentShape.shape.forEach((piece)=>{
      let rowToCheck = piece[0] + newRow;
      let colToCheck = piece[1] + newColumn;
      if(this.BOARD[rowToCheck][colToCheck].occupied){
        collision = true;
      }
    });
    return collision;
  },

  // function runs when game over
  gameOver : function(){
    this.gameIsOver = true;
    clearInterval(this.int)
    const message = document.createElement('h2');
    message.innerText = 'Game Over';
    document.querySelector('aside').appendChild(message)
  },

  // update the scoreboard on the dom
  updateScore: function(){
    document.getElementById('score').innerText = this.score
  },

  // gravity
  gravity: function(){
    // if moving downward would hit something
    if (this.isHitBottom() || this.checkCollision(this.currentShape.offset[0]+1,this.currentShape.offset[1])){
      this.addShapeToBoard();
      // get a new shape if required
      this.currentShape = this.getNewShape();
      // checks if the new shape is having a collision on the board
      if(this.checkCollision(this.currentShape.offset[0],this.currentShape.offset[1])){
        // draw the shape anyways
        this.currentShape.drawShape();
        // the new shape cannot be placed onto the board
        this.gameOver();
      } else{
        this.currentShape.drawShape();
      }
      // otherwise just move it down
      // TODO increase score by 1
    } else{
      this.currentShape.moveDown();
      this.score++;
      this.updateScore();
    }
  },

  canRotate: function(){
    return true;
  },

  // handle user inputs L/R/D/U TODO up
  handleKeypress: function(e){
    if (this.gameIsOver){
      return;
    }
    // right arrow moves it right
    if (e.keyCode === 39) {
      if (!this.isHitWall("right") && !this.checkCollision(this.currentShape.offset[0],this.currentShape.offset[1]+1)) {
        this.currentShape.moveRight();
      }
      // left arrow moves it left
    } else if (e.keyCode === 37) {
      if (!this.isHitWall("left") && !this.checkCollision(this.currentShape.offset[0],this.currentShape.offset[1]-1)) {
        this.currentShape.moveLeft();
      }
      // down arrow moves it down -> put this all in a function called gravity
    } else if (e.keyCode === 40) {
        this.gravity()
    } else if (e.keyCode === 38){
      if(this.canRotate()){
        this.currentShape.clearShape();
        this.currentShape.rotateShape();
        this.currentShape.drawShape();
      }
    }
  }

}

document.addEventListener("DOMContentLoaded", () => {
  game.start();
  document.addEventListener("keydown", (e) => {
    game.handleKeypress(e);
  });
});


// TODO refactor checkCollisions(<coordinates of space to move into>, <direction>, <boardState>"
// TODO a function which takes a board and applies gravity to the active piece
// work from bottom up looking for the piece
// todo rotation logic - what if rotation makes a collision?
