# Tetris Project in JS

This project is a modelled after the game Tetris where different shape blocks fall onto a grid and you earn points by clearing rows. The pieces can be moved left and right with the arrow keys, and rotated with the up arrow.
To make this project I used a JavaScript Class for the pieces, and an Object to hold the game. I used arrays to store the game's data and render it to the DOM.
What I found really helpful was to continuously update my TODO list (below) and be as thorough as possible from the beginning. I did several refactors including the change to OOP, rewriting functions as I found a lot of duplication in code (i.e. checking for left/right collisions can be in the same function). I have some pending TODOs but they are just additional features to more closely match the official Tetris rules like increase speed over time, bonus points for clearing multiple lines at once.


## TODO/Notes

- [x] Grid to represent the board - array of arrays. 0 represents empty, 1 represents occupied
- [x] Initial size: 20 rows, 10 columns
- [x] render the grid to DOM, give each square an ID
- [x] Pieces - a class,  a shape, an offset
- [x] offset determines the top left corner of the piece
- [x] piece gets initially placed at top row, halfway across.
- [x] board is an object, with piece instance attached
- [x] event listeners - l/r check for walls,
- [x] check l/r for pieces already placed,
- [x] update piece offset to move it (rerender)
- [x] event listeners - down, check for piece or bottom, set piece to become part of board
- [x] gravity - same as event listener for down but happens every 5 sec.
- [x] check board for full rows every time piece is "placed" into the board
- [x] clear a full row, maybe use splice and then place a new empty row at the beginning of the board? rerender board. Need to check for multiple rows cleared at once.
- [x] board generates a random piece each time a piece is placed
- [x] refactor to use the checkCollision function
- [x] game over when piece cannot move or cannot even be generated to the board.
- [x] add game over stuff, message and animation
- [x] update score on DOM
- [x] handle piece rotation
- [x] check if piece can even rotate
- [ ] add zen mode - only squares given
- [ ] increase speed of gravity over time
- [ ] add reset button
- [x] add 1 point to score for every time piece moves down
- [ ] display next piece on LHS
- [ ] more points for multiple rows cleared
- [ ] timer at the bottom
- [x] assign colors to the different pieces
