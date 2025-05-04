const gameContainer = document.getElementById('game-container');
const buttonUp = document.getElementById('up');
const buttonDown = document.getElementById('down');
const buttonLeft = document.getElementById('left');
const buttonRight = document.getElementById('right');
const scoreText = document.getElementById('score');
var score = 0;
let gameAudio = new Audio('ghostAudio.m4a');

let gameSpeedInt = setInterval(gameLoop, 190); // adjust 200ms to your desired speed

let totalCoins = 38;
let gameData = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,6,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,1,1,1,2,5,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,10,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],

];

// 1 = Wall, 2 = Coins, 3 = Empty Ground, 5 = Pacman

const WALL   = 1;
const COIN   = 2;
const GROUND = 3;
const PACMAN = 5;
const GHOST  = 6;
const POWER = 10;
const VERT_BORDER = 11;
const HOR_BORDER = 12;

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
  direction: 'n'
}


//-------------------------------------------------------------
// Game map creation functions

function initMap() {
  map = document.createElement('div');
  map.id = 'game-map';
  map.classList.add('gameMap')

  for (let y = 0; y < gameData.length; y++) {
    for (let x = 0; x < gameData[y].length; x++) {
      const tile = document.createElement('div');
      tile.classList.add(getTileClass(gameData[y][x]));
      tile.dataset.x = x;
      tile.dataset.y = y;
      map.appendChild(tile);
    }
  }

  gameContainer.appendChild(map);
}

function updateMap() {
  const tiles = map.children;

  for (let tile of tiles) {
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);

    tile.className = 'tile'; // Reset all classes
    tile.classList.add(getTileClass(gameData[y][x]));

    if (x === ghost.x && y === ghost.y) {
      tile.classList.add('ghost');
      if (powerActive) {
        tile.classList.add('weakGhost');
      }
    }

    if (x === pacman.x && y === pacman.y) {
      tile.classList.add('pacman');
      if (currentDirection == "up" || 
          currentDirection == "down" || 
          currentDirection == "left" || 
          currentDirection == "right") {
        tile.classList.add(pacman.direction);
      }
    }
  }
}

function getTileClass(type) {
  switch(type) {
    case WALL: return 'wall';
    case COIN: return 'coin';
    case POWER: return 'power';
    default: return 'ground';
  }
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
  if (ghost && ghost.x !== -1 && ghost.y !== -1) {
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
}
function checkCollision() {
     // ghosts should become blue
  if (ghost && ghost.x !== -1 && ghost.y !== -1) {
      if (pacman.x === ghost.x && pacman.y === ghost.y && !powerActive) {
      // gameOver("Game Over! You were caught by the ghost!");
      gameData[pacman.y][pacman.x] = GROUND;
      updateMap(); // Make sure this updates the visual before modal
      clearInterval(gameSpeedInt);
      showGameOverModal();
      return;
    }
  }

    if (pacman.x === ghost.x && pacman.y === ghost.y && powerActive) {
    // Remove the ghost from the map (or reset its position)
    ghost.x = -1; // Or any value off the grid to "remove" it visually
    ghost.y = -1;
  }
}


function gameLoop() {
  console.log(powerActive);
  console.log(score);

  if (pacman.x === ghost.x && pacman.y === ghost.y) {
    console.log("collided");
  }

  
  if (totalCoins === 0) {
    clearInterval(gameSpeedInt);
    window.location.href = 'https://youtu.be/0nF3FUwhVOw?si=sAxcGLYMdmX_d4tE';
    // gameOver("You Win! All coins collected!");
    return;
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

  checkCollision();

  // each time we get here i want the ghost to move as well, so we will select a random direction for the ghost
  let ghostMove = randomDirection();
  //console.log(randomDirection);
  if (ghostMove == 0) {
    // if its a 
    ghostUp();
  } else if (ghostMove == 1) {
    ghostDown();
  } else if (ghostMove == 2) {
    ghostLeft();
  } else if (ghostMove == 3) {
    ghostRight()
  }

  checkCollision();
  updateMap();
}

function moveDown() {
  pacman.direction = 'down';
  if (gameData[pacman.y+1][pacman.x] !== WALL) {
    if (gameData[pacman.y+1][pacman.x] === POWER){
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      score += 1;
      scoreText.textContent = score;
      powerActive = true;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y+1][pacman.x] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      score += 1;
      scoreText.textContent = score;
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
  if (gameData[ghost.y+1][ghost.x] !== WALL && gameData[ghost.y+1][ghost.x] !== POWER) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y + 1][ghost.x] == COIN){
      gameData[ghost.y][ghost.x] = COIN; // where they are NOW becomes GROUND
    } else if (gameData[ghost.y + 1][ghost.x] == POWER) {
      gameData[ghost.y][ghost.x] = POWER;
    }
    else {
      gameData[ghost.y][ghost.x] = GROUND; // where they are now becomes a coin
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
      score += 1;
      scoreText.textContent = score;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y-1][pacman.x] === COIN){
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      score += 1;
      scoreText.textContent = score;
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
  if (gameData[ghost.y-1][ghost.x] !== WALL && gameData[ghost.y-1][ghost.x] !== POWER) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y-1][ghost.x] == COIN){
      gameData[ghost.y][ghost.x] = COIN; // where they are NOW becomes GROUND
    }// else if (gameData[ghost.y-1][ghost.x] == POWER) {
    //   gameData[ghost.y][ghost.x] = POWER;
    // }
    else {
      gameData[ghost.y][ghost.x] = GROUND; // where they are now becomes a coin
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
      score += 1;
      scoreText.textContent = score;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y][pacman.x-1] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      score += 1;
      scoreText.textContent = score;
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
  if (gameData[ghost.y][ghost.x-1] !== WALL && gameData[ghost.y][ghost.x-1] !== POWER) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y][ghost.x-1] == COIN){
      gameData[ghost.y][ghost.x] = COIN; // where they are NOW becomes GROUND
    } 
    // else if (gameData[ghost.y][ghost.x-1] == POWER) {
    //   gameData[ghost.y][ghost.x] = POWER;
    // }
    else {
      gameData[ghost.y][ghost.x] = GROUND; // where they are now becomes a coin
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
      score += 1;
      scoreText.textContent = score;
      powerActive = true;
      setTimeout(() => {
        powerActive = false; // Deactivate after timeout
    }, 5000); // 5 seconds
    }
    else if (gameData[pacman.y][pacman.x+1] === COIN) {
      gameData[pacman.y][pacman.x] = GROUND;
      totalCoins -= 1;
      score += 1;
      scoreText.textContent = score;
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
  if (gameData[ghost.y][ghost.x+1] !== WALL && gameData[ghost.y][ghost.x+1] !== POWER) {
    // if its not a wall it can be ground or a coin
    // if its a coin, stay as COIN, if its ground stay as ground
    if (gameData[ghost.y][ghost.x+1] == COIN){
      gameData[ghost.y][ghost.x] = COIN; // where they are NOW becomes GROUND
    } 
    // else if (gameData[ghost.y][ghost.x+1] == POWER) {
    //     gameData[ghost.y][ghost.x] = POWER;
    // }
    else {
      gameData[ghost.y][ghost.x] = GROUND; // where they are now becomes a coin
    }
    ghost.x = ghost.x + 1 ;
    gameData[ghost.y][ghost.x] = GHOST;
  }
}

function gameOver(message) {
  clearInterval(gameSpeedInt);

  // Show message and reload
  if (confirm(`${message}\n\nPlay again?`)) {
    location.reload(); // reloads the page
  }
}

function showGameOverModal() {
  const modal = document.getElementById('gameOverModal');
  gameAudio.pause();
  modal.style.display = 'flex'; // Show the modal

  document.getElementById('restartBtn').addEventListener('click', () => {
    gameAudio.currentTime = 0;
    location.reload(); // Simple way to restart game
  });
}


// This function sets up the listener for the whole page.
// Specifically, when the user presses a key, we run a function
// that handles that key press.
function setupKeyboardControls() {
  document.addEventListener('keydown', function (e) {
    gameAudio.play();
    gameAudio.volume = 0.4;
    console.log(e.key);
    if (e.key === "ArrowLeft" || e.key === "a") currentDirection = 'left';
    else if (e.key === "ArrowUp" || e.key === "w") currentDirection = 'up';
    else if (e.key === "ArrowRight" || e.key === "d") currentDirection = 'right';
    else if (e.key === "ArrowDown" || e.key === "s") currentDirection = 'down';
  });

}

const gamepad = document.getElementById('gamepad');

// Set your different gamepad images
const gamepadDefault = '/images/gamepad.png';
const gamepadUp = '/images/gamepadup.png';
const gamepadDown = '/images/gamepadbottom.png';
const gamepadLeft = '/images/gamepadleft.png';
const gamepadRight = '/images/gamepadright.png';

// Handle touches
gamepad.addEventListener('touchstart', function(e) {
  gameAudio.play();
  gameAudio.volume = 0.4;
  const rect = gamepad.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const width = rect.width;
  const height = rect.height;

  // Split into regions: top, bottom, left, right
  if (y < height * 0.25) {
    // Top
    gamepad.src = gamepadUp;
    currentDirection = "up";
  } else if (y > height * 0.75) {
    // Bottom
    gamepad.src = gamepadDown;
    currentDirection = "down";
  } else if (x < width * 0.5) {
    // Left
    gamepad.src = gamepadLeft;
    currentDirection = "left";
  } else {
    // Right
    gamepad.src = gamepadRight;
    currentDirection = "right";
  }
});

// Prevent pinch-zoom
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
});

//-------------------------------------------------------------
// Main game setup function
//-------------------------------------------------------------
function main() {
  // Initialize the game by drawing the map and setting up the
  // keyboard controls.
  // drawMap();
  initMap();
  updateMap();
  setupKeyboardControls();
}

// Finally, after we define all of our functions, we need to start
// the game.
main();
