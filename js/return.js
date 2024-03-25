// Seleccionar la flecha de retorno
const returnArrow = document.getElementById('return-arrow');

// Agregar un evento de clic a la flecha de retorno
returnArrow.addEventListener('click', () => {
    // Redirigir a la página de la lista de Pokémon
    window.location.href = 'pokedex.html';
});
