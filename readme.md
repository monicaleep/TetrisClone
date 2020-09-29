TODO

- Grid to represent the board - array of arrays. 0 represents empty, 1 represents occupied
- Initial size: 20 rows, 10 columns
- render the grid to DOM, give each square an ID
- Pieces - a class, has a letter, a shape, an offset
- offset determines the top left corner of the piece
- piece gets initially placed at top row, halfway across.
- board is an object, with piece instance attached
- event listeners - l/r check for walls, check for pieces, update piece offset (rerender)
- event listeners - down, check for piece or bottom, set piece to become part of board
- gravity - same as event listener for down but happens every 5 sec.
- check board for full rows every time piece is "placed" into the board
- clear a full row, maybe use splice and then place a new empty row at the beginning of the board? rerender board. Need to check for multiple rows cleared at once.
- board generates a random piece each time a piece is placed
- game over when piece cannot move or cannot even be generated to the board.
