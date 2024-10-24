const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let fruits = [];  // Store fruits in an array
const maxFruits = 10;  // Max number of fruits to ever generate

let missedFruits = 0; // Tracks missed fruits
let score = 0; // Player's score
let gameRunning = true; // Flag for checking game state
const maxMissedFruits = 10; // Maximum number of missed fruits before game over

const fruitSpeed = 2; // Constant speed for all fruits
const bucketSpeed = 15; // Speed at which the bucket moves
const goblinSpeed = 20; // Speed at which the goblin moves

let moveLeft = false;
let moveRight = false;
let invertBucket = false; // Track inversion state for the bucket

// Bucket and goblin dimensions
const bucket = {
    width: 200,
    height: 150,
};

const goblin = {
    width: 100,
    height: 100,
    direction: 1, // 1 for right, -1 for left
};

// Load images
const fruitImages = [
    'Pictures/apple.png',
    'Pictures/strawberry.png',
    'Pictures/watermelon.png',
    'Pictures/grape.png',
];

const bucketImage = new Image();
bucketImage.src = 'Pictures/bucket.png';

const goblinImage = new Image();
goblinImage.src = 'Pictures/goblin.png';

const gameOverImage = new Image();
gameOverImage.src = 'Pictures/GameOver.png';

const youWinImage = new Image();
youWinImage.src = 'Pictures/YouWin.png';

const loadedImages = [];
let imagesLoaded = 0;

// Preload fruit images
fruitImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === fruitImages.length) {
            generateFruits();  // Start generating fruits
        }
    };
    loadedImages.push(img);
});

// Resize canvas and update positions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update positions of bucket and goblin
    bucket.x = canvas.width / 2 - bucket.width / 2;
    bucket.y = canvas.height - bucket.height - 20; // 20px from the bottom
    goblin.x = 0;
    goblin.y = canvas.height - goblin.height - 20; // 20px from the bottom
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set the canvas size

// Generate random fruit positions and types
function generateFruits() {
    fruits = [];  // Clear current fruits
    for (let i = 0; i < maxFruits; i++) {
        const x = Math.random() * (canvas.width - 50); // Random horizontal position
        const y = -Math.random() * 1500; // Start off-screen
        const fruitType = Math.floor(Math.random() * loadedImages.length);
        fruits.push({ x, y, image: loadedImages[fruitType], speed: fruitSpeed });
    }
}

// Update the positions of the fruits
function updateFruits() {
    fruits.forEach((fruit, index) => {
        fruit.y += fruit.speed; // Move the fruit down
        // Check for collision with the bucket
        if (fruit.y + 45 > bucket.y && fruit.x > bucket.x && fruit.x < bucket.x + bucket.width) {
            fruits.splice(index, 1); // Remove fruit from array
            score += 10; // Increase score by 10
        } else if (fruit.y > canvas.height) {
            fruits.splice(index, 1); // Remove fruit from array
            missedFruits++; // Increment missed fruits counter
        }
    });

    // End game when all fruits are either collected or missed
    if (missedFruits >= maxMissedFruits) {
        endGame(false);  // Trigger game over
    } else if (fruits.length === 0) {
        endGame(true);  // Trigger win
    }
}

// Update the goblin's position
function updateGoblin() {
    goblin.x += goblinSpeed * goblin.direction; // Move goblin horizontally

    // Change direction if the goblin hits the canvas boundaries
    if (goblin.x <= 0 || goblin.x + goblin.width >= canvas.width) {
        goblin.direction *= -1; // Reverse direction
    }

    // Check for collision between goblin and fruits
    fruits.forEach((fruit, index) => {
        if (
            fruit.x < goblin.x + goblin.width &&
            fruit.x + 50 > goblin.x &&
            fruit.y < goblin.y + goblin.height &&
            fruit.y + 50 > goblin.y
        ) {
            fruits.splice(index, 1); // Remove fruit from array
            score += 5; // Increase score by 5 for goblin collection
        }
    });
}

// Draw the fruits, bucket, and goblin on the canvas
function drawFruits() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruits.forEach(fruit => {
        const size = 90; // Increased size
        ctx.drawImage(fruit.image, fruit.x - size / 2, fruit.y - size / 2, size, size);
    });
    drawGoblin();  // Draw the goblin
    drawBucket();  // Draw the bucket
    drawScore();   // Draw score
}

// Draw the goblin
function drawGoblin() {
    ctx.drawImage(goblinImage, goblin.x, goblin.y, goblin.width, goblin.height);
}

// Draw the bucket
function drawBucket() {
    ctx.save(); // Save the current state
    if (invertBucket) {
        ctx.scale(-1, 1); // Invert horizontally
        ctx.drawImage(bucketImage, -bucket.x - bucket.width, bucket.y, bucket.width, bucket.height);
    } else {
        ctx.drawImage(bucketImage, bucket.x, bucket.y, bucket.width, bucket.height);
    }
    ctx.restore(); // Restore the state
}

// Display score
function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 20, 40); // Display score at top left
}

// Update bucket position based on arrow key presses
function updateBucketPosition() {
    if (moveLeft && bucket.x > 0) {
        bucket.x -= bucketSpeed;
    }
    if (moveRight && bucket.x + bucket.width < canvas.width) {
        bucket.x += bucketSpeed;
    }
}

// Main game loop
function gameLoop() {
    if (gameRunning) {
        updateFruits();    // Update fruit positions
        updateGoblin();    // Update goblin position
        updateBucketPosition(); // Update bucket position based on input
        drawFruits();      // Draw fruits, goblin, and bucket
        requestAnimationFrame(gameLoop);  // Keep the loop going
    } else {
        drawEndScreen(); // Draw end screen when game is not running
    }
}

// End game logic
function endGame(isWin) {
    gameRunning = false;  // Stop the game loop
    if (isWin) {
        console.log("You Win!");
    } else {
        console.log("Game Over");
    }
}

// Draw game over or win screen
function drawEndScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    const endImage = score >= maxFruits * 10 ? youWinImage : gameOverImage; // Decide which image to draw
    ctx.drawImage(endImage, 0, 0, canvas.width, canvas.height);  // Draw the end image

    // Draw retry button
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);  // Draw button

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Retry', canvas.width / 2 - 40, canvas.height / 2 + 85);  // Draw button text

    // Add a listener for retry click
    canvas.addEventListener('click', handleRetryClick);
}

// Retry game function
function handleRetryClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the click was within the retry button area
    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 && 
        mouseY >= canvas.height / 2 + 50 && mouseY <= canvas.height / 2 + 100) {
        resetGame();  // Call reset game if the retry button was clicked
    }
}

// Reset game function
function resetGame() {
    missedFruits = 0;
    score = 0;
    fruits = [];  // Clear current fruits
    gameRunning = true; // Restart game loop
    generateFruits();   // Generate new fruits
    gameLoop();         // Start the game loop again

    // Remove the click event listener to prevent multiple triggers
    canvas.removeEventListener('click', handleRetryClick);
}

// Listen for arrow key presses to move the bucket
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft = true;
        invertBucket = true; // Invert bucket when left arrow is pressed
    } else if (e.key === 'ArrowRight') {
        moveRight = true;
        invertBucket = false; // Reset inversion if right arrow is pressed
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (e.key === 'ArrowRight') {
        moveRight = false;
    }
});

// Start the game initially after loading images
bucketImage.onload = () => {
    goblinImage.onload = () => {
        resizeCanvas(); // Ensure canvas size is set before starting
        generateFruits();
        gameLoop();
    };
};
