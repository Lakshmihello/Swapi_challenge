import { types, getSnapshot } from 'mobx-state-tree';

import apiService from '../services/api.js';
import PlanetModel from '../models/Planet.model.js';
import PersonModel from '../models/Person.model.js';

const { model, array, optional, map, boolean } = types;

const StarWarsStore = model('StarWarsStore', {
  planets: optional(array(PlanetModel), []),
  people: optional(array(PersonModel), []),

  loadingPlanets: optional(boolean, false),
  loadingPeople: optional(boolean, false),
})
  .actions(self => ({
    async afterCreate() {
      try {
        // Optimized: Single API call that gets both planets and people
        await self.fetchPlanetsWithPeople();
      } catch (error) {
        console.error('Error in afterCreate:', error);
        // Fallback to separate calls if optimized call fails
        await self.fetchDataSeparately();
      }
    },

    // Optimized method - gets both planets and people in one call
     
   async fetchPlanetsWithPeople() {
      self.setLoadingPlanets(true);
      self.setLoadingPeople(true);
      
      try {
        const response = await apiService.getPlanetsWithPeople();
        
        // Response format: { planets: [...], people: [...] }
        if (response.data.planets && response.data.people) {
          self.setPlanets(response.data.planets);
          self.setPeople(response.data.people);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching planets with people:', error);
        throw error;
      } finally {
        self.setLoadingPlanets(false);
        self.setLoadingPeople(false);
      }
    },

    // Fallback method - separate API calls
    async fetchDataSeparately() {
      try {
        const [peopleResponse, planetsResponse] = await Promise.all([
          self.fetchPeople(),
          self.fetchPlanets(true)
        ]);

        const people = peopleResponse;
        const planets = planetsResponse;

        // Map residents to people objects
        planets.forEach(planet => {
          planet.residents = (planet.residents || []).map(residentUrl => {
            const person = people.find(person => person.name === residentUrl);
            return person || null;
          });
        });

        self.setPlanets(planets);
      } catch (error) {
        console.error('Error in fetchDataSeparately:', error);
        throw error;
      }
    },

    async fetchPlanets(skipSetting = false) {
      self.setLoadingPlanets(true);
        try {
      const response = await apiService.getPlanets();
const data = response.data;
       self.setLoadingPlanets(false);
      if (!skipSetting) {
        self.setPlanets(data);
      } else {
        return data;
      }} catch (error) {
        self.setLoadingPlanets(false);
        throw error;
      }

    },
    async fetchPeople() {
      self.setLoadingPeople(true);
      try{
        const response = await apiService.getPeople();
const data = response.data;
      self.setLoadingPeople(false);
      self.setPeople(data);
      return data;
       } catch (error) {
        self.setLoadingPeople(false);
        throw error;
      }

    },

    setLoadingPlanets(bool) {
      self.loadingPlanets = bool;
    },
    setLoadingPeople(bool) {
      self.loadingPeople = bool;
    },
    setPlanets(planets) {
      self.planets = planets;
    },
    setPeople(people) {
      self.people = people;
    },
  }))
  .views(self => ({
    getFilteredPeople(searchTerm) {
      searchTerm = searchTerm.trim();

      if (!searchTerm) return self.people;

      return self.people.filter(person => (
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    },
    getFilteredPlanets(searchTerm) {
      searchTerm = searchTerm.trim();

      if (!searchTerm) return self.planets;
      
      return self.planets.filter(planet => (
        planet.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    },
    getPlanet(planetId) {
      return self.planets.find(planet => planet.id === parseInt(planetId));
    },
    getPerson(personId) {
      return self.people.find(person => person.id === parseInt(personId));
    },
    

    // Helper computed values
    get isDataLoaded() {
      return self.planets.length > 0 && self.people.length > 0;
    },

    get isLoading() {
      return self.loadingPlanets || self.loadingPeople;
    },
  }));

export default StarWarsStore;

