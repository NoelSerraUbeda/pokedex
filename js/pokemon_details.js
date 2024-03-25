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

const colors = {
    fire: '#ff9c54', grass: '#63bb5b', electric: '#f3d23b', water: '#4d90d5', ground: '#d97746', rock: '#bfb186', fairy: '#ec8fe6', poison: '#ab6ac8', bug: '#90c12c', dragon: '#0a6dc4', psychic: '#f97176', flying: '#8fa8dd', fighting: '#ce4069', normal: '#8f98a0', dark: '#5a5366', steel: '#aab8c2', ice: '#a3e7fd', ghost: '#705898'
};

const getColorForType = (type) => {
    const color = colors[type];
    return color ? color : null;
};

const displayPokemonDetails = (pokemon) => {
    const pokemonDetailsContainer = document.getElementById('pokemon-details-container');

    // Crear elementos HTML para mostrar los detalles del Pokémon
    const name = document.querySelector('.name'); // Selecciona el elemento con la clase "name"
    name.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const imageContainer = document.createElement('div'); // Contenedor de la imagen
    imageContainer.classList.add('image-container');

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    // Obtener los tipos del Pokémon
    const pokemonTypes = pokemon.types.map(type => type.type.name);

    // Obtener el color correspondiente al tipo del Pokémon
    const matchingType = pokemonTypes.find(type => getColorForType(type));

    // Si hay un tipo coincidente, aplicar el color como fondo a la imagen
    if (matchingType) {
        const color = getColorForType(matchingType);
        image.style.backgroundColor = color;
        image.style.padding = '5px'; // Añadir un pequeño espacio para visualización
    }

    const types = document.createElement('p');
    types.textContent = 'Types: ' + pokemonTypes.join(', ');

    const abilities = document.createElement('p');
    abilities.textContent = 'Abilities: ' + pokemon.abilities.map(ability => ability.ability.name).join(', ');

    const hiddenAbility = pokemon.abilities.find(ability => ability.is_hidden);
    if (hiddenAbility) {
        const hiddenAbilityText = document.createElement('p');
        hiddenAbilityText.textContent = 'Hidden Ability: ' + hiddenAbility.ability.name;
        abilities.appendChild(hiddenAbilityText);
    }

    imageContainer.appendChild(image);
    imageWrapper.appendChild(imageContainer);
    imageWrapper.appendChild(types);
    imageWrapper.appendChild(abilities);

    const statsTitle = document.createElement('h2');
    statsTitle.textContent = 'Base Stats';

    const statsList = document.createElement('ul');
    statsList.classList.add('stats-list');
    pokemon.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(statItem);
    });

    const detailsWrapper = document.createElement('div');
    detailsWrapper.classList.add('details-wrapper');
    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('info-wrapper');

    infoWrapper.appendChild(statsTitle);
    infoWrapper.appendChild(statsList);

    detailsWrapper.appendChild(imageWrapper);
    detailsWrapper.appendChild(infoWrapper);

    pokemonDetailsContainer.appendChild(detailsWrapper);
};






