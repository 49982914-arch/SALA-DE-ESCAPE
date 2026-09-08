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

// === SALA 1 - SECRET STAR CODE ===
document.addEventListener('DOMContentLoaded', function() {
    const starsGrid = document.getElementById('starsGrid');
    const codigoInput = document.getElementById('codigoInput');

    if (!starsGrid) return; // Only run on Sala 1

    const brillantStars = [1, 2, 4, 8]; // Stars that should shine
    const totalStars = 12;
    let selectedNumbers = [];

    // Generate stars
    for (let i = 1; i <= totalStars; i++) {
        const star = document.createElement('div');
        star.className = 'sala1-star';
        if (brillantStars.includes(i)) {
            star.classList.add('brillante');
        }
        star.textContent = i;
        star.dataset.number = i;

        star.addEventListener('click', function() {
            const num = parseInt(this.dataset.number);
            if (brillantStars.includes(num)) {
                if (!selectedNumbers.includes(num)) {
                    selectedNumbers.push(num);
                    selectedNumbers.sort((a, b) => a - b);
                    codigoInput.value = selectedNumbers.join('');
                }
            }
        });

        starsGrid.appendChild(star);
    }
});

// === SALA 3 - DOCUMENTAL ANIMADO POR SLIDES ===
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.sala3-slide');
    const dots = document.querySelectorAll('.sala3-slide-dot');
    const quizSection = document.getElementById('quizSection');
    const sala3Form = document.getElementById('sala3Form');
    const quizError = document.getElementById('quizError');

    if (!slides.length) return; // Only run on Sala 3

    let currentSlide = 0;
    const totalSlides = slides.length;

    function mostrarSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.classList.toggle('done', i < index);
        });
    }

    function avanzarSlide() {
        currentSlide++;
        if (currentSlide < totalSlides) {
            mostrarSlide(currentSlide);
            setTimeout(avanzarSlide, 3000);
        } else {
            dots.forEach(dot => dot.classList.add('done'));
            quizSection.classList.add('visible');
        }
    }

    setTimeout(avanzarSlide, 3000); // Cada slide dura 3 segundos

    // Quiz option handling
    document.querySelectorAll('.sala3-option').forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('correct')) return;

            const answer = this.dataset.answer;

            if (answer === 'b') {
                // Respuesta correcta
                document.querySelectorAll('.sala3-option').forEach(o => {
                    o.style.pointerEvents = 'none';
                });
                this.classList.add('correct');
                quizError.style.display = 'none';

                // Enviar el formulario automáticamente
                setTimeout(() => {
                    sala3Form.submit();
                }, 600);
            } else {
                // Respuesta incorrecta - mostrar error
                this.classList.add('wrong');
                quizError.style.display = 'block';
                setTimeout(() => {
                    this.classList.remove('wrong');
                }, 800);
            }
        });
    });
});

// === SALA 1 - CÓDIGO SECRETO ESTELAR (NEW DESIGN) ===
document.addEventListener('DOMContentLoaded', function() {
    // Generar fondo de estrellas si existe el elemento
    const starryBackground = document.getElementById('starryBackground');
    if (starryBackground) {
        generarEstrellasFondo();
    }

    // Generar puzzle de letras si existe
    const lettersPuzzleGrid = document.getElementById('lettersPuzzleGrid');
    if (lettersPuzzleGrid) {
        generarTarjetasLetras();
    }

    // Animar texto épico si existe
    const epicText = document.getElementById('epicText');
    if (epicText) {
        inicializarAnimacionTipeo();
    }
});

function generarEstrellasFondo() {
    const background = document.getElementById('starryBackground');
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'starry-point';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 2;

        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = delay + 's';
        star.style.animationDuration = duration + 's';

        background.appendChild(star);
    }
}

function generarTarjetasLetras() {
    const grid = document.getElementById('lettersPuzzleGrid');
    if (!grid) return;

    // El orden aquí es el orden en que se concatenan las letras brillantes: A-U-R-A => 4821
    const letras = [
        { letter: 'A', number: 4, shine: true },
        { letter: 'E', number: 7, shine: false },
        { letter: 'U', number: 8, shine: true },
        { letter: 'N', number: 3, shine: false },
        { letter: 'R', number: 2, shine: true },
        { letter: 'K', number: 9, shine: false },
        { letter: 'A', number: 1, shine: true },
        { letter: 'T', number: 5, shine: false },
    ];

    const codigoInput = document.getElementById('respuestaInput');
    let codigoSeleccionado = [];

    letras.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'letter-card ' + (item.shine ? 'card-bright' : 'card-dim');
        card.innerHTML = '<span class="letter-card-letter">' + item.letter + '</span>' +
                          '<span class="letter-card-number">' + item.number + '</span>';

        card.addEventListener('click', function() {
            if (!item.shine) {
                card.classList.add('card-wrong-click');
                setTimeout(() => card.classList.remove('card-wrong-click'), 400);
                return;
            }

            if (card.classList.contains('card-used')) return;

            codigoSeleccionado.push(item.number);
            card.classList.add('card-used');

            if (codigoInput) {
                codigoInput.value = codigoSeleccionado.join('');
            }
        });

        grid.appendChild(card);
    });
}

function inicializarAnimacionTipeo() {
    const epicText = document.getElementById('epicText');
    const texto = epicText.textContent;
    epicText.textContent = '';
    let index = 0;

    function escribirLetra() {
        if (index < texto.length) {
            epicText.textContent += texto[index];
            index++;
            setTimeout(escribirLetra, 50); // 50ms entre letras
        }
    }

    // Iniciar animación después de un pequeño delay
    setTimeout(escribirLetra, 500);
}

