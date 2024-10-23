// Lv1.js
const sprite = document.getElementById('sprite');
const canvas = document.getElementById('gameCanvas');
let spriteX = 500;
let spriteY = 150;
const spriteWidth = 50; // Width of the sprite
const spriteHeight = 50; // Height of the sprite
const spriteSpeed = 5;

// Define barriers
const barriers = [
    { x: 300, y: 200, width: 100, height: 50 }, // Barrier 1
    { x: 500, y: 400, width: 150, height: 75 }  // Barrier 2
];

// Key press tracking
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Event listeners for keydown and keyup
window.addEventListener('keydown', function (e) {
    if (e.key === 'w') keys.w = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 's') keys.s = true;
    if (e.key === 'd') keys.d = true;
});

window.addEventListener('keyup', function (e) {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
});

// Collision detection function
function checkCollision(x, y) {
    // Check collision with barriers
    for (let barrier of barriers) {
        if (x < barrier.x + barrier.width &&
            x + spriteWidth > barrier.x &&
            y < barrier.y + barrier.height &&
            y + spriteHeight > barrier.y) {
            return true; // Collision detected
        }
    }
    return false;
}

// Function to update sprite position based on keypresses and collision detection
function updateSpritePosition() {
    let newX = spriteX;
    let newY = spriteY;

    if (keys.w) newY -= spriteSpeed; // Move up
    if (keys.a) newX -= spriteSpeed; // Move left
    if (keys.s) newY += spriteSpeed; // Move down
    if (keys.d) newX += spriteSpeed; // Move right

    // Get the canvas dimensions
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left;
    const canvasTop = canvasRect.top;
    const canvasRight = canvasRect.right;
    const canvasBottom = canvasRect.bottom;

    // Check for collisions with barriers
    if (!checkCollision(newX, spriteY)) {
        spriteX = newX; // Update position if no collision with barriers
    }

    if (!checkCollision(spriteX, newY)) {
        spriteY = newY; // Update position if no collision with barriers
    }

    // Check for collision with canvas boundaries
    if (spriteX < canvasLeft) spriteX = canvasLeft; // Left boundary
    if (spriteX + spriteWidth > canvasRight) spriteX = canvasRight - spriteWidth; // Right boundary
    if (spriteY < canvasTop) spriteY = canvasTop; // Top boundary
    if (spriteY + spriteHeight > canvasBottom) spriteY = canvasBottom - spriteHeight; // Bottom boundary

    // Apply the updated position to the sprite
    sprite.style.left = spriteX + 'px';
    sprite.style.top = spriteY + 'px';
}

// Main game loop
function gameLoop() {
    updateSpritePosition();
    requestAnimationFrame(gameLoop); // Loop the game
}

// Start the game loop
gameLoop();
