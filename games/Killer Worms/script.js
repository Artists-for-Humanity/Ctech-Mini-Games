const gridWidth = 30;
const gridHeight = 16;
let playerX = 0;
let playerY = 0;
let foodX, foodY;
let snake = [
    { x: playerX, y: playerY },
    { x: playerX - 1, y: playerY },
    { x: playerX - 2, y: playerY },
    { x: playerX - 3, y: playerY }
];
let direction = 'ArrowRight'; // Initial direction
let score = 0;
let highScore = 0;

// Create the grid
const grid = document.getElementById('grid');
for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        grid.appendChild(cell);
    }
}

// Function to place food at a random position
function placeFood() {
    do {
        foodX = Math.floor(Math.random() * gridWidth);
        foodY = Math.floor(Math.random() * gridHeight);
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY)); // Ensure food doesn't spawn on the snake

    const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);
    foodCell.classList.add('food');
}

// Function to clear food from the grid
function clearFood() {
    const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);
    if (foodCell) {
        foodCell.classList.remove('food');
    }
}

// Function to update player (snake) position
function updatePlayer() {
    // Clear previous player positions
    const previousCell = document.querySelector('.cell.player');
    if (previousCell) {
        previousCell.classList.remove('player');
    }

    // Draw the snake
    const snakeCells = document.querySelectorAll('.cell.snake');
    snakeCells.forEach(cell => cell.classList.remove('snake'));

    // Set new player position
    const currentCell = document.querySelector(`.cell[data-x="${playerX}"][data-y="${playerY}"]`);
    currentCell.classList.add('player');

    // Draw the snake segments
    snake.forEach(segment => {
        const segmentCell = document.querySelector(`.cell[data-x="${segment.x}"][data-y="${segment.y}"]`);
        segmentCell.classList.add('snake');
    });
}

// Function to update the score display
function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.innerText = `Score: ${score} | High Score: ${highScore}`;
}

// Function to reset the game
function resetGame() {
    playerX = 0;
    playerY = 0;
    snake = [
        { x: playerX, y: playerY },
        { x: playerX - 1, y: playerY },
        { x: playerX - 2, y: playerY },
        { x: playerX - 3, y: playerY }
    ]; // Start with 4 segments
    direction = 'ArrowRight';
    score = 0;
    clearFood(); // Clear food when resetting
    placeFood(); // Place new food
    updatePlayer();
    updateScore();
}

// Move the snake in the current direction
function moveSnake() {
    // Calculate new head position based on direction
    let newX = playerX;
    let newY = playerY;

    switch (direction) {
        case 'ArrowUp':
            if (playerY > 0) newY--;
            break;
        case 'ArrowDown':
            if (playerY < gridHeight - 1) newY++;
            break;
        case 'ArrowLeft':
            if (playerX > 0) newX--;
            break;
        case 'ArrowRight':
            if (playerX < gridWidth - 1) newX++;
            break;
    }

    // Check for collisions with the border
    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
        resetGame();
        return;
    }

    // Check for food collision
    if (newX === foodX && newY === foodY) {
        // Grow the snake
        snake.push({ x: playerX, y: playerY }); // Add current position to the snake
        const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);

        foodCell.classList.remove('food'); 
        placeFood(); // Place new food
        score++; // Increase score
        if (score > highScore) {
            highScore = score; // Update high score
        }
    } else {
        // Move the snake by removing the tail
        snake.push({ x: playerX, y: playerY });
        snake.shift(); // Remove the last segment of the snake
    }

    // Check for collisions with itself
    if (snake.slice(0, -1).some(segment => segment.x === newX && segment.y === newY)) {
        resetGame();
        return;
    }

    playerX = newX;
    playerY = newY;
    updatePlayer();
    updateScore(); // Update the score display
}

// Handle keydown events to change direction
window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Prevent reversing direction
        if (event.key === 'ArrowUp' && direction !== 'ArrowDown') direction = 'ArrowUp';
        else if (event.key === 'ArrowDown' && direction !== 'ArrowUp') direction = 'ArrowDown';
        else if (event.key === 'ArrowLeft' && direction !== 'ArrowRight') direction = 'ArrowLeft';
        else if (event.key === 'ArrowRight' && direction !== 'ArrowLeft') direction = 'ArrowRight';
    }
});

// Game loop to move the snake every 150 milliseconds
setInterval(moveSnake, 150);

// Initialize player position and place food
updatePlayer();
placeFood();
updateScore(); 
