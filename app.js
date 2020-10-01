// Array holding all possible shapes in row/col coordinates
const SHAPES = [
  {
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    color: 'blue',
    length: 4
  }, // I
  {
    shape: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: 'yellow',
    length: 2
  }, // O
  {
    shape: [
      [0, 0],
      [1, 1],
      [0, 1],
      [1, 2],
    ],
    color: 'hotpink'
  }, //Z
  {
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    color: 'green'
  }, // S
  {
    shape: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    color: 'purple'
  }, // J
  {
    shape: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    color: 'orange'
  }, // L
  {
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    color: 'red'
  }, // T
];


class Shape {
  constructor(shape, offset, color, length = 3) {
    this.shape = shape;
    this.offset = offset;
    this.color = color;
    this.length = length;
  }
  moveLeft() {
    this.clearShape();
    this.offset[1]--
    this.drawShape();
  }
  moveRight() {
    this.clearShape();
    this.offset[1]++
    this.drawShape();
  }
  moveDown() {
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
      target.style.backgroundColor = this.color;
    }
  }
  // clear the shape from the DOM
  clearShape() {
    // iterate over shape's coordinates
    for (let i = 0; i < this.shape.length; i++) {
      // clear shape at r,c position on the board
      let r = this.shape[i][0] + this.offset[0];
      let c = this.shape[i][1] + this.offset[1];
      let target = document.querySelector(`#row${r}col${c}`);
      target.style.backgroundColor = 'lightblue'
    }
  }
  rotateShape() {
    // returns a new shape rotated 90 degrees
    let newShape = this.shape.map((piece) => {
      // need to account for length of the piece otherwise you can get negative numbers
      let newR = 1 - (piece[1] - (this.length - 2));
      let newC = piece[0];
      return [newR, newC]
    })
    return newShape
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
        this.BOARD[i].push(
          false
        );
      }
    }
    this.currentShape = this.getNewShape();
    this.renderBoard();
    this.currentShape.drawShape();
    this.int = setInterval(()=>{
      this.gravity()
    }, 800)
  },

  // print the board state to console in a nice way, a helper
  printBoard: function() {
    console.table(game.BOARD)
  },

  //return a random entry from the array of shapes
  getRandomShape: function() {
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
        if (this.BOARD[i][j]) {
          square.classList.add("occupied");
          square.innerText = "Y"
        }
        row.appendChild(square);
      }
      boardDOM.appendChild(row);
    }
  },

  //removes the board from the dom
  clearBoard: function() {
    document.querySelector('.board').remove()
  },

  // returns a new random shape placed at the top of the board
  getNewShape: function() {
    const shape = this.getRandomShape(); // get random shape from the array of shapes
    const offset = [0, Math.floor(this.WIDTH / 2)]; //set its initial coordinates to be top of the board, in the middle
    return new Shape(shape.shape, offset, shape.color, shape.length);
  },

  // return true if a collision will occur to check: left right walls
  isHitWall: function(shape, direction, offsetC) {
    // if direction is left, look at every point in the shape and see if shape point[0] + offsetC !== 0
    let collision = false;
    if (direction === "left") {
      collision = shape.some((piece) => {
        return offsetC + piece[1] === 0;
      });
    } else if (direction === "right") {
      collision = shape.some((piece) => {
        return offsetC + piece[1] === this.WIDTH - 1;
      });
    }
    return collision;
  },

  // returns true if the piece hits the bottom of the board
  isHitBottom: function(offsetR, shape) {
    let collision = false;
    //let offsetR = this.currentShape.offset[0];
    // collision is true if any single square from the shape is hitting bottom
    collision = shape.some((piece) => {
      return offsetR + piece[0] === this.HEIGHT - 1;
    });
    return collision;
  },


  // adds the current shape to the board, setting the places where shape was to occupied
  addShapeToBoard: function() {
    const pieceToPlace = this.currentShape;
    const offsetR = this.currentShape.offset[0];
    const offsetC = this.currentShape.offset[1];
    pieceToPlace.shape.forEach((piece) => {
      // get the piece's row and coloumn, add to the shape's offset
      let pieceR = piece[0] + offsetR;
      let pieceC = piece[1] + offsetC;
      this.BOARD[pieceR][pieceC] = true;
      // change the board array;
    });
    // clear shape
    this.currentShape.clearShape();
    //  remove the existing board from the DOM
    this.clearBoard()
    // render the newly updated board
    this.renderBoard();
    // check if any rows are full
    this.handleFullRows(); // - eventually set a timeout
  },

  // scan the board for full rows and handle them
  handleFullRows: function() {
    // check if all columns in each row are occupied
    this.BOARD.forEach((row, rowindex) => {
      if (row.every((square) => square)) {
        // if so splice out the row(s) from board array
        this.BOARD.splice(rowindex, 1)
        // update the score
        this.score += 10;
        // add a new empty row to the start of board array
        this.BOARD.unshift(new Array(this.WIDTH).fill(
           false
        ));
        // update dom
        this.printBoard()

        this.updateScore()
        this.clearBoard();
        this.renderBoard();
        this.printBoard()
      }
    });
  },

  // takes a new offset row and column and checks if current piece will cause a collision if placed there
  checkCollision: function(newRow, newColumn, shape) {
    let collision = false;
    shape.forEach((piece) => {
      let rowToCheck = piece[0] + newRow;
      let colToCheck = piece[1] + newColumn;
      if (this.BOARD[rowToCheck][colToCheck]) {
        collision = true;
      }
    });
    return collision;
  },

  // function runs when game over
  gameOver: function() {
    this.gameIsOver = true;
    clearInterval(this.int)
    const message = document.createElement('h2');
    message.innerText = 'Game Over';
    document.querySelector('aside').appendChild(message)
  },

  // update the scoreboard on the dom
  updateScore: function() {
    document.getElementById('score').innerText = this.score
  },

  // gravity
  gravity: function() {
    // if moving downward would hit something
    const offsetR = this.currentShape.offset[0];
    if (this.isHitBottom(offsetR, this.currentShape.shape) || this.checkCollision(offsetR + 1, this.currentShape.offset[1],this.currentShape.shape)) {
      this.addShapeToBoard();
      // get a new shape if required
      this.currentShape = this.getNewShape();
      // checks if the new shape is having a collision on the board
      if (this.checkCollision(this.currentShape.offset[0], this.currentShape.offset[1],this.currentShape.shape)) {
        // draw the shape anyways
        this.currentShape.drawShape();
        // the new shape cannot be placed onto the board, game is over
        this.gameOver();
      } else {
        this.currentShape.drawShape();
      }
    } else {
      // otherwise just move it down
      this.currentShape.moveDown();
      // increase score by 1
      this.score++;
      this.updateScore();
    }
  },

  canRotate: function() {
    const nextShape = this.currentShape.rotateShape();
    let offsetC = this.currentShape.offset[1]
    let offsetR = this.currentShape.offset[0]
    // check left/right walls.
    if (this.isHitWall(nextShape, "right", offsetC - 1)) {
      return false;
    } else if (this.isHitWall(nextShape, "left", offsetC + 1)) {
      return false;
    }
    //  check isHitBottom, it can't go through the floor!
    else if (this.isHitBottom(offsetR - 1, nextShape)) {
      return false;
    }
    //  check collision
    else if (this.checkCollision(offsetR,offsetC,nextShape)){
      return false;
    }
    return true;
  },

  // handle user inputs L/R/D/U
  handleKeypress: function(e) {
    if (this.gameIsOver) {
      return;
    }
    let offsetC = this.currentShape.offset[1]
    let offsetR = this.currentShape.offset[0]
    // right arrow moves it right
    if (e.keyCode === 39) {
      if (!this.isHitWall(this.currentShape.shape, "right", offsetC) && !this.checkCollision(offsetR, offsetC + 1,this.currentShape.shape)) {
        this.currentShape.moveRight();
      }
      // left arrow moves it left
    } else if (e.keyCode === 37) {
      if (!this.isHitWall(this.currentShape.shape, "left", offsetC) && !this.checkCollision(offsetR, offsetC - 1,this.currentShape.shape)) {
        this.currentShape.moveLeft();
      }
      // down arrow moves it down -> put this all in a function called gravity
    } else if (e.keyCode === 40) {
      this.gravity()
    } else if (e.keyCode === 38) {
      if (this.canRotate()) {
        this.currentShape.clearShape();
        this.currentShape.shape = this.currentShape.rotateShape();
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
