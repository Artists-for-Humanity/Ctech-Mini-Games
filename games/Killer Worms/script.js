document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const gameCanvas = document.getElementById('game-canvas');
    const startButton = document.getElementById('start-button');
    
    startButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
    });

    function startGame() {
        console.log('Game started!');
    };
});


document.addEventListener('keydown', (event) => {
    const mainMenu = document.getElementById('main-menu');
    if (event.key === 'Escape') {
        mainMenu.style.display = 'flex';
    };
});