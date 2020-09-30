// Array holding all possible shapes in row/col coordinates
const SHAPES = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ], // I
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0],
  ], // O
  [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
  ], //S
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ], // Z
  [
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ], // L
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ], // J
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ], // T
];


class Shape {
  constructor(shape, offset) {
    this.shape = shape;
    this.offset = offset
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
      let target = document.querySelector(`#row${r}col${c}`);
      target.classList.add('active')
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
      target.classList.remove('active')
    }
  }
}




// Game object
const game = {
  currentShape: null,
  HEIGHT: 10,
  WIDTH: 10,
  BOARD: [],
  gameOver: false,
  score: 0,
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
    return new Shape(shape, offset);
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

  // returns true if the piece moving into 'direction' would cause a collision
  hitOccupiedPlace : function(direction){
    isHitPlace = false;
    const offsetR = this.currentShape.offset[0];
    const offsetC = this.currentShape.offset[1];
    if(direction === "down"){
      this.currentShape.shape.forEach((piece)=>{
        // get the current position of the piece
        let row = piece[0]+offsetR;
        let col = piece[1]+offsetC;
        // check the row below it, at the same column coordinate as the piece
        if(this.BOARD[row+1][col].occupied){
          isHitPlace = true;
        }
      })
    } else if (direction === "left"){
      this.currentShape.shape.forEach((piece)=>{
        let row = piece[0] + offsetR;
        let col = piece[1] + offsetC;
        if(this.BOARD[row][col-1].occupied){
          isHitPlace = true;
        }
      })
    } else if (direction === "right"){
      this.currentShape.shape.forEach((piece)=>{
        let row = piece[0] + offsetR;
        let col = piece[1] + offsetC;
        if(this.BOARD[row][col+1].occupied){
          isHitPlace = true;
        }
      })
    }
    return isHitPlace
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
    console.log(collision);
    return collision;
  },

  // update the scoreboard on the dom
  updateScore: function(){
    document.getElementById('score').innerText = this.score
  },

  // handle user inputs L/R/D/U TODO up
  handleKeypress: function(e){
    if (this.gameOver){
      return;
    }
    if (e.keyCode === 39) {
      if (!this.isHitWall("right") && !this.hitOccupiedPlace("right")) {
        this.currentShape.moveRight();
      }
    } else if (e.keyCode === 37) {
      if (!this.isHitWall("left") && !this.hitOccupiedPlace("left")) {
        this.currentShape.moveLeft();
      }
    } else if (e.keyCode === 40) {
      if (this.isHitBottom() || this.hitOccupiedPlace("down")){
        this.addShapeToBoard();
        // TODO, check new shape can be placed (i.e. board is not full!)
        this.currentShape = this.getNewShape();
        // checks if current offset is having a collision on the board
        if(this.checkCollision(this.currentShape.offset[0],this.currentShape.offset[1])){
          // todo
          this.gameOver = true;
        } else{
          this.currentShape.drawShape();
        }
      } else{
        this.currentShape.moveDown();
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
