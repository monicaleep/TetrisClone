# Tetris Project in JS
---

#### Live Demo: The game is live and playable at this [link](https://monicaleep.github.io/P1/)
---

#### Concept

This project is a modelled after the game Tetris where different shape blocks fall onto a grid and you earn points by clearing rows. The pieces can be moved left and right with the arrow keys, and rotated with the up arrow.

---

#### Technologies used:
- HTML
- CSS (flexbox, Google Fonts)
- JavaScript (ES6 Classes and OOP Methodology)

---


#### Approach Taken:

###### Overview:

To make this project I used a JavaScript Class for the pieces, and an Object to hold the game. I used arrays to store the game's data and render it to the DOM. Styling was done with flexbox, google fonts, and background image layers.

What I found really helpful was to continuously update my TODO list (below) and be as thorough as possible from the beginning. I did several refactors including the change to OOP, rewriting functions as I found a lot of duplication in code (i.e. checking for left/right collisions can be in the same function). I have some pending TODOs but they are just additional features to more closely match the official Tetris rules like increase speed over time, bonus points for clearing multiple lines at once.

##### Wireframe:
- I needed to have at a minimum at the start just a board/grid of cells with a certain height and width.
- I draw out a title and brief rules, and the board next to it.

#### User Stores:
- As a user I can see a board which is populated by falling tetrominoes
- As a user I can move the pieces left/right and rotate them
- As a user I can seat the tetrominoes onto the board when they cannot move down further
- As a user I can earn points by clearing full rows
- As a user I can lose the game if the board becomes full of tetrominoes.
- As a user I can pause/restart the game using buttons.

---
#### Development Plan

##### MVP

- [x] Grid to represent the board. Initial size: 20 rows, 10 columns
- [x] render the grid to DOM, give each square an ID
- [x] Pieces - a class,  a shape, an offset
- [x] offset determines the top left corner of the piece
- [x] piece gets initially placed at top row, halfway across.
- [x] board is an object, with piece instance attached
- [x] event listeners - l/r check for walls,
- [x] check l/r for pieces already placed,
- [x] update piece offset to move it (rerender)
- [x] event listeners - down, check for piece or bottom, set piece to become part of board
- [x] gravity - same as event listener for down but happens every 500 msec.
- [x] check board for full rows every time piece is "placed" into the board
- [x] clear a full row, rerender board.
- [x] board generates a random new piece each time a piece is placed
- [x] game over when piece cannot move or cannot even be generated to the board.
- [x] add game over stuff, message


##### Stretch Goals
- [x] update score on DOM
- [x] handle piece rotation
- [x] check if piece can even rotate
- [x] add reset and pause button
- [x] add 1 point to score for every time piece moves down
- [x] assign colors to the different pieces


##### Future Development
- [ ] add zen mode - only squares given
- [ ] increase speed of gravity over time
- [ ] display next piece on LHS
- [ ] more points for multiple rows cleared



### Challenges:
The first challenge I faced was to actually make pieces and place them on the board. I understood a tetrominoes has different shapes so I drew them by hand. Then I converted each part of a tetrominoes to coordinates. I assigned each cell in the board an ID with coordinates too, and the tetromino could then be overlayed onto the board. Because each piece is made of 4 'coordinates' I used arrays to hold all the relevant data for the piece.

The second challenge I faced was to rotate the pieces. To overcome this I draw the pieces out on paper with their coordinates and then wrote down what I would expect after they were rotated. However, this occasionally gave negative coordinate values which broke my code. After a long time of drawing and math I realized I could add the length of each piece to the negative values to keep it inside the constraints of the board.

The last challenge I faced was being able to rotate the piece through the wall or through other pieces. I had to refactor a lot of my collision detection to take in a piece so that I could pass in the potentially rotated piece.
