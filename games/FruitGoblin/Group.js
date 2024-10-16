const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const fruits = [];
        const numberOfFruits = 10;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const fruitImages = [
            'Pictures/apple.png',
            'Pictures/strawberry.png',
            'Pictures/watermelon.png',
            'Pictures/grape.png'
        ];

        const loadedImages = [];
        let imagesLoaded = 0;

        const fruitSpeed = 1.5; // Constant speed for all fruits

        // Preload images
        fruitImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imagesLoaded++;
                console.log(`${src} loaded successfully.`);
                if (imagesLoaded === fruitImages.length) {
                    generateFruits();
                    gameLoop();
                }
            };
            img.onerror = () => {
                console.error(`Error loading image: ${src}`);
            };
            loadedImages.push(img);
        });

        // Generate random fruit positions and types
        function generateFruits() {
            const spacingX = canvasWidth / 5; // Wider horizontal spacing
            const spacingY = 5; // Wider vertical spacing

            for (let i = 0; i < numberOfFruits; i++) {
                const x = (i % 5) * spacingX + Math.random() * (spacingX - 50); // Randomize within spacing
                const y = -Math.random() * 500; // Start off-screen
                const fruitType = Math.floor(Math.random() * loadedImages.length);
                fruits.push({ x: x, y: y, image: loadedImages[fruitType], speed: fruitSpeed });
            }
        }

        // Update the positions of the fruits
        function updateFruits() {
            fruits.forEach((fruit, index) => {
                fruit.y += fruit.speed; // Move the fruit down
                // Check if the fruit goes off-screen
                if (fruit.y > canvasHeight) {
                    // Mark fruit as "off-screen"
                    fruits.splice(index, 1); // Remove fruit from array
                }
            });
        }

        // Draw the fruits on the canvas
        function drawFruits() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fruits.forEach(fruit => {
                const size = 90; // Increased size
                ctx.drawImage(fruit.image, fruit.x - size / 2, fruit.y - size / 2, size, size);
            });
        }

        // Main game loop
        function gameLoop() {
            updateFruits(); // Update positions
            drawFruits();   // Draw fruits
            requestAnimationFrame(gameLoop);
        }