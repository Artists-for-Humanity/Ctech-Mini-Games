// Movement code
console.log('hello');


// Get the sprite element
const sprite = document.getElementById('sprite');

// Set initial position for the sprite (starting position)
let spriteX = 200; // Matches the left position from your CSS
let spriteY = 100; // Matches the top position from your CSS
const spriteSpeed = 5; // Speed at which the sprite moves

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

// Function to update sprite position based on keypresses
function updateSpritePosition() {
    if (keys.w) spriteY -= spriteSpeed; // Move up
    if (keys.a) spriteX -= spriteSpeed; // Move left
    if (keys.s) spriteY += spriteSpeed; // Move down
    if (keys.d) spriteX += spriteSpeed; // Move right

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