const { sorter } = require('../utils');
const starWarsController = require('../controllers/starWars');

const router = require('express').Router();

router.get('/planets', getPlanets);
router.get('/people', getPeople);

module.exports = router;


async function getPlanets(req, res) {
  const {
    sortBy,
    replacePeopleNames = 'true',
  } = req.query;

  let planetList;
  try {
    if (replacePeopleNames === 'true') {
      planetList = await starWarsController.getPlanetsWithResidents();
    } else {
      const planets = await starWarsController.getPlanets();
      planetList = Object.values(planets);
    }

    if (sortBy) {
      sorter(sortBy, planetList);
    }

    res.json(planetList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPeople(req, res) {
  const { sortBy } = req.query;

  try {
    const people = await starWarsController.getPeople();
    const peopleList = Object.values(people);

    if (sortBy) {
      sorter(sortBy, peopleList);
    }

    res.json(peopleList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
