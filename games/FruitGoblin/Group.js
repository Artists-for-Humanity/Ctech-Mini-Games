const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let fruits = [];  // Store fruits in an array
const maxFruits = 10;  // Max number of fruits to ever generate
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const fruitImages = [
    'Pictures/apple.png',
    'Pictures/strawberry.png',
    'Pictures/watermelon.png',
    'Pictures/grape.png'
];

const bucketImage = new Image();
bucketImage.src = 'Pictures/bucket.png';  // Path to your bucket image

const goblinImage = new Image();
goblinImage.src = 'Pictures/goblin.png'; // Path to your goblin image (PNG)

const gameOverImage = new Image();
gameOverImage.src = 'Pictures/GameOver.png'; // Path to your game over image

const youWinImage = new Image();
youWinImage.src = 'Pictures/YouWin.png'; // Path to your you win image

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

// Bucket position and dimensions
const bucket = {
    x: canvasWidth / 2 - 50,
    y: canvasHeight - 150,  // Position it higher to account for larger size
    width: 200,  // Increased bucket size
    height: 150  // Increased bucket height
};

// Goblin position and dimensions
const goblin = {
    x: 0,
    y: canvasHeight - 100, // Position at the bottom
    width: 100,
    height: 100,
    direction: 1 // 1 for right, -1 for left
};

// Preload fruit and goblin images
const loadedImages = [];
let imagesLoaded = 0;

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

// Generate random fruit positions and types (only 10 fruits total)
function generateFruits() {
    fruits = [];  // Clear current fruits
    for (let i = 0; i < maxFruits; i++) {
        const x = Math.random() * (canvasWidth - 50); // Random horizontal position
        const y = -Math.random() * 1500; // Start off-screen
        const fruitType = Math.floor(Math.random() * loadedImages.length);
        fruits.push({ x: x, y: y, image: loadedImages[fruitType], speed: fruitSpeed });
    }
}

// Update the positions of the fruits and goblin
function updateFruits() {
    fruits.forEach((fruit, index) => {
        fruit.y += fruit.speed; // Move the fruit down
        // Check for collision with the bucket
        if (fruit.y + 45 > bucket.y && fruit.x > bucket.x && fruit.x < bucket.x + bucket.width) {
            // Fruit collected
            fruits.splice(index, 1); // Remove fruit from array
            score += 10; // Increase score by 10
        } else if (fruit.y > canvasHeight) {
            // Fruit missed
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
    if (goblin.x <= 0 || goblin.x + goblin.width >= canvasWidth) {
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
            // Fruit collected by goblin
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

// Function to draw the goblin
function drawGoblin() {
    ctx.drawImage(goblinImage, goblin.x, goblin.y, goblin.width, goblin.height);
}

// Function to draw the bucket with inversion
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

// Display score in the top left corner
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
    if (moveRight && bucket.x + bucket.width < canvasWidth) {
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
    ctx.drawImage(endImage, 0, 0, canvasWidth, canvasHeight);  // Draw the end image

    // Draw retry button
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvasWidth / 2 - 100, canvasHeight / 2 + 50, 200, 50);  // Draw button

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Retry', canvasWidth / 2 - 40, canvasHeight / 2 + 85);  // Draw button text

    // Add a listener for retry click
    canvas.addEventListener('click', handleRetryClick);
}

// Retry game function
function handleRetryClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the click was within the retry button area
    if (mouseX >= canvasWidth / 2 - 100 && mouseX <= canvasWidth / 2 + 100 && 
        mouseY >= canvasHeight / 2 + 50 && mouseY <= canvasHeight / 2 + 100) {
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
        generateFruits();
        gameLoop();
    };
};
