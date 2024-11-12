// Grid dimensions
const gridWidth = 30;
const gridHeight = 16;

// Initial game state
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
let cacti = []; // Array to hold cactus positions
let canChangeDirection = true;  // Flag to track if direction change is allowed
let nextDirection = null;  // Store the next direction to move after the delay
const directionCooldown = 1;  // Cooldown time in milliseconds (200ms)



function startCooldown() {
    canChangeDirection = false; // Block further direction changes
    setTimeout(() => {
        canChangeDirection = true; // Allow direction changes after cooldown
    }, directionCooldown);
}

// Create the grid and initialize cells
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

// Create a blood effect div and append it to the grid
const bloodEffect = document.createElement('div');
bloodEffect.classList.add('blood');
document.getElementById('grid').appendChild(bloodEffect);

// === Helper Functions ===

// Function to update the score display
function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.innerText = `Score: ${score} | High Score: ${highScore}`;
}

function startCooldown() {
    canChangeDirection = false; // Block further direction changes
    setTimeout(() => {
        canChangeDirection = true; // Allow direction changes after cooldown
    }, directionCooldown);
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

// === Game State Functions ===

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

// === Reset Game Function ===

// Function to reset the game
function resetGame() {
    // Clear all head classes from previous positions
    const allHeadCells = document.querySelectorAll('.cell.head, .cell.rotate-up, .cell.rotate-down, .cell.rotate-left, .cell.rotate-right');
    allHeadCells.forEach(cell => {
        cell.classList.remove('head', 'rotate-up', 'rotate-down', 'rotate-left', 'rotate-right');
    });

    // Clear all cacti
    const allCactusCells = document.querySelectorAll('.cell.cactus');
    allCactusCells.forEach(cell => {
        cell.classList.remove('cactus');
    });

    // Clear all rocks
    const allRockCells = document.querySelectorAll('.cell.rock');
    allRockCells.forEach(cell => {
        cell.classList.remove('rock');
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
    placeFood(); // Place food initially
    placeCacti();  // Place 25 cacti initially
    placeRocks();  // Place 20 rocks initially
    updateHead();
    updateBody();
    updateScore();
}


// === Place Rocks ===

// Function to place 20 rocks randomly on the grid
function placeRocks() {
    rocks = []; // Reset the rocks array

    for (let i = 0; i < 20; i++) {
        let rockX, rockY;
        // Randomly place each rock, avoiding the snake's head, body, and food
        do {
            rockX = Math.floor(Math.random() * gridWidth);
            rockY = Math.floor(Math.random() * gridHeight);
        } while (
            (rockX === headX && rockY === headY) || // Avoid the snake head
            body.some(segment => segment.x === rockX && segment.y === rockY) || // Avoid the body
            (rockX === foodX && rockY === foodY) // Avoid the food
        );

        rocks.push({ x: rockX, y: rockY });
        const rockCell = document.querySelector(`.cell[data-x="${rockX}"][data-y="${rockY}"]`);
        if (rockCell) {
            rockCell.classList.add('rock');
        }
    }
}

// === Rock Collision Function ===

// Function to handle collisions with rocks
function handleRockCollision(x, y) {
    // Add a visual effect to show the collision with a rock
    showRockEffect(x, y);
}

// === Rock Visual Effect ===

// Function to show a collision effect when hitting a rock
function showRockEffect(x, y) {
    const cellSize = 50;
    const rockEffectSize = cellSize * 2;

    // Set the position of the effect based on the rock's coordinates
    bloodEffect.style.left = `${x * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.top = `${y * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.display = 'block';
    bloodEffect.style.opacity = '1';

    setTimeout(() => {
        bloodEffect.style.opacity = '0';
    }, 1000);

    setTimeout(() => {
        bloodEffect.style.display = 'none';
    }, 2000);
}

// Function to handle collisions with rocks
function handleRockCollision(x, y) {
    // Add a visual effect to show the collision with a rock
    showRockEffect(x, y);
}

// === Rock Visual Effect ===

// Function to show a collision effect when hitting a rock
function showRockEffect(x, y) {
    const cellSize = 50;
    const rockEffectSize = cellSize * 2;

    // Set the position of the effect based on the rock's coordinates
    bloodEffect.style.left = `${x * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.top = `${y * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.display = 'block';
    bloodEffect.style.opacity = '1';

    setTimeout(() => {
        bloodEffect.style.opacity = '0';
    }, 1000);

    setTimeout(() => {
        bloodEffect.style.display = 'none';
    }, 2000);
}

// === Blood Effect ===

// Function to show blood effect at the head's position
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

// === Rendering Functions ===

// Function to update head (snake head) position
function updateHead() {
    const currentHeadCell = document.querySelector(`.cell[data-x="${headX}"][data-y="${headY}"]`);
    currentHeadCell.classList.add('head');
    currentHeadCell.style.transform = getRotation(direction, false); // Set rotation style without flip
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

// === Cacti Functions ===

// Function to place  cacti randomly
function placeCacti() {
    cacti = []; // Reset the cactus array

    for (let i = 0; i < 25; i++) {
        let cactusX, cactusY;
        // Randomly place each cactus, avoiding the snake's head, body, and food
        do {
            cactusX = Math.floor(Math.random() * gridWidth);
            cactusY = Math.floor(Math.random() * gridHeight);
        } while (
            (cactusX === headX && cactusY === headY) || // Avoid the snake head
            body.some(segment => segment.x === cactusX && segment.y === cactusY) || // Avoid the body
            (cactusX === foodX && cactusY === foodY) // Avoid the food
        );

        cacti.push({ x: cactusX, y: cactusY });
        const cactusCell = document.querySelector(`.cell[data-x="${cactusX}"][data-y="${cactusY}"]`);
        if (cactusCell) {
            cactusCell.classList.add('cactus');
        }
    }
}

// === Game Loop ===

function moveSnake() {
    // If there is a queued direction, update it
    if (nextDirection) {
        direction = nextDirection;
        nextDirection = null;  // Clear the next direction after applying it
    }

    let newX = headX;
    let newY = headY;

    // Move the snake based on the current direction
    switch (direction) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
    }

    // Check if the head goes out of bounds (any direction beyond the grid)
    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
        resetGame();  // Reset the game if the head goes out of bounds
        return;  // Exit the function to prevent further movement
    }

    // Check for food collision
    if (newX === foodX && newY === foodY) {
        body.push({ x: headX, y: headY, direction });
        clearFood();
        placeFood();
        showBloodEffect(headX, headY);
        score++;
        if (score > highScore) {
            highScore = score;
        }
    } else {
        // Move the body
        body.push({ x: headX, y: headY, direction });
        body.shift(); // Remove the tail
    }

    // Check for self-collision
    if (body.slice(0, -1).some(segment => segment.x === newX && segment.y === newY)) {
        resetGame();  // Reset if the snake collides with itself
        return;
    }

    // Handle cactus collision
    if (cacti.some(cactus => cactus.x === newX && cactus.y === newY)) {
        resetGame();  // Reset if the snake collides with a cactus
        return;
    }

    // Handle rock collision, but don't reset the game
    if (rocks.some(rock => rock.x === newX && rock.y === newY)) {
        handleRockCollision(newX, newY);
    }

    // Remove the previous head
    const previousHeadCell = document.querySelector(`.cell[data-x="${headX}"][data-y="${headY}"]`);
    if (previousHeadCell) {
        previousHeadCell.classList.remove('head');
        previousHeadCell.style.transform = ''; // Clear the rotation style
    }

    // Set the new head position
    headX = newX;
    headY = newY;

    // === New Check: Reset if only the head remains ===
    if (body.length === 0) {
        resetGame();  // Reset if there are no body segments (only the head remains)
        return;  // Exit early as the game is reset
    }

    // Update the body and head
    updateBody();  // Update body first
    updateHead();  // Then update the head last
    updateScore();
}



// === Rock Collision Function ===

// Function to handle collisions with rocks
function handleRockCollision(x, y) {
    // Remove the rock from the grid
    removeRock(x, y);

    // Shrink the snake by removing the last body segment (tail)
    if (body.length > 0) {
        body.pop(); // Remove the last segment of the body (tail)
    }

    // Show a visual effect when colliding with the rock
    showRockEffect(x, y);
}

// Function to remove the rock from the grid
function removeRock(x, y) {
    // Find the rock in the grid and remove it
    const rockIndex = rocks.findIndex(rock => rock.x === x && rock.y === y);
    if (rockIndex !== -1) {
        // Remove from the array
        rocks.splice(rockIndex, 1);

        // Remove the rock class from the grid cell
        const rockCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (rockCell) {
            rockCell.classList.remove('rock');
        }
    }
}

// === Rock Visual Effect ===

// Function to show a collision effect when hitting a rock
function showRockEffect(x, y) {
    const cellSize = 50;
    const rockEffectSize = cellSize * 2;

    // Set the position of the effect based on the rock's coordinates
    bloodEffect.style.left = `${x * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.top = `${y * cellSize - (rockEffectSize / 2) + (cellSize / 2)}px`;
    bloodEffect.style.display = 'block';
    bloodEffect.style.opacity = '1';

    setTimeout(() => {
        bloodEffect.style.opacity = '0';
    }, 1000);

    setTimeout(() => {
        bloodEffect.style.display = 'none';
    }, 2000);
}

// === Initial Setup ===
placeRocks();  // Place 20 rocks initially

// === Input Handling ===

window.addEventListener('keydown', (event) => {
    // Only process the event if the cooldown is not active
    if (canChangeDirection && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Ensure the snake doesn't reverse into itself
        if (event.key === 'ArrowUp' && direction !== 'ArrowDown') {
            nextDirection = 'ArrowUp';  // Queue the direction change
            startCooldown();  // Start cooldown after direction change
        } else if (event.key === 'ArrowDown' && direction !== 'ArrowUp') {
            nextDirection = 'ArrowDown';  // Queue the direction change
            startCooldown();  // Start cooldown after direction change
        } else if (event.key === 'ArrowLeft' && direction !== 'ArrowRight') {
            nextDirection = 'ArrowLeft';  // Queue the direction change
            startCooldown();  // Start cooldown after direction change
        } else if (event.key === 'ArrowRight' && direction !== 'ArrowLeft') {
            nextDirection = 'ArrowRight';  // Queue the direction change
            startCooldown();  // Start cooldown after direction change
        }
    }
});


// === Game Loops ===

// Game loop to move the snake every 200 milliseconds
setInterval(() => {
    moveSnake();
}, 200);

// Move food every 800 milliseconds
setInterval(() => {
    moveFood();
}, 800);

// === Initial Setup ===
updateHead();
placeFood();
placeCacti();  // Place 20 cacti initially
updateScore();
