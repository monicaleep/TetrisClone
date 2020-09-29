TODO

- Grid to represent the board - array of arrays
- render the grid to DOM, give each square an ID
- Pieces - a class, has a letter, a shape, an offset
- board is an object, with piece instance attached
- event listeners - l/r check for walls, check for pieces, update piece offset (rerender)
- event listeners - down, check for piece or bottom, set piece to become part of board
- check board for full rows every time piece is "placed" into the board
- board generates a random piece each time a piece is placed
- game over when piece cannot move or cannot even be generated to the board
