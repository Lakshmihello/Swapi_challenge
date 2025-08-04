import { Router } from 'express';
import { sorter } from '../utils.js';
import * as starWarsController from '../controllers/starWars.js';

const router = Router();

router.get('/planets', getPlanets);
router.get('/people', getPeople);

export default router;

async function getPlanets(req, res) {
  const {
    sortBy,
    replacePeopleNames = 'true',
    page ,
    limit ,
     includePeople = 'false'  // For optimized loading
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

   // If pagination is requested
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedData = planetList.slice(startIndex, endIndex);
      
    const response = {
     data: paginatedData,
        total: planetList.length,
        page: pageNum,
        limit: limitNum,
    };
// Include people data if requested (for optimized loading)
      if (includePeople === 'true') {
        const people = await starWarsController.getPeople();
        response.people = Object.values(people);
      }

    res.json(response);
    } else {
      // No pagination - return all data (for MobX store compatibility)
      if (includePeople === 'true') {
        const people = await starWarsController.getPeople();
        const response = {
          planets: planetList,
          people: Object.values(people)
        };
        res.json(response);
      } else {
        res.json(planetList);
      }
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getPeople(req, res) {
  const {
    sortBy,
    page ,
    limit ,
  } = req.query;
    let peopleList ;

  try {
    const people = await starWarsController.getPeople();
     peopleList = Object.values(people);

    if (sortBy) {
      sorter(sortBy, peopleList);
    }
 // If pagination is requested
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedData = peopleList.slice(startIndex, endIndex);

    const response = {
     data: paginatedData,
        total: peopleList.length,
        page: pageNum,
        limit: limitNum,
    };

    res.json(response);
    } else {
      // No pagination - return all data (for MobX store compatibility)
      res.json(peopleList);
    }

  } catch (e) {
    console.error('Error in /people route:', e.stack);
    res.status(500).json({ error: e.message });
  }
}

