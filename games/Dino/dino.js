// Board settings
const boardWidth = 950;
const boardHeight = 350;
let board, context;

// Assets
let summerImg,
  cactusImgs = [],
  dinoImg,
  powerupImg;
let cactusArray = [],
  powerupArray = [];

// Dino settings
const dino = {
  x: 45,
  y: boardHeight - 94,
  width: 88,
  height: 94,
  gravity: 0.3,
  velocityY: 0,
  isJumping: false,
};

// Cactus settings
const cactusSettings = [
  { width: 24, img: null },
  // { width: 69, img: null },
  // { width: 102, img: null },
];

// Powerup settings
const powerupSettings = {
  width: 30,
  height: 40,
  collected: false,
  x: 50,
  y: boardHeight - 40,
};

// Scrolling background
let summerX = 0,
  summerY = 0,
  summerWidth = 950,
  summerHeight = 350;
const summerScrollSpeed = 6;

// Initialize game
function init() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  loadAssets();
  update();
}

// Load images for all assets
function loadAssets() {
  summerImg = new Image();
  summerImg.src = "./dino assets/Summer2.png";
  summerImg.onload = () =>
    context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);

  cactusSettings.forEach((setting, index) => {
    const img = new Image();
    img.src = `./dino assets/c${index + 1}.png`;
    setting.img = img;
  });

  dinoImg = new Image();
  dinoImg.src = "./dino assets/dino.png";
  dinoImg.onload = () =>
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  powerupImg = new Image();
  powerupImg.src = "./dino assets/powerup1.png";
}

// Game loop
function update() {
  requestAnimationFrame(update);

  // Scroll background
  summerX -= summerScrollSpeed;
  if (summerX <= -summerWidth) {
    summerX = 0;
  }

  // Update dino state
  if (dino.isJumping) {
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;
    if (dino.y >= boardHeight - dino.height) {
      dino.y = boardHeight - dino.height;
      dino.isJumping = false;
      dino.velocityY = 0;
    }
  }

  // Generate new cactus and update cactus positions
  if (Math.random() < 0.01) {
    generateCactus();
  }
  cactusArray.forEach((cactus) => (cactus.x -= 3));
  cactusArray = cactusArray.filter((cactus) => cactus.x + cactus.width > 0);

  // Check collisions
  checkCollisions();

  // Clear and redraw everything
  context.clearRect(0, 0, boardWidth, boardHeight);
  context.drawImage(summerImg, summerX, summerY, summerWidth, summerHeight);
  context.drawImage(
    summerImg,
    summerX + summerWidth,
    summerY,
    summerWidth,
    summerHeight
  );

  cactusArray.forEach((cactus) =>
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    )
  );
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

// Generate a random cactus
function generateCactus() {
  const cactusType = 0;
  const { width, img } = cactusSettings[cactusType];
  cactusArray.push({
    x: boardWidth,
    y: boardHeight - 74,
    width,
    height: 60,
    img,
  });
}

// Check for collisions with cactus
function checkCollisions() {
  cactusArray.forEach((cactus) => {
    if (
      dino.x + dino.width > cactus.x &&
      dino.x < cactus.x + cactus.width &&
      dino.y + dino.height > cactus.y
    ) {
      alert("Game Over! :(");
      location.reload();
    }
  });
}

// Jump function for dino
function jump() {
  if (!dino.isJumping) {
    dino.velocityY = -10;
    dino.isJumping = true;
  }
}

// Handle key events
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Start the game when the window loads
window.onload = init;
