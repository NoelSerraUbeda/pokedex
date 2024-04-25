document.addEventListener('DOMContentLoaded', async () => {
  const pokemon_selectors = document.querySelectorAll('.select-input');
  const pokemon_images = document.querySelectorAll('.card-image');
  const pokemon_names = document.querySelectorAll('h1');

  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await response.json();
  let pokemons = data.results;

  // Ordenar los Pokémon por nombre
  pokemons.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  console.log("Número de Pokémon registrados en el selector:", pokemons.length);

  const loadPokemonImage = async (pokemonName, index) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    const pokemonImage = data.sprites.front_default;
    pokemon_images[index].src = pokemonImage;
  };

  pokemon_selectors.forEach((selector, index) => {
    selector.addEventListener('change', () => {
      const selectedPokemonName = selector.value;
      loadPokemonImage(selectedPokemonName, index);
      pokemon_names[index].textContent = selectedPokemonName.toUpperCase();
    });
  });

  pokemons.forEach((pokemon) => {
    const option = document.createElement('option');
    option.textContent = pokemon.name.toUpperCase(); // Manteniendo el nombre en mayúsculas
    pokemon_selectors.forEach(selector => {
      const clonedOption = option.cloneNode(true);
      selector.appendChild(clonedOption);
    });
  });
});
