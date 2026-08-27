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
