const gameContainer = document.getElementById('game-container');
const buttonUp = document.getElementById('up');
const buttonDown = document.getElementById('down');
const buttonLeft = document.getElementById('left');
const buttonRight = document.getElementById('right');

let totalCoins = 38;
let gameData = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,6,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,1,1,1,2,5,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,10,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]

];

// 1 = Wall, 2 = Coins, 3 = Empty Ground, 5 = Pacman

const WALL   = 1;
const COIN   = 2;
const GROUND = 3;
const PACMAN = 5;
const GHOST  = 6;
const POWER = 10;

let powerActive = false;


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

let ghost = {
  x: 6,
  y: 1,
  direction: 'left'
}


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
      } else if (col === GHOST) {
        tile.classList.add('ghost');
        tile.classList.add(ghost.direction);
      } else if (col === POWER) {
        tile.classList.add('power');
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

// this will generate a randomDirection
// it will also check if the random direction is a wall, if it is it will generate another number
function randomDirection(lastMove) {
  const directions = [0, 1, 2, 3];
  const validMoves = directions.filter((dir) => {
    if (dir === 0 && gameData[ghost.y - 1][ghost.x] !== WALL && lastMove !== 'down') return true;
    if (dir === 1 && gameData[ghost.y + 1][ghost.x] !== WALL && lastMove !== 'up') return true;
    if (dir === 2 && gameData[ghost.y][ghost.x - 1] !== WALL && lastMove !== 'right') return true;
    if (dir === 3 && gameData[ghost.y][ghost.x + 1] !== WALL && lastMove !== 'left') return true;
    return false;
  });

  if (validMoves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
}


function gameLoop() {
  console.log(powerActive);

  if (gameOver()) {
    alert("game Over");
    clearInterval(gameSpeedInt);
    // give them option to restart or go to music video once game ends
  }

  if (currentDirection === 'left') {
    moveLeft();
  } else if (currentDirection === 'right') {
    moveRight();
  } else if (currentDirection === 'up') {
    moveUp();
  } else if (currentDirection === 'down') {
    moveDown();
  }

  // each time we get here i want the ghost to move as well, so we will select a random direction for the ghost
  let ghostMove = randomDirection();
  //console.log(randomDirection);
  if (ghostMove == 0) {
    // if its a 
    ghostUp();
    console.log('ghost up');
  } else if (ghostMove == 1) {
    ghostDown();
    console.log('ghost down');
  } else if (ghostMove == 2) {
    ghostLeft();
    console.log('ghost left');
  } else if (ghostMove == 3) {
    ghostRight()
    console.log('ghost right');
  }

  eraseMap();
  drawMap();
}

function moveDown() {
  pacman.direction = 'down';
  if (gameData[pacman.y+1][pacman.x] !== WALL) {
    if (gameData[pacman.y+1][pacman.x] === POWER){
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      powerActive = true;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y+1][pacman.x] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      console.log(totalCoins);
    }
    else if (gameData[pacman.y+1][pacman.x] === GROUND || (gameData[pacman.y+1][pacman.x] === GHOST && powerActive)) {
      gameData[pacman.y][pacman.x] = GROUND;
    }
    pacman.y = pacman.y + 1 ;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function ghostDown() {
  ghost.direction = 'ghost';
  if (gameData[ghost.y+1][ghost.x] !== WALL) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y + 1][ghost.x] == GROUND){
      gameData[ghost.y][ghost.x] = GROUND; // where they are NOW becomes GROUND
    } else {
      gameData[ghost.y][ghost.x] = COIN; // where they are now becomes a coin
    }
    ghost.y = ghost.y + 1;
    gameData[ghost.y][ghost.x] = GHOST;
  }
}

function moveUp() {
  pacman.direction = 'up';
  if (gameData[pacman.y-1][pacman.x] !== WALL) {
    if (gameData[pacman.y-1][pacman.x] === POWER){
      powerActive = true;
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y-1][pacman.x] === COIN){
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      console.log(totalCoins);
    }
    else if (gameData[pacman.y-1][pacman.x] === GROUND || (gameData[pacman.y-1][pacman.x] === GHOST && powerActive)) {
      gameData[pacman.y][pacman.x] = GROUND;
    }
    pacman.y = pacman.y - 1;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}
// if its a not a wall, it can be ground or coin
// if it is a wall do nothing
function ghostUp() {
  ghost.direction = 'up';
  if (gameData[ghost.y-1][ghost.x] !== WALL) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y-1][ghost.x] == GROUND){
      gameData[ghost.y][ghost.x] = GROUND; // where they are NOW becomes GROUND
    } else {
      gameData[ghost.y][ghost.x] = COIN; // where they are now becomes a coin
    }
    ghost.y = ghost.y - 1;
    gameData[ghost.y][ghost.x] = GHOST;
  }
}

function moveLeft() {
  pacman.direction = 'left';
  if (gameData[pacman.y][pacman.x-1] !== WALL) {
    if (gameData[pacman.y][pacman.x-1] === POWER){
      gameData[pacman.y][pacman.x] = GROUND;
      powerActive = true;
      totalCoins -= 1;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y][pacman.x-1] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      console.log(totalCoins);
    }
    else if (gameData[pacman.y][pacman.x-1] === GROUND || (gameData[pacman.y][pacman.x-1] === GHOST && powerActive)) {
      gameData[pacman.y][pacman.x] = GROUND;
    }
    pacman.x = pacman.x - 1;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function ghostLeft() {
  ghost.direction = 'left';
  if (gameData[ghost.y][ghost.x-1] !== WALL) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y][ghost.x-1] == GROUND){
      gameData[ghost.y][ghost.x] = GROUND; // where they are NOW becomes GROUND
    } else {
      gameData[ghost.y][ghost.x] = COIN; // where they are now becomes a coin
    }
    ghost.x = ghost.x - 1;
    gameData[ghost.y][ghost.x] = GHOST;
  }
}

function moveRight() {
  pacman.direction = 'right';
  if (gameData[pacman.y][pacman.x+1] !== WALL) {
    if (gameData[pacman.y][pacman.x+1] === POWER){
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      powerActive = true;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y][pacman.x+1] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      console.log(totalCoins);
    }
    else if (gameData[pacman.y][pacman.x+1] === GROUND || (gameData[pacman.y][pacman.x+1] === GHOST && powerActive)) {
      gameData[pacman.y][pacman.x] = GROUND;
    }
    pacman.x = pacman.x + 1;
    gameData[pacman.y][pacman.x] = PACMAN;
  }
}

function ghostRight() {
  ghost.direction = 'right';
  if (gameData[ghost.y][ghost.x+1] !== WALL) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y][ghost.x+1] == GROUND){
      gameData[ghost.y][ghost.x] = GROUND; // where they are NOW becomes GROUND
    } else {
      gameData[ghost.y][ghost.x] = COIN; // where they are now becomes a coin
    }
    ghost.x = ghost.x + 1 ;
    gameData[ghost.y][ghost.x] = GHOST;
  }
}

function gameOver() {

  if (totalCoins == 0 || (powerActive == false && gameData[ghost.y][ghost.x] === gameData[pacman.y][pacman.x])) {
    return true;
  }
  // if they collide but powerUp is Actie
  return false;
}


// This function sets up the listener for the whole page.
// Specifically, when the user presses a key, we run a function
// that handles that key press.
function setupKeyboardControls() {
  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") currentDirection = 'left';
    else if (e.key === "ArrowUp") currentDirection = 'up';
    else if (e.key === "ArrowRight") currentDirection = 'right';
    else if (e.key === "ArrowDown") currentDirection = 'down';
  });

  buttonUp.addEventListener('touchstart', () => currentDirection = 'up');
  buttonDown.addEventListener('touchstart', () => currentDirection = 'down');
  buttonLeft.addEventListener('touchstart', () => currentDirection = 'left');
  buttonRight.addEventListener('touchstart', () => currentDirection = 'right');
}


//-------------------------------------------------------------
// Main game setup function
//-------------------------------------------------------------
function main() {
  // Initialize the game by drawing the map and setting up the
  // keyboard controls.
  drawMap();
  setupKeyboardControls();
  //let gameSpeedInt = setInterval(gameLoop, 300); // adjust 200ms to your desired speed

}

// Finally, after we define all of our functions, we need to start
// the game.
main();
