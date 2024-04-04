document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pokemonId = params.get('id');
  if (pokemonId) {
    getPokemonDetails(pokemonId);
  }
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
  // Dividir el nombre del Pokémon por el guión
  const pokemonNameParts = pokemon.name.split('-');

  // Tomar solo la primera parte del nombre
  const pokemonName = capitalizeFirstLetter(pokemonNameParts[0]);
  document.title = `Pokémon Details - ${pokemonName}`;
  const name = document.querySelector('.name');
  name.textContent = capitalizeFirstLetter(pokemon.name);

  const image = document.getElementById('pokemon-image');
  image.src = pokemon.sprites.front_default;
  image.alt = pokemon.name;

  const dataContainer = document.getElementById('data-container');

  // Mostrar tipos
  const types = document.getElementById('pokemon-types');
  const pokemonTypes = pokemon.types.map(type => type.type.name.toLowerCase());
  types.innerHTML = '<span>Types:</span> ' + pokemonTypes.map(type => capitalizeFirstLetter(type)).join(', ');
  dataContainer.appendChild(types);

  // Mostrar habilidades
  const abilities = document.getElementById('pokemon-abilities');
  const regularAbilities = pokemon.abilities.filter(ability => !ability.is_hidden).map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ');
  abilities.innerHTML = '<span>Abilities:</span> ' + regularAbilities;
  dataContainer.appendChild(abilities);

  const hiddenAbility = pokemon.abilities.find(ability => ability.is_hidden);
  if (hiddenAbility) {
    const hiddenAbilityElement = document.createElement('p');
    hiddenAbilityElement.innerHTML = '<span>Hidden Ability:</span> ' + capitalizeFirstLetter(hiddenAbility.ability.name);
    hiddenAbilityElement.id = 'pokemon-hidden-ability';
    abilities.parentNode.insertBefore(hiddenAbilityElement, abilities.nextSibling);
  }

  const statsList = document.querySelector('.stats-list');
  statsList.innerHTML = '';
  pokemon.stats.forEach(stat => {
    const statItem = document.createElement('li');
    statItem.textContent = `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`;
    statsList.appendChild(statItem);
  });

  // Obtener el color correspondiente al tipo del Pokémon
  const matchingType = pokemonTypes.find(type => getColorForType(type));

  // Si hay un tipo coincidente, aplicar el color como fondo a la imagen
  if (matchingType) {
    const color = getColorForType(matchingType);
    image.style.backgroundColor = color;
  }

  // Agregar descripción
  const speciesDetails = await getPokemonSpeciesDetails(pokemon.id);

  const flavorTextEntries = speciesDetails.flavor_text_entries;
  const descriptionEntry = flavorTextEntries.find(entry => entry.language.name === 'en');
  const description = descriptionEntry ? descriptionEntry.flavor_text.replace(//g, " ") : "There is still no data on this aspect.";
  const descriptionParagraph = document.getElementById('pokemon-description');
  descriptionParagraph.textContent = description;

  // Mostrar altura y peso
  const heightElement = document.getElementById('height');
  const height = pokemon.height ? `${pokemon.height / 10} m` : "There is still no data on this aspect.";
  heightElement.textContent = `Height: ${height}`;

  const weightElement = document.getElementById('weight');
  const weight = pokemon.weight ? `${pokemon.weight / 10} kg` : "There is still no data on this aspect.";
  weightElement.textContent = `Weight: ${weight}`;
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



