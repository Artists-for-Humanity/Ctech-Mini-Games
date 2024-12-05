// Grid dimensions
const gridWidth = 30;
const gridHeight = 16;

// Initial game state
let headX = gridWidth - 1; // Start at the far right
let headY = 0; // Start at the top
let foodX, foodY, food1X, food1Y, food2X, food2Y; 
let body = [
    { x: headX, y: headY, direction: 'ArrowLeft' },
    { x: headX + 1, y: headY, direction: 'ArrowLeft' },
    { x: headX + 2, y: headY, direction: 'ArrowLeft' },
];
let turns = []; // To hold the positions of turns
let direction = 'ArrowLeft'; // Initial direction
let score = 0;
let highScore = 0;
let cacti = []; // Array to hold cactus positions
let canChangeDirection = true;  // Flag to track if direction change is allowed
let nextDirection = null;  // Store the next direction to move after the delay
const directionCooldown = 1;  // Cooldown time in milliseconds (200ms)

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const gameCanvas = document.getElementById('game-canvas');
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        // Hide the main menu
        mainMenu.style.display = 'none';

        // Show the game canvas
        gameCanvas.style.display = 'block';

        // Initialize your snake game here
        startGame();
    });

    function startGame() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Snake game logic here
        console.log('Game started!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const gameCanvas = document.getElementById('game-canvas');
    const startButton = document.getElementById('start-button');

    // Start button click event
    startButton.addEventListener('click', () => {
        // Hide the main menu
        mainMenu.style.display = 'none';

        // Show the game canvas
        gameCanvas.style.display = 'block';

        resetGame();
        
        // Initialize your snake game here
        startGame();
    });

    // Listen for the Escape key to bring back the main menu
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Show the main menu
            mainMenu.style.display = 'flex';

            // Hide the game canvas
            gameCanvas.style.display = 'none';

            // Optional: Reset the game state if needed
            resetGame();
        }
    });

    function startGame() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Your snake game logic here
        console.log('Game started!');
    }

    function resetGame() {
        // Add logic to reset your game here if needed
        console.log('Game reset!');
    }
});


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

// === Game State Functions ===

// Function to place food at the initial position
function placeFood(type) {
    let foodXToPlace, foodYToPlace, foodClass;

    if (type === 'food') {
        foodClass = 'food';
    } else if (type === 'food1') {
        foodClass = 'food1';
    } else if (type === 'food2') {
        foodClass = 'food2';
    } else {
        console.error(`Unknown food type: ${type}`);
        return;
    }

    // Ensure the new position doesn't overlap with snake, obstacles, or other foods
    do {
        foodXToPlace = Math.floor(Math.random() * gridWidth);
        foodYToPlace = Math.floor(Math.random() * gridHeight);
    } while (
        body.some(segment => segment.x === foodXToPlace && segment.y === foodYToPlace) || // Avoid snake body
        cacti.some(cactus => cactus.x === foodXToPlace && cactus.y === foodYToPlace) ||  // Avoid cacti
        rocks.some(rock => rock.x === foodXToPlace && rock.y === foodYToPlace) ||        // Avoid rocks
        (type !== 'food' && foodXToPlace === foodX && foodYToPlace === foodY) ||        // Avoid main food
        (type !== 'food1' && foodXToPlace === food1X && foodYToPlace === food1Y) ||     // Avoid food1
        (type !== 'food2' && foodXToPlace === food2X && foodYToPlace === food2Y)        // Avoid food2
    );

    // Assign the new position to the correct food variable
    if (type === 'food') {
        foodX = foodXToPlace;
        foodY = foodYToPlace;
    } else if (type === 'food1') {
        food1X = foodXToPlace;
        food1Y = foodYToPlace;
    } else if (type === 'food2') {
        food2X = foodXToPlace;
        food2Y = foodYToPlace;
    }

    // Place the food on the grid
    const foodCell = document.querySelector(`.cell[data-x="${foodXToPlace}"][data-y="${foodYToPlace}"]`);
    if (foodCell) {
        foodCell.classList.add(foodClass);
    } else {
        console.error(`Failed to place ${foodClass} at (${foodXToPlace}, ${foodYToPlace})`);
    }
}

// Function to clear food from the grid
function clearFood(type) {
    if (type === 'food') {
        const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);
        if (foodCell) foodCell.classList.remove('food');
    } else if (type === 'food1') {
        const food1Cell = document.querySelector(`.cell[data-x="${food1X}"][data-y="${food1Y}"]`);
        if (food1Cell) food1Cell.classList.remove('food1');
    } else if (type === 'food2') {
        const food2Cell = document.querySelector(`.cell[data-x="${food2X}"][data-y="${food2Y}"]`);
        if (food2Cell) food2Cell.classList.remove('food2');
    }
}

// Function to move food randomly to a neighboring spot, avoiding obstacles
function moveFood() {
    clearFood('food'); // Clear the main food

    const directions = [
        { dx: 0, dy: -1 },  // Up
        { dx: 0, dy: 1 },   // Down
        { dx: -1, dy: 0 },  // Left
        { dx: 1, dy: 0 }    // Right
    ];

    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newX = foodX + randomDirection.dx;
    const newY = foodY + randomDirection.dy;

    if (
        newX >= 0 && newX < gridWidth &&
        newY >= 0 && newY < gridHeight &&
        !body.some(segment => segment.x === newX && segment.y === newY) && // Avoid snake body
        !cacti.some(cactus => cactus.x === newX && cactus.y === newY) &&   // Avoid cacti
        !rocks.some(rock => rock.x === newX && rock.y === newY) &&         // Avoid rocks
        !(newX === food1X && newY === food1Y) &&                          // Avoid food1
        !(newX === food2X && newY === food2Y)                             // Avoid food2
    ) {
        foodX = newX;
        foodY = newY;
    }

    const foodCell = document.querySelector(`.cell[data-x="${foodX}"][data-y="${foodY}"]`);
    if (foodCell) foodCell.classList.add('food');
}

// Move second food (food1)
function moveFood1() {
    clearFood('food1'); // Clear the second food

    const directions = [
        { dx: 0, dy: -1 },  // Up
        { dx: 0, dy: 1 },   // Down
        { dx: -1, dy: 0 },  // Left
        { dx: 1, dy: 0 }    // Right
    ];

    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newX = food1X + randomDirection.dx;
    const newY = food1Y + randomDirection.dy;

    if (
        newX >= 0 && newX < gridWidth &&
        newY >= 0 && newY < gridHeight &&
        !body.some(segment => segment.x === newX && segment.y === newY) && // Avoid snake body
        !cacti.some(cactus => cactus.x === newX && cactus.y === newY) &&   // Avoid cacti
        !rocks.some(rock => rock.x === newX && rock.y === newY) &&         // Avoid rocks
        !(newX === foodX && newY === foodY) &&                            // Avoid food
        !(newX === food2X && newY === food2Y)                             // Avoid food2
    ) {
        food1X = newX;
        food1Y = newY;
    }

    const food1Cell = document.querySelector(`.cell[data-x="${food1X}"][data-y="${food1Y}"]`);
    if (food1Cell) food1Cell.classList.add('food1');
}

// Move third food (food2)
function moveFood2() {
    clearFood('food2'); // Clear the third food

    const directions = [
        { dx: 0, dy: -1 },  // Up
        { dx: 0, dy: 1 },   // Down
        { dx: -1, dy: 0 },  // Left
        { dx: 1, dy: 0 }    // Right
    ];

    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newX = food2X + randomDirection.dx;
    const newY = food2Y + randomDirection.dy;

    if (
        newX >= 0 && newX < gridWidth &&
        newY >= 0 && newY < gridHeight &&
        !body.some(segment => segment.x === newX && segment.y === newY) && // Avoid snake body
        !cacti.some(cactus => cactus.x === newX && cactus.y === newY) &&   // Avoid cacti
        !rocks.some(rock => rock.x === newX && rock.y === newY) &&         // Avoid rocks
        !(newX === foodX && newY === foodY) &&                            // Avoid food
        !(newX === food1X && newY === food1Y)                             // Avoid food1
    ) {
        food2X = newX;
        food2Y = newY;
    }

    const food2Cell = document.querySelector(`.cell[data-x="${food2X}"][data-y="${food2Y}"]`);
    if (food2Cell) food2Cell.classList.add('food2');
}


// === Place Rocks ===

// Function to place rocks 
function placeRocks() {
    rocks = []; // Reset the rocks array

    for (let i = 0; i < 12; i++) {
        let rockX, rockY;
        // Randomly place each rock, avoiding the snake's head, body, food, cacti, and restricted area
        do {
            rockX = Math.floor(Math.random() * gridWidth);
            rockY = Math.floor(Math.random() * gridHeight);
        } while (
            (rockX === headX && rockY === headY) || // Avoid the snake head
            body.some(segment => segment.x === rockX && segment.y === rockY) || // Avoid the body
            (rockX === foodX && rockY === foodY) || // Avoid main food
            (rockX === food1X && rockY === food1Y) || // Avoid food1
            (rockX === food2X && rockY === food2Y) || // Avoid food2
            cacti.some(cactus => cactus.x === rockX && cactus.y === rockY) || // Avoid cacti
            (rockX >= gridWidth - 5 && rockY < 5) // Avoid the top-right 5x5 area
        );

        rocks.push({ x: rockX, y: rockY });
        const rockCell = document.querySelector(`.cell[data-x="${rockX}"][data-y="${rockY}"]`);
        if (rockCell) {
            // Randomly assign one of the rock classes
            const rockClasses = ['rock1', 'rock2', 'rock3'];
            const randomRockClass = rockClasses[Math.floor(Math.random() * rockClasses.length)];
            rockCell.classList.add(randomRockClass);
        }
    }
}


// === Rock Collision Function ===

// Function to handle collisions with rocks
function handleRockCollision(x, y) {
    console.log(`Snake hit a rock at (${x}, ${y})`);
    removeRock(x, y); // Remove the rock
    // You can add additional logic here, such as shrinking the snake
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

// === Cacti Functions ===

// Function to place cacti randomly
function placeCacti() {
    cacti = []; // Reset the cactus array

    for (let i = 0; i < 25; i++) {
        let cactusX, cactusY;
        // Randomly place each cactus, avoiding the snake's head, body, food, rocks, and restricted area
        do {
            cactusX = Math.floor(Math.random() * gridWidth);
            cactusY = Math.floor(Math.random() * gridHeight);
        } while (
            (cactusX === headX && cactusY === headY) || // Avoid the snake head
            body.some(segment => segment.x === cactusX && segment.y === cactusY) || // Avoid the body
            (cactusX === foodX && cactusY === foodY) || // Avoid food
            (cactusX === food1X && cactusY === food1Y) || // Avoid food1
            (cactusX === food2X && cactusY === food2Y) || // Avoid food2
            rocks.some(rock => rock.x === cactusX && rock.y === cactusY) || // Avoid rocks
            (cactusX >= gridWidth - 5 && cactusY < 5) // Avoid the top-right 5x5 area
        );

        cacti.push({ x: cactusX, y: cactusY });
        const cactusCell = document.querySelector(`.cell[data-x="${cactusX}"][data-y="${cactusY}"]`);
        if (cactusCell) {
            cactusCell.classList.add('cactus');
        }
    }
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

// Create a blood effect div and append it to the grid
const bloodEffect = document.createElement('div');
bloodEffect.classList.add('blood');
document.getElementById('grid').appendChild(bloodEffect);

// function to handle cooldown before you can move //
function startCooldown() {
    canChangeDirection = false; // Block further direction changes
    setTimeout(() => {
        canChangeDirection = true; // Allow direction changes after cooldown
    }, directionCooldown);
}

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

// === Game Loop ===
function moveSnake() {
    // Handle queued direction changes if any
    if (nextDirection) {
        direction = nextDirection; // Apply the queued direction
        nextDirection = null; // Clear the queue
    }

    // Determine the new head position based on the current direction
    let newX = headX;
    let newY = headY;

    switch (direction) {
        case 'ArrowUp':
            newY--; // Move up
            break;
        case 'ArrowDown':
            newY++; // Move down
            break;
        case 'ArrowLeft':
            newX--; // Move left
            break;
        case 'ArrowRight':
            newX++; // Move right
            break;
    }

    // Check if the new head position is out of bounds
    if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
        resetGame(); // Snake hits the wall; reset the game
        return;
    }

    // Check if the new head position collides with the snake's body
    if (body.some(segment => segment.x === newX && segment.y === newY)) {
        resetGame(); // Snake hits itself; reset the game
        return;
    }

    // Handle food collisions
    if (newX === foodX && newY === foodY) {
        // Collision with main food
        body.push({ x: headX, y: headY, direction }); // Add a new segment
        clearFood('food'); // Clear the eaten food
        placeFood('food'); // Re-place only the eaten food
        showBloodEffect(newX, newY); // Trigger blood effect at the head's position
        score++; // Increase score
        if (score > highScore) highScore = score; // Update high score
    } else if (newX === food1X && newY === food1Y) {
        // Collision with food1
        body.push({ x: headX, y: headY, direction }); // Add a new segment
        clearFood('food1'); // Clear the eaten food
        placeFood('food1'); // Re-place only the eaten food
        showBloodEffect(newX, newY); // Trigger blood effect at the head's position
        score += 1.5; // Increase score
        if (score > highScore) highScore = score; // Update high score
    } else if (newX === food2X && newY === food2Y) {
        // Collision with food2
        body.push({ x: headX, y: headY, direction }); // Add a new segment
        clearFood('food2'); // Clear the eaten food
        placeFood('food2'); // Re-place only the eaten food
        showBloodEffect(newX, newY); // Trigger blood effect at the head's position
        score += 2; // Increase score
        if (score > highScore) highScore = score; // Update high score
    } else {
        // Normal move: Shift the snake's body
        body.push({ x: headX, y: headY, direction }); // Add the current head
        body.shift(); // Remove the tail
    }

    // Check for collisions with obstacles
    if (cacti.some(cactus => cactus.x === newX && cactus.y === newY)) {
        resetGame(); // Snake hits a cactus; reset the game
        return;
    }
    if (rocks.some(rock => rock.x === newX && rock.y === newY)) {
        handleRockCollision(newX, newY); // Snake hits a rock; handle appropriately
    }

    // === New Check: Reset if only the head remains ===
    if (body.length === 0) {
        resetGame(); // Reset if there are no body segments (only the head remains)
        return; // Exit early as the game is reset
    }

    // Update the head's position
    const oldHeadX = headX;
    const oldHeadY = headY;
    headX = newX;
    headY = newY;

    // Remove the old head's visuals and adjust rotation
    const oldHeadCell = document.querySelector(`.cell[data-x="${oldHeadX}"][data-y="${oldHeadY}"]`);
    if (oldHeadCell) oldHeadCell.classList.remove('head');

    // Add visuals for the new head position
    const newHeadCell = document.querySelector(`.cell[data-x="${headX}"][data-y="${headY}"]`);
    if (newHeadCell) {
        newHeadCell.classList.add('head');
        newHeadCell.style.transform = getRotation(direction, false); // Rotate the head
    }

    // Update the visuals for the body
    updateBody();

    // Update the score display
    updateScore();
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

// Function to remove a rock from the grid
function removeRock(x, y) {
    // Find the index of the rock in the rocks array
    const rockIndex = rocks.findIndex(rock => rock.x === x && rock.y === y);

    if (rockIndex !== -1) {
        // Remove the rock from the array
        rocks.splice(rockIndex, 1);

        // Get the cell for the rock
        const rockCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);

        if (rockCell) {
            // Remove all potential rock classes (rock1, rock2, rock3)
            rockCell.classList.remove('rock1', 'rock2', 'rock3');
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

placeRocks(); 

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

    // Remove all rocks from the grid
    rocks.forEach(rock => {
        const rockCell = document.querySelector(`.cell[data-x="${rock.x}"][data-y="${rock.y}"]`);
        if (rockCell) {
            rockCell.classList.remove('rock1', 'rock2', 'rock3'); // Remove all rock classes
        }
    });
    rocks = []; // Clear the rocks array

    // Reset snake position
    headX = gridWidth - 1; // Reset to start at the far right
    headY = 0; // Reset to start at the top
    body = [
        { x: headX, y: headY, direction: 'ArrowLeft' },
        { x: headX + 1, y: headY, direction: 'ArrowLeft' },
        { x: headX + 2, y: headY, direction: 'ArrowLeft' },
    ]; 
    turns = []; // Reset turns
    direction = 'ArrowLeft'; // Reset direction
    score = 0;

    // Clear and re-place food
    clearFood();
    placeFood();

    // Re-place cacti and rocks
    placeCacti();
    placeRocks();

    // Update visuals
    updateHead();
    updateBody();
    updateScore();
}

// === Game Loops ===
setInterval(() => {
    moveSnake();
}, 200);

setInterval(() => {
    moveFood();
}, 1200);

setInterval(() => {
    moveFood1();
}, 1000);

setInterval(() => {
    moveFood2();
}, 800);

// === Initial Setup ===
updateHead();
placeFood('food');
placeFood('food1');
placeFood('food2');
placeCacti();
updateScore();
