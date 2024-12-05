// DOM elements
const sprite = document.getElementById('sprite');
const gameCanvas = document.getElementById('gameCanvas');
const collisionImage = document.getElementById('collisionImage');
const winPanel = document.getElementById('winPanel');
const resetButton = document.getElementById('resetButton');
const winAreaElement = document.getElementById('winArea');
const enemy = {
    x: 300, // Initial x position
    y: 400, // Initial y position
    speed: 2, // Movement speed
    direction: 1, // 1 for right, -1 for left
    patrolRange: 200 // Distance to patrol
  };
let collisionTimeout;


// Sprite properties
let spriteX = 30;
let spriteY = 750;
const spriteWidth = 50;
const spriteHeight = 50;
const spriteSpeed = 5;
const initialSpriteX = 30;
const initialSpriteY = 750;

/// Define maze barriers
const barriers = [
    { x: 0, y: 75, width: 700, height: 50, element: document.getElementById('barrier1') },
    { x: 400, y: 125, width: 300, height: 75, element: document.getElementById('barrier2') },
    { x: 0, y: 380, width: 180, height: 50, element: createBarrier() },
    { x: 250, y: 200, width: 50, height: 230, element: createBarrier() },
    { x: 100, y: 500, width: 500, height: 40, element: createBarrier() },
    { x: 670, y: 300, width: 60, height: 300, element: createBarrier() },
    { x: 800, y: 100, width: 50, height: 500, element: createBarrier() },
    { x: 850, y: 550, width: 300, height: 50, element: createBarrier() },
    { x: 1150, y: 400, width: 50, height: 150, element: createBarrier() },
    { x: 0, y: 820, width: 1250, height: 40, element: createBarrier() },
    { x: 0, y: 0, width: 10, height: 850, element: createBarrier() },
    { x: 0, y: 0, width: 1280, height: 10, element: createBarrier() },
    { x: 100, y: 200, width: 150, height: 50, element: createBarrier() },
    { x: 370, y: 380, width: 300, height: 50, element: createBarrier() },
    { x: 500, y: 500, width: 100, height: 225, element: createBarrier() },
    { x: 500, y:770, width: 200, height: 50, element: createBarrier() },
    { x: 310, y:630, width: 130, height: 100, element: createBarrier() },
    { x: 600, y:630, width: 200, height: 100, element: createBarrier() },
    { x: 200, y: 610, width: 50, height: 220, element: createBarrier() }
];

// Win area (target destination coordinates)
const winArea = { x: 1190, y: 10, width: 50, height: 50 };

// Key press tracking
const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'w') keys.w = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 's') keys.s = true;
    if (e.key === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
});

// function render() {
//     // Draw the enemy at its current position
//     // ...
//   }

function update() {
    // Move the enemy
    enemy.x += enemy.speed * enemy.direction;
  
    // Check if the enemy has reached the edge of its patrol range
    if (Math.abs(enemy.x - 100) >= enemy.patrolRange) {
      enemy.direction *= -1; // Reverse the direction
    }
  
    // Update the enemy's visual representation on the screen
    // ...
  }

// Function to create and return a new barrier element
function createBarrier() {
    const barrier = document.createElement('div');
    barrier.classList.add('barrier');
    gameCanvas.appendChild(barrier);
    return barrier;
}

// Check for win condition
function checkWin() {
    return (
        spriteX < winArea.x + winArea.width &&
        spriteX + spriteWidth > winArea.x &&
        spriteY < winArea.y + winArea.height &&
        spriteY + spriteHeight > winArea.y
    );
}

// Collision detection for barriers
function checkCollision(x, y) {
    for (let barrier of barriers) {
        if (
            x < barrier.x + barrier.width &&
            x + spriteWidth > barrier.x &&
            y < barrier.y + barrier.height &&
            y + spriteHeight > barrier.y
        ) {
            return true;
        }
    }
    return false;
}

// Update sprite position with collision checks
function updateSpritePosition() {
    let newX = spriteX;
    let newY = spriteY;

    if (keys.w) newY -= spriteSpeed;
    if (keys.a) newX -= spriteSpeed;
    if (keys.s) newY += spriteSpeed;
    if (keys.d) newX += spriteSpeed;

    const canvasWidth = gameCanvas.clientWidth;
    const canvasHeight = gameCanvas.clientHeight;

    if (checkCollision(newX, spriteY) || newX < 0 || newX + spriteWidth > canvasWidth) {
        showCollisionImage();
        return;
    } else {
        spriteX = newX;
    }

    if (checkCollision(spriteX, newY) || newY < 0 || newY + spriteHeight > canvasHeight) {
        showCollisionImage();
        return;
    } else {
        spriteY = newY;
    }

    sprite.style.left = spriteX + 'px';
    sprite.style.top = spriteY + 'px';

    // Show the win panel if player reaches the win area
    if (checkWin()) {
        showWinPanel();
    }
}

// Show collision image and reset sprite position
function showCollisionImage() {
    collisionImage.style.display = 'block';
    clearTimeout(collisionTimeout);
    collisionTimeout = setTimeout(() => {
        collisionImage.style.display = 'none';
        resetSpritePosition();
    }, 2000);
}

// Show the win panel
function showWinPanel() {
    winPanel.style.display = 'flex';
}

// Reset sprite position
function resetSpritePosition() {
    spriteX = initialSpriteX;
    spriteY = initialSpriteY;
    sprite.style.left = spriteX + 'px';
    sprite.style.top = spriteY + 'px';
    winPanel.style.display = 'none';
}

// Update barrier and win area positions
function updatePositions() {
    for (let barrier of barriers) {
        barrier.element.style.left = barrier.x + 'px';
        barrier.element.style.top = barrier.y + 'px';
        barrier.element.style.width = barrier.width + 'px';
        barrier.element.style.height = barrier.height + 'px';
    }
    winAreaElement.style.left = winArea.x + 'px';
    winAreaElement.style.top = winArea.y + 'px';
    winAreaElement.style.width = winArea.width + 'px';
    winAreaElement.style.height = winArea.height + 'px';
}

// Main game loop
function gameLoop() {
    updateSpritePosition();
    requestAnimationFrame(gameLoop);
}

// Initialize
updatePositions();
gameLoop();

// Restart game on reset button click
resetButton.addEventListener('click', resetSpritePosition);
