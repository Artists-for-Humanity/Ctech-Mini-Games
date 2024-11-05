const sprite = document.getElementById('sprite');
const gameCanvas = document.getElementById('gameCanvas');
let spriteX = 30; // Start position of sprite
let spriteY = 750;
const spriteWidth = 50;
const spriteHeight = 50;
const spriteSpeed = 5;

const barriers = [
    { x: 0, y: 75, width: 700, height: 50, element: document.getElementById('barrier1') },
    { x: 400, y: 125, width: 300, height: 75, element: document.getElementById('barrier2') }
];

// Key press tracking
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Event listeners for keydown and keyup
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

// Collision detection for barriers and boundaries
function checkCollision(x, y) {
    for (let barrier of barriers) {
        if (x < barrier.x + barrier.width &&
            x + spriteWidth > barrier.x &&
            y < barrier.y + barrier.height &&
            y + spriteHeight > barrier.y) {
            return true; // Collision with barrier
        }
    }
    return false;
}

// Update sprite position with boundary and barrier collision checks
function updateSpritePosition() {
    let newX = spriteX;
    let newY = spriteY;

    if (keys.w) newY -= spriteSpeed;
    if (keys.a) newX -= spriteSpeed;
    if (keys.s) newY += spriteSpeed;
    if (keys.d) newX += spriteSpeed;

    // Get `gameCanvas` dimensions
    const canvasWidth = gameCanvas.clientWidth;
    const canvasHeight = gameCanvas.clientHeight;

    // Check for collisions with barriers and boundaries
    if (!checkCollision(newX, spriteY) && newX >= 0 && newX + spriteWidth <= canvasWidth) {
        spriteX = newX;
    }
    if (!checkCollision(spriteX, newY) && newY >= 0 && newY + spriteHeight <= canvasHeight) {
        spriteY = newY;
    }

    // Update sprite's visual position
    sprite.style.left = spriteX + 'px';
    sprite.style.top = spriteY + 'px';
}

// Update barrier visual positions
function updateBarrierPositions() {
    for (let barrier of barriers) {
        barrier.element.style.left = barrier.x + 'px';
        barrier.element.style.top = barrier.y + 'px';
        barrier.element.style.width = barrier.width + 'px';
        barrier.element.style.height = barrier.height + 'px';
    }
}

// Main game loop
function gameLoop() {
    updateSpritePosition();
    requestAnimationFrame(gameLoop);
}

// Initialize barrier positions and start the game loop
updateBarrierPositions();
gameLoop();
