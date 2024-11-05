const gridWidth = 30;
const gridHeight = 16;
let headX = gridWidth - 1; // Start at the far right
let headY = 0; // Start at the top
let foodX, foodY;
let body = [
    { x: headX, y: headY, direction: 'ArrowLeft' },
    { x: headX + 1, y: headY, direction: 'ArrowLeft' },
    { x: headX + 2, y: headY, direction: 'ArrowLeft' },
    { x: headX + 3, y: headY, direction: 'ArrowLeft' }
];
let turns = []; // To hold the positions of turns
let direction = 'ArrowLeft'; // Initial direction
let score = 0;
let highScore = 0;
let isInMenu = true;  // We start in the menu
let gameInterval;


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

function drawMenu() {
    // Darken the background by overlaying a semi-transparent black surface
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";  // Semi-transparent black
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Full canvas

    // Menu text
    ctx.fillStyle = "white";  // White text
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("Snake Game", canvas.width / 2, canvas.height / 4);
    ctx.font = "20px Arial";
    ctx.fillText("Press 'Enter' to Start", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Press 'Esc' to Quit", canvas.width / 2, canvas.height / 1.5);
}

function handleInput(event) {
    if (isInMenu) {
        // If in the menu screen, handle the Enter and Esc key presses
        if (event.key === "Enter") {
            startGame();  // Start the game when Enter is pressed
        } else if (event.key === "Escape") {
            window.close();  // Close the game window (optional)
        }
    } else {
        // If in the game, handle snake controls (arrow keys)
        if (event.key === "ArrowUp") {
            snake.changeDirection({ x: 0, y: -1 });
        } else if (event.key === "ArrowDown") {
            snake.changeDirection({ x: 0, y: 1 });
        } else if (event.key === "ArrowLeft") {
            snake.changeDirection({ x: -1, y: 0 });
        } else if (event.key === "ArrowRight") {
            snake.changeDirection({ x: 1, y: 0 });
        }
    }
}

function startGame() {
    isInMenu = false;  // Exit the menu
    snake = new Snake();  // Reset the snake
    food = new Food();  // Reset the food
    gameInterval = setInterval(updateGame, 1000 / 15);  // Start the game loop (15 FPS)
}

function gameLoop() {
    if (isInMenu) {
        drawMenu();  // Show the menu screen
    } else {
        updateGame();  // Update and draw the game screen when not in the menu
    }
}

window.addEventListener('keydown', handleInput);  // Handle key events for the menu/game



// Function to place food at the initial position
function placeFood() {
    foodX = Math.floor(Math.random() * gridWidth);
    foodY = Math.floor(Math.random() * gridHeight);
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

// Function to move food in the direction of the snake
function moveFood() {
    clearFood(); // Clear the current food position

    // Move food in the direction of the snake
    switch (direction) {
        case 'ArrowUp':
            if (foodY > 0) foodY--;
            break;
        case 'ArrowDown':
            if (foodY < gridHeight - 1) foodY++;
            break;
        case 'ArrowLeft':
            if (foodX > 0) foodX--;
            break;
        case 'ArrowRight':
            if (foodX < gridWidth - 1) foodX++;
            break;
    }

    // Place food in the new position
    const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);
    foodCell.classList.add('food');
}

// Function to get rotation style based on direction and flip state
function getRotation(direction, flip) {
    let rotation = '';
    switch (direction) {
        case 'ArrowUp':
            rotation = 'rotate(90deg)';
            break;
        case 'ArrowDown':
            rotation = 'rotate(270deg)';
            break;
        case 'ArrowLeft':
            rotation = 'rotate(0deg)';
            break;
        case 'ArrowRight':
            rotation = 'rotate(180deg)';
            break;
    }

    // Apply flipping if needed
    if (flip) {
        rotation += ' scaleY(-1)'; // Vertical flip
    }

    return rotation;
}

// Function to update body segments
function updateBody() {
    const bodyCells = document.querySelectorAll('.cell.body, .cell.tail, .cell.turn');
    bodyCells.forEach(cell => {
        cell.classList.remove('body', 'tail', 'turn');
        cell.style.transform = ''; // Clear previous rotation
    });

    body.forEach((segment, index) => {
        const segmentCell = document.querySelector(`.cell[data-x="${segment.x}"][data-y="${segment.y}"]`);
        
        // Determine if a flip is needed
        let flip = false;

        if (index > 0) {
            const prevSegment = body[index - 1];
            if ((prevSegment.direction === 'ArrowDown' && segment.direction === 'ArrowLeft') ||
                (prevSegment.direction === 'ArrowUp' && segment.direction === 'ArrowRight')) {
                flip = true; // Vertical flip
            } else if ((prevSegment.direction === 'ArrowRight' && segment.direction === 'ArrowDown') ||
                       (prevSegment.direction === 'ArrowLeft' && segment.direction === 'ArrowUp')) {
                flip = true; // Horizontal flip
            }
        }

        // Check if this segment is a turn
        if (index > 0 && segment.direction !== body[index - 1].direction) {
            segmentCell.classList.add('turn');
            segmentCell.style.transform = getRotation(segment.direction, flip); // Set rotation style for turn
        } else {
            segmentCell.classList.add('body');
            segmentCell.style.transform = getRotation(segment.direction, flip); // Set rotation style for body
        }
    });

    if (body.length > 0) {
        const tailCell = document.querySelector(`.cell[data-x="${body[0].x}"][data-y="${body[0].y}"]`);
        tailCell.classList.add('tail'); // Tail
        tailCell.style.transform = getRotation(body[0].direction, false); // Tail rotation without flip
    }

    turns.forEach(turn => {
        const turnCell = document.querySelector(`.cell[data-x="${turn.x}"][data-y="${turn.y}"]`);
        turnCell.classList.add('turn');
        turnCell.style.transform = getRotation(turn.direction, false); // Set rotation for turns without flip
    });
}

// Function to update head (snake head) position
function updateHead() {
    const currentHeadCell = document.querySelector(`.cell[data-x="${headX}"][data-y="${headY}"]`);
    currentHeadCell.classList.add('head');
    currentHeadCell.style.transform = getRotation(direction, false); // Set rotation style without flip
}

// Function to update the score display
function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.innerText = `Score: ${score} | High Score: ${highScore}`;
}

// Function to reset the game
function resetGame() {
    // Clear all head classes from previous positions
    const allHeadCells = document.querySelectorAll('.cell.head, .cell.rotate-up, .cell.rotate-down, .cell.rotate-left, .cell.rotate-right');
    allHeadCells.forEach(cell => {
        cell.classList.remove('head', 'rotate-up', 'rotate-down', 'rotate-left', 'rotate-right');
    });

    headX = gridWidth - 1; // Reset to start at the far right
    headY = 0; // Reset to start at the top
    body = [
        { x: headX, y: headY, direction: 'ArrowLeft' },
        { x: headX + 1, y: headY, direction: 'ArrowLeft' },
        { x: headX + 2, y: headY, direction: 'ArrowLeft' },
        { x: headX + 3, y: headY, direction: 'ArrowLeft' }
    ]; // Start with 4 segments
    turns = []; // Reset turns
    direction = 'ArrowLeft'; // Reset direction
    score = 0;
    clearFood();
    placeFood();
    updateHead();
    updateBody();
    updateScore();
}

// Create a blood effect div and append it to the grid
const bloodEffect = document.createElement('div');
bloodEffect.classList.add('blood');
document.getElementById('grid').appendChild(bloodEffect);

function showBloodEffect(x, y) {
    const cellSize = 50; // Size of each cell in the grid
    const bloodSize = cellSize * 3; // Blood effect covers 3x3 grid

    // Set the position of the blood effect based on the head's coordinates
    bloodEffect.style.left = `${x * cellSize - (bloodSize / 2) + (cellSize / 2)}px`; // Centering the blood effect
    bloodEffect.style.top = `${y * cellSize - (bloodSize / 2) + (cellSize / 2)}px`; // Centering the blood effect
    bloodEffect.style.display = 'block'; // Make it visible
    bloodEffect.style.opacity = '1'; // Reset opacity

    // Fade out after 3 seconds
    setTimeout(() => {
        bloodEffect.style.opacity = '0'; // Fade out
    }, 0); // Start fading immediately

    // Hide the image after fading out
    setTimeout(() => {
        bloodEffect.style.display = 'none';
    }, 3000); // Match the duration of the fade out
}




// Move the snake in the current direction
function moveSnake() {
    let newX = headX;
    let newY = headY;

    switch (direction) {
        case 'ArrowUp':
            if (headY > 0) newY--;
            break;
        case 'ArrowDown':
            if (headY < gridHeight - 1) newY++;
            break;
        case 'ArrowLeft':
            if (headX > 0) newX--;
            break;
        case 'ArrowRight':
            if (headX < gridWidth - 1) newX++;
            break;
    }

    // Check for wall collisions
    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
        resetGame();
        return;
    }

    // Check for food collision
    if (newX === foodX && newY === foodY) {
        body.push({ x: headX, y: headY, direction });
        clearFood();
        placeFood();
        showBloodEffect(headX, headY); // Show blood effect at the head position
        score++;
        if (score > highScore) {
            highScore = score; // Update high score
        }
    } else {
        // Move the body
        body.push({ x: headX, y: headY, direction });
        body.shift(); // Remove the tail segment
    }

    // Check for self-collision
    if (body.slice(0, -1).some(segment => segment.x === newX && segment.y === newY)) {
        resetGame();
        return;
    }

    // Update the direction and handle turns
    if (direction !== body[body.length - 1]?.direction) {
        handleTurn();
    }

    // Check if the new head position is occupied by the body
    const previousHeadCell = document.querySelector(`.cell[data-x="${headX}"][data-y="${headY}"]`);
    if (previousHeadCell) {
        previousHeadCell.classList.remove('head', 'rotate-up', 'rotate-down', 'rotate-left', 'rotate-right');
    }

    // Set the new head position
    headX = newX;
    headY = newY;

    // Update body and head
    updateBody();  // Update the body first
    updateHead();  // Update the head last
    updateScore();
}

// Handle keydown events to change direction
window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        if (event.key === 'ArrowUp' && direction !== 'ArrowDown') {
            direction = 'ArrowUp';
        } else if (event.key === 'ArrowDown' && direction !== 'ArrowUp') {
            direction = 'ArrowDown';
        } else if (event.key === 'ArrowLeft' && direction !== 'ArrowRight') {
            direction = 'ArrowLeft';
        } else if (event.key === 'ArrowRight' && direction !== 'ArrowLeft') {
            direction = 'ArrowRight';
        }
    }
});

// Game loop to move the snake every 200 milliseconds
setInterval(() => {
    moveSnake();
}, 200);

setInterval(()=> {
    moveFood();
},800);

// Initialize player position and place food
updateHead();
placeFood();
updateScore();
