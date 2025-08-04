import axios from 'axios';
import https from 'https';

const api = 'https://swapi.py4e.com/api';  // use mirror api to avoid CORS issues or the ssl certificate issue

// const api = 'https://swapi.dev/api';

const cache = {}; // cache not frozen for this file, but outputs to other files will be frozen

export {
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
  const planetList = Object.values(planets).map(p => ({ ...p }));
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
    const { data: firstPageData } = await axios.get(nextPage);

    // Extract total count and page size
    const totalCount = firstPageData.count;
    const pageSize = firstPageData.results.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Generate all page URLs
    const pageUrls = Array.from({ length: totalPages }, (_, i) => `${nextPage}?page=${i + 1}`);

    // Fetch all pages in parallel
    const responses = await Promise.all(
      pageUrls.map(url => axios.get(url))
      // If SSL issue occurs, use this instead:
      // pageUrls.map(url => axios.get(url, { httpsAgent: agent }))
    );

    // Process each page's results
    responses.forEach(({ data }) => {
      data.results.forEach(item => {
        const id = item.url.replace(rootApi, '').replace(/\//g, '');
        item.id = parseInt(id);
        cache[cacheKey][id] = item;
      });
    });

    return Object.values(cache[cacheKey]);
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