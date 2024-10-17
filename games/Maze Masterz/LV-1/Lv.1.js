const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Sprite properties
const sprite = {
   x: 50,
   y: 50,
   width: 30,
   height: 30,
   dx: 2,
   dy: 0,
};


// Barriers (x, y, width, height)
const barriers = [
   { x: 100, y: 100, width: 200, height: 20 },
   { x: 300, y: 300, width: 20, height: 200 },
];


// Function to draw the sprite
function drawSprite() {
   ctx.fillStyle = 'blue';
   ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
}


// Function to draw barriers
function drawBarriers() {
   ctx.fillStyle = 'red';
   barriers.forEach(barrier => {
       ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
   });
}


// Collision detection
function checkCollision() {
   for (const barrier of barriers) {
       if (
           sprite.x < barrier.x + barrier.width &&
           sprite.x + sprite.width > barrier.x &&
           sprite.y < barrier.y + barrier.height &&
           sprite.y + sprite.height > barrier.y
       ) {
           // Collision detected
           return true;
       }
   }
   return false;
}


// Update the game state
function update() {
   // Move the sprite
   sprite.x += sprite.dx;


   // Check for collisions
   if (checkCollision()) {
       sprite.x -= sprite.dx; // Reset position if there's a collision
   }
}


// Main game loop
function gameLoop() {
   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
   drawBarriers(); // Draw barriers
   drawSprite(); // Draw sprite
   update(); // Update position
   requestAnimationFrame(gameLoop); // Repeat
}


// Start the game loop
gameLoop();