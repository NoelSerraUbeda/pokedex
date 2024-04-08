document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pokemonId = params.get('id');
  let isMegaEvolved = false;

  if (pokemonId) {
    getPokemonDetails(pokemonId);
  }

  // Agregar evento de clic al botón de megaevolución
  const megaEvolutionButton = document.getElementById('mega-evolution-button');
  megaEvolutionButton.addEventListener('click', () => {
    if (pokemonId) {
      // Alternar entre el estado base y la megaevolución
      if (isMegaEvolved) {
        // Si está megaevolucionado, mostrar los detalles del Pokémon base
        getPokemonDetails(pokemonId);
        isMegaEvolved = false; // Cambiar el estado a base
      } else {
        // Si está en su estado base, mostrar los detalles de la megaevolución
        checkAndDisplayMegaEvolution(pokemonId);
        isMegaEvolved = true; // Cambiar el estado a megaevolucionado
      }
    } else {
      alert("Este Pokémon no tiene una forma megaevolucionada."); // Mostrar alerta si no hay una forma megaevolucionada
    }
  });
});

const getPokemonDetails = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayPokemonDetails(data);
};

// Datos
const getPokemonSpeciesDetails = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// Colores
const colors = {
  fire: '#ff9c54', grass: '#63bb5b', electric: '#f3d23b', water: '#4d90d5', ground: '#d97746', rock: '#bfb186', fairy: '#ec8fe6', poison: '#ab6ac8', bug: '#90c12c', dragon: '#0a6dc4', psychic: '#f97176', flying: '#8fa8dd', fighting: '#ce4069', normal: '#8f98a0', dark: '#5a5366', steel: '#aab8c2', ice: '#a3e7fd', ghost: '#705898'
};

// Asignar color a tipo
const getColorForType = (type) => {
  const color = colors[type];
  return color ? color : null;
};

// Mayusculas a los datos
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Display de los datos
const displayPokemonDetails = async (pokemon) => {
  const pokemonNameParts = pokemon.name.split('-');
  const pokemonName = capitalizeFirstLetter(pokemonNameParts[0]);
  document.title = `Pokémon Details - ${pokemonName}`;

  const name = document.querySelector('.name');
  name.textContent = capitalizeFirstLetter(pokemon.name);

  const image = document.getElementById('pokemon-image');
  image.src = pokemon.sprites.front_default;
  image.alt = pokemon.name;

  const dataContainer = document.getElementById('data-container');

  const types = document.getElementById('pokemon-types');
  const pokemonTypes = pokemon.types.map(type => type.type.name.toLowerCase());
  types.innerHTML = '<span>Types:</span> ' + pokemonTypes.map(type => capitalizeFirstLetter(type)).join(', ');
  dataContainer.appendChild(types);

  const abilities = document.getElementById('pokemon-abilities');
  const regularAbilities = pokemon.abilities.filter(ability => !ability.is_hidden).map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ');
  abilities.innerHTML = '<span>Abilities:</span> ' + regularAbilities;
  dataContainer.appendChild(abilities);

  const hiddenAbility = pokemon.abilities.find(ability => ability.is_hidden);
  const hiddenAbilityElement = document.getElementById('pokemon-hidden-ability');

  if (hiddenAbility && !hiddenAbilityElement) {
    const hiddenAbilityParagraph = document.createElement('p');
    hiddenAbilityParagraph.innerHTML = '<span>Hidden Ability:</span> ' + capitalizeFirstLetter(hiddenAbility.ability.name);
    hiddenAbilityParagraph.id = 'pokemon-hidden-ability';
    abilities.parentNode.insertBefore(hiddenAbilityParagraph, abilities.nextSibling);
  } else if (!hiddenAbility && hiddenAbilityElement) {
    hiddenAbilityElement.parentNode.removeChild(hiddenAbilityElement);
  }

  const statsList = document.querySelector('.stats-list');
  statsList.innerHTML = '';
  pokemon.stats.forEach(stat => {
    const statItem = document.createElement('li');
    statItem.textContent = `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`;
    statsList.appendChild(statItem);
  });

  const matchingType = pokemonTypes.find(type => getColorForType(type));

  if (matchingType) {
    const color = getColorForType(matchingType);
    image.style.backgroundColor = color;
  }

  const speciesDetails = await getPokemonSpeciesDetails(pokemon.id);
  const flavorTextEntries = speciesDetails.flavor_text_entries;
  const descriptionEntry = flavorTextEntries.find(entry => entry.language.name === 'en');
  const description = descriptionEntry ? descriptionEntry.flavor_text.replace(//g, " ") : "There is still no data on this aspect.";
  const descriptionParagraph = document.getElementById('pokemon-description');
  descriptionParagraph.textContent = description;

  const heightElement = document.getElementById('height');
  const height = pokemon.height ? `${pokemon.height / 10} m` : "There is still no data on this aspect.";
  heightElement.textContent = `Height: ${height}`;

  const weightElement = document.getElementById('weight');
  const weight = pokemon.weight ? `${pokemon.weight / 10} kg` : "There is still no data on this aspect.";
  weightElement.textContent = `Weight: ${weight}`;
};


const checkAndDisplayMegaEvolution = async (id) => {
  const speciesDetails = await getPokemonSpeciesDetails(id);

  // Verificar si el Pokémon tiene una megaevolución
  const hasMegaEvolution = speciesDetails.varieties.some(variety => {
    return variety.is_default === false;
  });

  if (hasMegaEvolution) {
    const megaEvolutionVariety = speciesDetails.varieties.find(variety => {
      return variety.is_default === false;
    });
    const megaPokemonId = megaEvolutionVariety.pokemon.url.split('/').slice(-2, -1)[0];

    // Verificar si el Pokémon actualmente está en su forma megaevolucionada
    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentPokemonId = currentUrlParams.get('id');

    if (currentPokemonId === megaPokemonId) {
      // Si ya está megaevolucionado, mostrar los detalles del Pokémon normal
      const defaultVariety = speciesDetails.varieties.find(variety => {
        return variety.is_default === true;
      });
      const defaultPokemonId = defaultVariety.pokemon.url.split('/').slice(-2, -1)[0];
      getPokemonDetails(defaultPokemonId);
    } else {
      // Si no está megaevolucionado, mostrar los detalles de la megaevolución
      getPokemonDetails(megaPokemonId);
    }
  } else {
    // Si el Pokémon no tiene megaevolución, no se hace nada
  }
};



// Descripción
const addPokemonDescription = (description) => {
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  const descriptionTitle = document.createElement('h3');
  descriptionTitle.textContent = 'Description:';
  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.textContent = description;
  descriptionContainer.appendChild(descriptionTitle);
  descriptionContainer.appendChild(descriptionParagraph);

  const pokemonDetailsContainer = document.getElementById('pokemon-details-container');
  pokemonDetailsContainer.appendChild(descriptionContainer);
};



