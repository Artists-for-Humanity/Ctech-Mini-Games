const sprite = document.getElementById('sprite');
const gameCanvas = document.getElementById('gameCanvas');
const collisionImage = document.getElementById('collisionImage');
let collisionTimeout;

let spriteX = 30; // Initial x position of the sprite
let spriteY = 750; // Initial y position of the sprite
const spriteWidth = 50;
const spriteHeight = 50;
const spriteSpeed = 5;

const initialSpriteX = 30;
const initialSpriteY = 750;

// Define maze barriers
const barriers = [
    { x: 0, y: 75, width: 700, height: 50, element: document.getElementById('barrier1') },
    { x: 400, y: 125, width: 300, height: 75, element: document.getElementById('barrier2') },
    
    // New maze barriers added dynamically
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
    { x: 1230, y: 0, width: 10, height:850, element: createBarrier() },
    { x: 100, y: 200, width: 150, height:50, element: createBarrier() },
    { x: 370, y: 380, width: 300, height:50, element: createBarrier() },
    { x: 500, y: 500, width: 100, height:150, element: createBarrier() },
    { x: 200, y: 610, width: 50, height: 220, element: createBarrier() }
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

// Collision detection for barriers
function checkCollision(x, y) {
    for (let barrier of barriers) {
        if (x < barrier.x + barrier.width &&
            x + spriteWidth > barrier.x &&
            y < barrier.y + barrier.height &&
            y + spriteHeight > barrier.y) {
            showCollisionImage();
            return true;
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

    // Check for collisions with barriers and canvas boundaries
    if (!checkCollision(newX, spriteY) && newX >= 0 && newX + spriteWidth <= canvasWidth) {
        spriteX = newX;
    } else if (newX < 0 || newX + spriteWidth > canvasWidth) {
        showCollisionImage(); // Trigger image if hitting left/right boundary
        return;
    }

    if (!checkCollision(spriteX, newY) && newY >= 0 && newY + spriteHeight <= canvasHeight) {
        spriteY = newY;
    } else if (newY < 0 || newY + spriteHeight > canvasHeight) {
        showCollisionImage(); // Trigger image if hitting top/bottom boundary
        return;
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

// Show the collision image and reset the sprite after 2 seconds
function showCollisionImage() {
    collisionImage.style.display = 'block';
    collisionImage.style.width = '100vw';
    collisionImage.style.height = '100vh';
    collisionImage.style.position = 'fixed';
    collisionImage.style.top = 0;
    collisionImage.style.left = 0;

    clearTimeout(collisionTimeout);
    collisionTimeout = setTimeout(() => {
        collisionImage.style.display = 'none';
        resetSpritePosition();
    }, 2000);
}

// Reset the sprite to the starting position
function resetSpritePosition() {
    spriteX = initialSpriteX;
    spriteY = initialSpriteY;
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
