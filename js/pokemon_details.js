document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pokemonId = params.get('id');
  let isAlternative = false;

  if (pokemonId) getPokemonDetails(pokemonId);

  const alternativeButton = document.getElementById('alternative-button');
  alternativeButton.addEventListener('click', () => {
    isAlternative = !isAlternative;
    isAlternative ? checkAndDisplayAlternative(pokemonId) : getPokemonDetails(pokemonId);
  });
});

const getPokemonDetails = async (id) => {
  const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
  displayPokemonDetails(pokemon);
};

const fetchData = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const checkAndDisplayAlternative = async (id) => {
  const alternativeId = alternativePokemonMap[id] || await getAlternativeId(id);
  if (id === alternativeId) {
    showAlert();
    return;
  }
  getPokemonDetails(alternativeId);
};


const getAlternativeId = async (id) => {
  const speciesDetails = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const alternative = speciesDetails.varieties.find(variety => !variety.is_default);
  if (!alternative) {
    showAlert();
    return id;
  }
  return alternative.pokemon.url.split('/').slice(-2, -1)[0];
};

const displayPokemonDetails = async (pokemon) => {
  const { name, sprites, types, abilities, stats, height, weight } = pokemon;
  document.title = `Pokémon Details - ${capitalizeFirstLetter(name)}`;

  const nameElement = document.querySelector('.name');
  nameElement.textContent = capitalizeFirstLetter(name);

  const imageElement = document.getElementById('pokemon-image');
  imageElement.src = sprites.front_default;
  imageElement.alt = name;

  const typesElement = document.getElementById('pokemon-types');
  typesElement.innerHTML = `<span>Types:</span> ${types.map(type => `<span style="color:${getColorForType(type.type.name)}">${capitalizeFirstLetter(type.type.name)}</span>`).join(', ')}`;

  const abilitiesElement = document.getElementById('pokemon-abilities');
  abilitiesElement.innerHTML = `<span>Abilities:</span> ${abilities.filter(ability => !ability.is_hidden).map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}`;

  const hiddenAbility = abilities.find(ability => ability.is_hidden);
  const hiddenAbilityElement = document.getElementById('pokemon-hidden-ability');
  if (hiddenAbility && !hiddenAbilityElement) {
    const hiddenAbilityParagraph = document.createElement('p');
    hiddenAbilityParagraph.innerHTML = `<span>Hidden Ability:</span> ${capitalizeFirstLetter(hiddenAbility.ability.name)}`;
    hiddenAbilityParagraph.id = 'pokemon-hidden-ability';
    abilitiesElement.parentNode.insertBefore(hiddenAbilityParagraph, abilitiesElement.nextSibling);
  } else if (!hiddenAbility && hiddenAbilityElement) {
    hiddenAbilityElement.parentNode.removeChild(hiddenAbilityElement);
  }

  const statsList = document.querySelector('.stats-list');
  statsList.innerHTML = stats.map(stat => `<li>${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}</li>`).join('');

  const matchingType = types.find(type => getColorForType(type.type.name));
  if (matchingType) imageElement.style.backgroundColor = getColorForType(matchingType.type.name);

  document.getElementById('height').textContent = `Height: ${height ? height / 10 + ' m' : "There is still no data on this aspect."}`;
  document.getElementById('weight').textContent = `Weight: ${weight ? weight / 10 + ' kg' : "There is still no data on this aspect."}`;

  const descriptionParagraph = document.getElementById('pokemon-description');
  descriptionParagraph.textContent = await getPokemonDescription(pokemon.id);
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getColorForType = (type) => colors[type] || null;

const showAlert = () => {
  const warning = document.getElementById("warningMessage");
  warning.style.display = "block";
  setTimeout(() => {
    warning.style.display = "none";
  }, 3000);
};

const getPokemonDescription = async (id) => {
  const speciesDetails = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const flavorTextEntries = speciesDetails.flavor_text_entries.filter(entry => entry.language.name === 'en');
  const description = flavorTextEntries.length > 0 ? flavorTextEntries[0].flavor_text.replace(//g, " ") : "There is still no data on this aspect.";
  return capitalizeFirstLetter(description.toLowerCase());
};

const colors = {
  fire: '#ff9c54', grass: '#63bb5b', electric: '#f3d23b', water: '#4d90d5', ground: '#d97746', rock: '#bfb186', fairy: '#ec8fe6', poison: '#ab6ac8', bug: '#90c12c', dragon: '#0a6dc4', psychic: '#f97176', flying: '#8fa8dd', fighting: '#ce4069', normal: '#8f98a0', dark: '#5a5366', steel: '#aab8c2', ice: '#a3e7fd', ghost: '#705898'
};

const alternativePokemonMap = {
  '133': '10205',
  '741': '10125',
  '800': '10157',
  '128': '10251',
  '1017': '10274',
  '479': '10010',
  '555': '10177',
  '718': '10120',
  '25': '10199',
  '1007': '1007',
  '1008': '1008',
  '738': '738',
  '754': '754',
  '743': '743',
  '735': '735',
  '752': '752',
  '758': '758',
  '777': '777',
};

