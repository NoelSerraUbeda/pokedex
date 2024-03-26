document.addEventListener('DOMContentLoaded', () => {

  const poke_container = document.getElementById('poke-container');
  const type_filter_buttons = document.getElementById('filter-buttons');
  const pokemon_count = 1025;
  const colors = {
    fire: '#ff9c54', grass: '#63bb5b', electric: '#f3d23b', water: '#4d90d5', ground: '#d97746', rock: '#bfb186', fairy: '#ec8fe6', poison: '#ab6ac8', bug: '#90c12c', dragon: '#0a6dc4', psychic: '#f97176', flying: '#8fa8dd', fighting: '#ce4069', normal: '#8f98a0', dark: '#5a5366', steel: '#aab8c2', ice: '#a3e7fd', ghost: '#705898'
  };

  const typeImages = {
    fire: 'resources/images/types/fire.webp', grass: 'resources/images/types/grass.webp', electric: 'resources/images/types/electric.webp', water: 'resources/images/types/water.webp', ground: 'resources/images/types/ground.webp', rock: 'resources/images/types/rock.webp', fairy: 'resources/images/types/fairy.webp', poison: 'resources/images/types/poison.webp', bug: 'resources/images/types/bug.webp', dragon: 'resources/images/types/dragon.webp', psychic: 'resources/images/types/psychic.webp', flying: 'resources/images/types/flying.webp', fighting: 'resources/images/types/fighting.webp', normal: './resources/images/types/normal.webp', dark: 'resources/images/types/dark.webp', steel: 'resources/images/types/steel.webp', ice: 'resources/images/types/ice.webp', ghost: 'resources/images/types/ghost.webp'
  };

  const main_types = Object.keys(colors);

  // Función para obtener datos de Pokémon de la API
  const fetchPokemons = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
      await getPokemon(i);
    }
    // Mostrar los botones de filtrado después de haber cargado todos los Pokémon
    type_filter_buttons.style.display = 'block';
  };

  // Función para obtener datos de un Pokémon específico
  const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    createPokemonCard(data);
  };

  // Función para crear una tarjeta de Pokémon
  const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');

    const poke_types = pokemon.types.map(type => type.type.name);
    const primaryType = main_types.find(type => poke_types.indexOf(type) > -1);
    const color = colors[primaryType];

    pokemonEl.style.backgroundColor = color;

    let typeInnerHTML = `<small class="type">${primaryType}</small>`;

    if (poke_types.length > 1) {
      const secondaryType = poke_types.find(type => type !== primaryType);
      typeInnerHTML += `&nbsp;&nbsp<small class="type secondary">${secondaryType}</small>`;
    }

    const pokemonInnerHTML = `
            <div class="img-container">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
            </div>
            <div class="info">
                <span class="number">#${id}</span>
                <h3 class="name">${name}</h3>
                ${typeInnerHTML}
            </div>
        `;
    pokemonEl.innerHTML = pokemonInnerHTML;

    pokemonEl.addEventListener('click', () => {
      window.location.href = `pokemon_details.html?id=${pokemon.id}`;
    });

    pokemonEl.setAttribute('data-id', pokemon.id); // Agregar atributo de ID de Pokémon

    poke_container.appendChild(pokemonEl);
  };

  // Función para filtrar los Pokémon por tipo seleccionado
  const filterPokemonsByType = (type) => {
    const pokemonCards = document.querySelectorAll('.pokemon');
    pokemonCards.forEach((card) => {
      const cardType = card.querySelector('.type').textContent.toLowerCase();
      if (type === 'all' || cardType === type.toLowerCase() || cardType === type.toUpperCase()) {
        card.style.display = 'inline-block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Función para renderizar botones de filtro por tipo
  const renderTypeFilterButtons = () => {
    const allButton = document.createElement('img');
    allButton.src = 'resources/images/all.png';
    allButton.alt = 'All';
    allButton.addEventListener('click', () => filterPokemonsByType('all'));
    type_filter_buttons.appendChild(allButton);

    main_types.forEach((type) => {
      const button = document.createElement('button');
      const img = document.createElement('img');
      img.src = typeImages[type];
      img.alt = type;
      button.appendChild(img);
      button.addEventListener('click', () => filterPokemonsByType(type));
      type_filter_buttons.appendChild(button);
    });
    // Ocultar los botones de filtrado al principio
    type_filter_buttons.style.display = 'none';
  };

  // Función para filtrar los Pokémon por generación seleccionada
  const filterPokemonsByGeneration = (gen) => {
    const pokemons = document.querySelectorAll('.pokemon');
    pokemons.forEach(pokemon => {
      const pokemonId = parseInt(pokemon.getAttribute('data-id'));
      if (gen === 'all' || getGeneration(pokemonId) === gen) {
        pokemon.style.display = 'inline-block';
      } else {
        pokemon.style.display = 'none';
      }
    });
  };

  // Función para renderizar botones de filtro por generación
  const renderGenerationFilterButtons = () => {
    const genButtons = document.querySelectorAll('.gen-filter');
    genButtons.forEach(button => {
      button.addEventListener('click', () => {
        const gen = button.getAttribute('data-gen');
        filterPokemonsByGeneration(gen === 'all' ? 'all' : parseInt(gen));
      });
    });
  };
  // Función para determinar la generación basada en el ID del Pokémon
  const getGeneration = (id) => {
    if (id <= 151) {
      return 1;
    } else if (id <= 251) {
      return 2;
    } else if (id <= 386) {
      return 3;
    } else if (id <= 493) {
      return 4;
    } else if (id <= 649) {
      return 5;
    } else if (id <= 721) {
      return 6;
    } else if (id <= 809) {
      return 7;
    } else if (id <= 898) {
      return 8;
    } else { return 9; }
  };

  // Función para filtrar Pokémon por nombre
  const filterPokemonsByName = (name) => {
    const pokemonCards = document.querySelectorAll('.pokemon');
    pokemonCards.forEach((card) => {
      const pokemonName = card.querySelector('.name').textContent.toLowerCase();
      if (pokemonName.includes(name.toLowerCase())) {
        card.style.display = 'inline-block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Escuchar el evento de cambio en el campo de búsqueda
  const pokemonSearchInput = document.getElementById('pokemon-search');
  pokemonSearchInput.addEventListener('input', () => {
    const searchTerm = pokemonSearchInput.value;
    filterPokemonsByName(searchTerm);
  });

  // Inicializar la Pokédex
  renderTypeFilterButtons();
  renderGenerationFilterButtons();
  fetchPokemons();

});
