const { default: axios } = require('axios');

const api = 'https://swapi.dev/api';
const cache = {}; // cache not frozen for this file, but outputs to other files will be frozen

module.exports = {
  getPeople,
  getPlanets,
  getPlanetsWithResidents,
};

async function getPeople(sortBy) {
  const rootApi = api + '/people';
  const cacheKey = 'people';
  return getResults(rootApi, cacheKey);
}

async function getPlanets(sortBy) {
  const rootApi = api + '/planets';
  const cacheKey = 'planets';
  return getResults(rootApi, cacheKey);
}

async function getPlanetsWithResidents() {
  const [planets, people] = await Promise.all([
    getPlanets(),
    getPeople(),
  ]);
  // cheater way to deep clone an object
  const planetList = JSON.parse(JSON.stringify(Object.values(planets)));
  const peopleList = JSON.parse(JSON.stringify(Object.values(people)));

  planetList.forEach(planet => {
    planet.residents = planet.residents.map(url => {
      const person = peopleList.find(person => person.url === url) || {};
      return person.name || 'unknown';
    });
  });

  return planetList;
}


/* helper methods */
async function getResults(rootApi, cacheKey) {
  const startTime = new Date().valueOf();

  if (!cache[cacheKey]) {
    cache[cacheKey] = {};
  }

  async function getPage(nextPage, skipNext = true) {
    const { data } = await axios.get(nextPage);
    data.forEach(item => {
      const id = item.url.replace(rootApi, '').replace(/\//g, '');
      item.id = parseInt(id); // make things easier for the front-end
      cache[cacheKey][id] = item;
    });
    if (!skipNext && next) {
      return getPage(next, false);
    } else {
      return data;
    }
  }

  if (Object.keys(cache[cacheKey]).length === 0) {
    await getPage(rootApi, false);
  } else {
    console.log(`"${cacheKey}" | pulling from existing cache`);
  }

  // return as frozen object so any mutating won't affect the cache in this file
  const toReturn = Object.freeze(cache[cacheKey]);
  console.log(`"${cacheKey}" | timing: ${new Date().valueOf() - startTime} | result count: ${Object.values(toReturn).length}`);
  return toReturn;
}
