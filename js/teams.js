document.addEventListener('DOMContentLoaded', async () => {
  // Seleccionar elementos dentro del div .container
  const container = document.querySelector('.container');
  const pokemon_selectors_container = container.querySelectorAll('.select-input');
  const pokemon_images_container = container.querySelectorAll('.card-image');
  const pokemon_names_container = container.querySelectorAll('h1');

  // Seleccionar el selector y la imagen en la tarjeta favorita
  const favorite_card_selector = document.querySelector('.favorite_card .select-input');
  const favorite_card_image = document.querySelector('.favorite_card .favorite_card-image');
  const favorite_card_name = document.querySelector('.favorite_card h1');

  // Seleccionar el botón aleatorio
  const randomButton = document.getElementById('random-pokemon-button');

  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await response.json();
  let pokemons = data.results;

  // Ordenar los Pokémon por nombre
  pokemons.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  console.log("Número de Pokémon registrados en el selector:", pokemons.length);

  const loadPokemonImage = async (pokemonName, imageElement) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    const pokemonImage = data.sprites.front_default;
    imageElement.src = pokemonImage;
  };

  const addPokemonOptions = (selectors) => {
    pokemons.forEach((pokemon) => {
      const option = document.createElement('option');
      option.textContent = pokemon.name.toUpperCase();
      selectors.forEach(selector => {
        const clonedOption = option.cloneNode(true);
        selector.appendChild(clonedOption);
      });
    });
  };

  // Añadir opciones a todos los selectores
  addPokemonOptions([...pokemon_selectors_container, favorite_card_selector]);

  // Manejar cambios en los selectores dentro del container
  pokemon_selectors_container.forEach((selector, index) => {
    selector.addEventListener('change', () => {
      const selectedPokemonName = selector.value;
      loadPokemonImage(selectedPokemonName, pokemon_images_container[index]);
      pokemon_names_container[index].textContent = selectedPokemonName.toUpperCase();
    });
  });

  // Manejar cambios en el selector de la tarjeta favorita
  favorite_card_selector.addEventListener('change', () => {
    const selectedPokemonName = favorite_card_selector.value;
    loadPokemonImage(selectedPokemonName, favorite_card_image);
    favorite_card_name.textContent = selectedPokemonName.toUpperCase();
  });

  // Funcionalidad del botón para elegir Pokémon al azar para todas las tarjetas dentro del .container
  randomButton.addEventListener('click', () => {
    pokemon_selectors_container.forEach((selector, index) => {
      const randomIndex = Math.floor(Math.random() * pokemons.length);
      const randomPokemon = pokemons[randomIndex];
      loadPokemonImage(randomPokemon.name, pokemon_images_container[index]);
      pokemon_names_container[index].textContent = randomPokemon.name.toUpperCase();
      selector.value = randomPokemon.name.toUpperCase();
    });
  });
});
