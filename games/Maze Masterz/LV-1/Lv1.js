const sprite = document.getElementById('sprite');
const gameCanvas = document.getElementById('gameCanvas');
let spriteX = 30; // Start position of sprite
let spriteY = 750;
const spriteWidth = 50;
const spriteHeight = 50;
const spriteSpeed = 5;

// Define maze barriers
const barriers = [
    { x: 0, y: 75, width: 700, height: 50, element: document.getElementById('barrier1') },
    { x: 400, y: 125, width: 300, height: 75, element: document.getElementById('barrier2') },
    
    // New maze barriers
    { x: 0, y: 300, width: 200, height: 50, element: createBarrier() },
    { x: 250, y: 200, width: 50, height: 250, element: createBarrier() },
    { x: 100, y: 500, width: 500, height: 40, element: createBarrier() },
    { x: 650, y: 300, width: 50, height: 300, element: createBarrier() },
    { x: 800, y: 100, width: 50, height: 500, element: createBarrier() },
    { x: 850, y: 550, width: 300, height: 50, element: createBarrier() },
    { x: 1150, y: 400, width: 50, height: 150, element: createBarrier() },
    { x: 140, y: 800, width: 1100, height: 50, element: createBarrier() },
    { x: 200, y: 610, width: 50, height: 190, element: createBarrier() }
];

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

    const canvasWidth = gameCanvas.clientWidth;
    const canvasHeight = gameCanvas.clientHeight;

    if (!checkCollision(newX, spriteY) && newX >= 0 && newX + spriteWidth <= canvasWidth) {
        spriteX = newX;
    }
    if (!checkCollision(spriteX, newY) && newY >= 0 && newY + spriteHeight <= canvasHeight) {
        spriteY = newY;
    }
    

    sprite.style.left = spriteX + 'px';
    sprite.style.top = spriteY + 'px';
}

// Function to create and return a new barrier element
function createBarrier() {
    const barrier = document.createElement('div');
    barrier.classList.add('barrier');
    gameCanvas.appendChild(barrier);
    return barrier;
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
