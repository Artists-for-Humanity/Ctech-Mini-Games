const gridWidth = 30;
const gridHeight = 16;
let playerX = 0;
let playerY = 0;

// Create the grid
const grid = document.getElementById('grid');
for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        grid.appendChild(cell);
    }
}

// Function to update player position
function updatePlayer() {
    // Clear previous player position
    const previousCell = document.querySelector('.cell.player');
    if (previousCell) {
        previousCell.classList.remove('player');
    }

    // Set new player position
    const currentCell = document.querySelector(`.cell[data-x="${playerX}"][data-y="${playerY}"]`);
    currentCell.classList.add('player');
}

// Handle keydown events
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (playerY > 0) playerY--;
            break;
        case 'ArrowDown':
            if (playerY < gridHeight - 1) playerY++;
            break;
        case 'ArrowLeft':
            if (playerX > 0) playerX--;
            break;
        case 'ArrowRight':
            if (playerX < gridWidth - 1) playerX++;
            break;
    }
    updatePlayer();
});

// Initialize player position
updatePlayer();
