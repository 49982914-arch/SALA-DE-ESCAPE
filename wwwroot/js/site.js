// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minification static web assets.

// Write your JavaScript code.

// === SALA 2 - MIDAS GOLDEN BUTTON GAME ===
document.addEventListener('DOMContentLoaded', function() {
    const botonDorado = document.getElementById('botonDorado');
    const clicksSpan = document.getElementById('clicksRestantes');
    const sala2Form = document.getElementById('sala2Form');
    const gameZone = document.querySelector('.sala2-game-zone');

    // Only initialize if this is Sala 2
    if (!botonDorado || !gameZone) return;

    let clicksRestantes = 3;
    let juegoActivo = true;
    let botonVisible = false;
    let puedeClickear = false;

    // Lugar al que mover el botón
    function moverBotonaAleatorio() {
        if (!juegoActivo) return;

        const maxX = gameZone.clientWidth - 100;
        const maxY = gameZone.clientHeight - 100;

        const randomX = Math.random() * Math.max(maxX, 50);
        const randomY = Math.random() * Math.max(maxY, 50);

        botonDorado.style.left = randomX + 'px';
        botonDorado.style.top = randomY + 'px';
    }

    // Mostrar el botón
    function mostrarBoton() {
        botonVisible = true;
        puedeClickear = true;
        botonDorado.classList.remove('oculto');
    }

    // Ocultar el botón
    function ocultarBoton() {
        botonVisible = false;
        puedeClickear = false;
        botonDorado.classList.add('oculto');
    }

    // Click del botón
    botonDorado.addEventListener('click', function(e) {
        if (!puedeClickear || !juegoActivo) return;

        e.preventDefault();
        e.stopPropagation();

        clicksRestantes--;
        clicksSpan.textContent = clicksRestantes;

        if (clicksRestantes === 0) {
            // Juego completado
            juegoActivo = false;
            botonDorado.classList.add('completado');
            clearInterval(cicloInterval);

            // Enviar formulario después de 500ms
            setTimeout(() => {
                sala2Form.submit();
            }, 500);
        } else {
            // Mover a nueva posición para el siguiente ciclo
            moverBotonaAleatorio();
        }
    });

    // Ciclo: aparece 1s, desaparece 1s, repite
    let cicloInterval = setInterval(() => {
        if (!juegoActivo) {
            clearInterval(cicloInterval);
            return;
        }

        if (botonVisible) {
            // Si está visible, ocultarlo
            ocultarBoton();
        } else {
            // Si está oculto, mostrarlo en nueva posición
            moverBotonaAleatorio();
            mostrarBoton();
        }
    }, 1000); // Cambia cada 1 segundo

    // Iniciar el juego - primero mostrar el botón
    moverBotonaAleatorio();
    mostrarBoton();
});

// === SALA 1 - PUZZLE DE LETRAS ===
document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.getElementById('sala1TypingText');
    const lettersUniverse = document.getElementById('lettersUniverse');

    if (typingText) {
        const phrase = 'En el universo donde todo comenzó... las letras guardan un secreto. Suma los valores de las que brillan.';
        let index = 0;

        function typeLetter() {
            typingText.textContent = phrase.substring(0, index);
            index++;
            if (index <= phrase.length) {
                setTimeout(typeLetter, 42);
            }
        }

        typeLetter();
    }

    if (!lettersUniverse) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const activeLetters = ['F', 'O', 'R', 'T', 'N', 'I', 'T', 'E'];
    const distractors = [];

    for (let i = 0; i < 30; i++) {
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        while (activeLetters.includes(letter)) {
            letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        distractors.push(letter);
    }

    const usedPositions = [];

    activeLetters.forEach((letter) => {
        let x = 0;
        let y = 0;
        let attempts = 0;

        do {
            x = 8 + Math.random() * 84;
            y = 14 + Math.random() * 70;
            attempts++;
        } while (attempts < 80 && usedPositions.some(pos => Math.abs(pos.x - x) < 12 && Math.abs(pos.y - y) < 14));

        const tile = document.createElement('div');
        tile.className = 'letter-tile active';
        tile.style.left = x + '%';
        tile.style.top = y + '%';
        tile.style.zIndex = '3';

        const token = document.createElement('span');
        token.className = 'letter-token';
        token.textContent = letter;

        const number = document.createElement('span');
        number.className = 'letter-number';
        number.textContent = alphabet.indexOf(letter) + 1;

        tile.appendChild(token);
        tile.appendChild(number);
        lettersUniverse.appendChild(tile);
        usedPositions.push({ x, y });
    });

    for (let i = 0; i < distractors.length; i++) {
        let attempts = 0;
        let x = 0;
        let y = 0;
        let overlap = true;

        while (overlap && attempts < 80) {
            x = 8 + Math.random() * 84;
            y = 14 + Math.random() * 70;
            overlap = usedPositions.some(pos => Math.abs(pos.x - x) < 10 && Math.abs(pos.y - y) < 12);
            attempts++;
        }

        if (!overlap) {
            const tile = document.createElement('div');
            tile.className = 'letter-tile distractor';
            tile.style.left = x + '%';
            tile.style.top = y + '%';

            const token = document.createElement('span');
            token.className = 'letter-token';
            token.textContent = distractors[i];

            const number = document.createElement('span');
            number.className = 'letter-number';
            number.textContent = alphabet.indexOf(distractors[i]) + 1;

            tile.appendChild(token);
            tile.appendChild(number);
            lettersUniverse.appendChild(tile);
            usedPositions.push({ x, y });
        }
    }
});

// === SALA 3 - LABERINTO COMPLEJO CON ANTORCHA ===
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mazeCanvas');
    const timerEl = document.getElementById('mazeTimer');
    const messageEl = document.getElementById('mazeMessage');
    const mazeForm = document.getElementById('sala3MazeForm');

    if (!canvas || !timerEl || !messageEl || !mazeForm) return;

    const ctx = canvas.getContext('2d');
    const gridSize = 31;
    const cellSize = canvas.width / gridSize;
    const wallColor = '#e94560';
    const pathColor = '#1a1a2e';
    const start = { x: 1, y: 1 };
    let player = { x: 1, y: 1 };
    let goal = { x: 1, y: 1 };
    let timeLeft = 300;
    let completed = false;
    const maze = Array.from({ length: gridSize }, () => Array(gridSize).fill(1));

    function generateMaze() {
        const stack = [[1, 1]];
        maze[1][1] = 0;

        while (stack.length > 0) {
            const [x, y] = stack[stack.length - 1];
            const neighbors = [];

            if (x - 2 > 0 && maze[y][x - 2] === 1) neighbors.push([x - 2, y]);
            if (x + 2 < gridSize - 1 && maze[y][x + 2] === 1) neighbors.push([x + 2, y]);
            if (y - 2 > 0 && maze[y - 2][x] === 1) neighbors.push([x, y - 2]);
            if (y + 2 < gridSize - 1 && maze[y + 2][x] === 1) neighbors.push([x, y + 2]);

            if (neighbors.length === 0) {
                stack.pop();
                continue;
            }

            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[(y + ny) / 2][(x + nx) / 2] = 0;
            maze[ny][nx] = 0;
            stack.push([nx, ny]);
        }
    }

    function getFarthestCell() {
        const queue = [[1, 1, 0]];
        const visited = new Set(['1,1']);
        let farthest = { x: 1, y: 1, dist: 0 };

        while (queue.length > 0) {
            const [x, y, dist] = queue.shift();
            if (dist > farthest.dist) {
                farthest = { x, y, dist };
            }

            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx <= 0 || ny <= 0 || nx >= gridSize - 1 || ny >= gridSize - 1) continue;
                if (maze[ny][nx] !== 0 || visited.has(`${nx},${ny}`)) continue;
                visited.add(`${nx},${ny}`);
                queue.push([nx, ny, dist + 1]);
            }
        }

        return farthest;
    }

    function resetPlayer() {
        player = { ...start };
        messageEl.textContent = 'Has chocado con una pared. Vuelves al inicio.';
    }

    function updateTimer() {
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        timerEl.textContent = `${minutes}:${seconds}`;
    }

    function completeMaze() {
        if (completed) return;
        completed = true;
        clearInterval(timerInterval);
        messageEl.textContent = '¡Has encontrado al Bananoide!';

        setTimeout(() => {
            mazeForm.submit();
        }, 500);
    }

    function drawSprite(imagePath, x, y, size = 30) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, x, y, size, size);
        };
        img.src = imagePath;
    }

    function drawMaze() {
        const lightX = player.x * cellSize + cellSize / 2;
        const lightY = player.y * cellSize + cellSize / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.beginPath();
        ctx.arc(lightX, lightY, 120, 0, Math.PI * 2);
        ctx.clip();

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const px = x * cellSize;
                const py = y * cellSize;
                ctx.fillStyle = maze[y][x] === 1 ? wallColor : pathColor;
                ctx.fillRect(px, py, cellSize, cellSize);
            }
        }

        ctx.restore();

        const glow = ctx.createRadialGradient(lightX, lightY, 10, lightX, lightY, 120);
        glow.addColorStop(0, 'rgba(255, 229, 120, 1)');
        glow.addColorStop(0.12, 'rgba(255, 175, 60, 0.9)');
        glow.addColorStop(0.28, 'rgba(255, 120, 35, 0.5)');
        glow.addColorStop(0.6, 'rgba(255, 90, 0, 0.2)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawSprite('/images/skin%20jonesey.png', player.x * cellSize + (cellSize - 30) / 2, player.y * cellSize + (cellSize - 30) / 2, 30);
        drawSprite('/images/skin_banana_2026-removebg-preview.png', goal.x * cellSize + (cellSize - 30) / 2, goal.y * cellSize + (cellSize - 30) / 2, 30);
    }

    function movePlayer(dx, dy) {
        if (completed) return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx <= 0 || ny <= 0 || nx >= gridSize - 1 || ny >= gridSize - 1) {
            resetPlayer();
            drawMaze();
            return;
        }

        if (maze[ny][nx] === 1) {
            resetPlayer();
            drawMaze();
            return;
        }

        player.x = nx;
        player.y = ny;

        if (player.x === goal.x && player.y === goal.y) {
            completeMaze();
        }

        drawMaze();
    }

    function handleKeydown(event) {
        if (!['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();

        const map = {
            ArrowLeft: [-1, 0],
            ArrowUp: [0, -1],
            ArrowRight: [1, 0],
            ArrowDown: [0, 1]
        };

        const [dx, dy] = map[event.key];
        movePlayer(dx, dy);
    }

    generateMaze();
    goal = getFarthestCell();
    updateTimer();
    drawMaze();
    document.addEventListener('keydown', handleKeydown);

    let timerInterval = setInterval(() => {
        if (completed) {
            clearInterval(timerInterval);
            return;
        }

        if (timeLeft <= 0) {
            timeLeft = 300;
            messageEl.textContent = 'Se agotó el tiempo. Vuélves al inicio.';
            resetPlayer();
            updateTimer();
            drawMaze();
            return;
        }

        timeLeft -= 1;
        updateTimer();
    }, 1000);
});

