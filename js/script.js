document.addEventListener('DOMContentLoaded', () => {

  const poke_container = document.getElementById('poke-container');
  const type_filter_buttons = document.getElementById('filter-buttons');

  const loader = document.getElementById('loader');
  const pokemon_count = 1025;
  const colors = {
    fire: '#ff9c54', grass: '#63bb5b', electric: '#f3d23b', water: '#4d90d5', ground: '#d97746', rock: '#bfb186', fairy: '#ec8fe6', poison: '#ab6ac8', bug: '#90c12c', dragon: '#0a6dc4', psychic: '#f97176', flying: '#8fa8dd', fighting: '#ce4069', normal: '#8f98a0', dark: '#5a5366', steel: '#aab8c2', ice: '#a3e7fd', ghost: '#705898'
  };

  const typeImages = {
    fire: 'resources/images/types/fire.svg', grass: 'resources/images/types/grass.svg', electric: 'resources/images/types/electric.svg', water: 'resources/images/types/water.svg', ground: 'resources/images/types/ground.svg', rock: 'resources/images/types/rock.svg', fairy: 'resources/images/types/fairy.svg', poison: 'resources/images/types/poison.svg', bug: 'resources/images/types/bug.svg', dragon: 'resources/images/types/dragon.svg', psychic: 'resources/images/types/psychic.svg', flying: 'resources/images/types/flying.svg', fighting: 'resources/images/types/fighting.svg', normal: './resources/images/types/normal.svg', dark: 'resources/images/types/dark.svg', steel: 'resources/images/types/steel.svg', ice: 'resources/images/types/ice.svg', ghost: 'resources/images/types/ghost.svg'
  };
  const main_types = Object.keys(colors);

  const fetchPokemons = async () => {
    loader.style.display = 'block';
    for (let i = 1; i <= pokemon_count; i++) {
      await getPokemon(i);
    }
    type_filter_buttons.style.display = 'flex';
    loader.style.display = 'none';
  };

  const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    createPokemonCard(data);
  };

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
      window.open(`pokemon_details.html?id=${pokemon.id}`, '_blank');
    });

    pokemonEl.setAttribute('data-id', pokemon.id);
    poke_container.appendChild(pokemonEl);
  };

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
    type_filter_buttons.style.display = 'none';
  };

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

  const renderGenerationFilterButtons = () => {
    const genButtons = document.querySelectorAll('.gen-filter');
    genButtons.forEach(button => {
      button.addEventListener('click', () => {
        const gen = button.getAttribute('data-gen');
        filterPokemonsByGeneration(gen === 'all' ? 'all' : parseInt(gen));
      });
    });
  };

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

  const pokemonSearchInput = document.getElementById('pokemon-search');
  pokemonSearchInput.addEventListener('input', () => {
    const searchTerm = pokemonSearchInput.value;
    filterPokemonsByName(searchTerm);
  });

  const goToRandomPokemonDetails = () => {
    const randomPokemonId = Math.floor(Math.random() * pokemon_count) + 1;
    window.open(`pokemon_details.html?id=${randomPokemonId}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const svgFooter = document.querySelector('footer svg');
  svgFooter.addEventListener('click', scrollToTop);

  renderTypeFilterButtons();
  renderGenerationFilterButtons();
  fetchPokemons();

  const randomPokemonButton = document.getElementById('random-pokemon-button');
  randomPokemonButton.addEventListener('click', goToRandomPokemonDetails);
});
