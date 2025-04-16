const gameContainer = document.getElementById('game-container');
const buttonUp = document.getElementById('up');
const buttonDown = document.getElementById('down');
const buttonLeft = document.getElementById('left');
const buttonRight = document.getElementById('right');


let gameData = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,1,1,1,2,5,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]

];
// 1 = Wall, 2 = Coins, 3 = Empty Ground, 5 = Pacman

const WALL   = 1;
const COIN   = 2;
const GROUND = 3;
const PACMAN = 5;


// We will use the identifier "map" to refer to the game map.
// We won't assign this until later on, when we generate it
// using the gameData.
// temporary map, since we will redraw the map every second
let map;

// We need to keep track of Pacman's location on the game board.
// That is done through a pair of coordinates.
// And, we will keep track of what direction she is facing.
let pacman = {
  x: 6,
  y: 4,
  direction: 'right'
};


//-------------------------------------------------------------
// Game map creation functions
//-------------------------------------------------------------
// This function converts gameData into DOM elements.
function createTiles(data) {

  // We'll keep the DOM elements in an array.
  let tilesArray = [];

  for (let row of data) {

    for (let col of row) { // col is the # in the row
      
      let tile = document.createElement('div');
      tile.classList.add('tile');
      
      // finding what number col is
      // whatver it is, we add the associated class, so it takes its properties
      if (col === WALL) {
        tile.classList.add('wall');
      } else if (col === COIN) {
        tile.classList.add('coin');
      } else if (col === GROUND) {
        tile.classList.add('ground');
      } else if (col === PACMAN) {
        tile.classList.add('pacman');
        tile.classList.add(pacman.direction); // add the class direction so the img is showing that direction
      }

      tilesArray.push(tile); // add that tile to the Array
    }

    // to get to the next row when drawing the map
    let brTile = document.createElement('br');
    tilesArray.push(brTile);
  }

  // At the end of our function, we return the array
  // of configured tiles.
  return tilesArray;
}

// This function creates a map element, fills it with tiles,
// and adds it to the page.
function drawMap() {
  map = document.createElement('div');

  let tiles = createTiles(gameData);
  // for every tile in tiles
  for (let tile of tiles) {
    // add the tile to the map
    map.append(tile)
  }

  gameContainer.appendChild(map); 
}

// This function removes the map element from the page.
function eraseMap() {
  gameContainer.removeChild(map);
}

//-------------------------------------------------------------
// Movement functions
//-------------------------------------------------------------

// Each function does the following:
// - set pacman's direction so that we show the correct image
// - check to see if we hit a wall
// - if we didn't hit a wall, set pacman's old location to empty space
// - update pacman's location
// - draw pacman in the new location
let currentDirection = null;

function gameLoop() {
  if (currentDirection === 'left') {
    moveLeft();
  } else if (currentDirection === 'right') {
    moveRight();
  } else if (currentDirection === 'up') {
    moveUp();
  } else if (currentDirection === 'down') {
    moveDown();
  }

  eraseMap();
  drawMap();
}

function moveDown() {
  pacman.direction = 'down';
  if (gameData[pacman.y+1][pacman.x] !== WALL) {
    gameData[pacman.y][pacman.x] = GROUND;
    pacman.y = pacman.y + 1 ;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function moveUp() {
  pacman.direction = 'up';
  if (gameData[pacman.y-1][pacman.x] !== WALL) {
    gameData[pacman.y][pacman.x] = GROUND;
    pacman.y = pacman.y - 1;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function moveLeft() {
  pacman.direction = 'left';
  if (gameData[pacman.y][pacman.x-1] !== WALL) {
    gameData[pacman.y][pacman.x] = GROUND;
    pacman.x = pacman.x - 1 ;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function moveRight() {
  pacman.direction = 'right';
  if (gameData[pacman.y][pacman.x+1] !== WALL) {
    gameData[pacman.y][pacman.x] = GROUND;
    pacman.x = pacman.x + 1 ;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

// This function sets up the listener for the whole page.
// Specifically, when the user presses a key, we run a function
// that handles that key press.
function setupKeyboardControls() {
  document.addEventListener('keydown', function (e) {
    console.log(e.key);

    if (e.key === "ArrowLeft") {
      currentDirection = 'left';
    } else if (e.key === "ArrowUp") {
      currentDirection = 'up';
    } else if (e.key === "ArrowRight") {
      currentDirection = 'right';
    } else if (e.key === "ArrowDown") {
      currentDirection = 'down';
    }
  });

  buttonUp.addEventListener('touchstart', function (e) {
    currentDirection = 'up';
  });
  buttonDown.addEventListener('touchstart', function (e) {
    currentDirection = 'down';
  });
  buttonLeft.addEventListener('touchstart', function (e) {
    currentDirection = 'left';
  });
  buttonRight.addEventListener('touchstart', function (e) {
    currentDirection = 'right';
  });
}


//-------------------------------------------------------------
// Main game setup function
//-------------------------------------------------------------
function main() {
  // Initialize the game by drawing the map and setting up the
  // keyboard controls.
  drawMap();
  setupKeyboardControls();
  setInterval(gameLoop, 300); // adjust 200ms to your desired speed

}

// Finally, after we define all of our functions, we need to start
// the game.
main();
