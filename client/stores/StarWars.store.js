import { types, getSnapshot } from 'mobx-state-tree';

import apiService from '../services/api';
import PlanetModel from '../models/Planet.model';
import PersonModel from '../models/Person.model';

const { model, array, optional, map, boolean } = types;

const StarWarsStore = model('StarWarsStore', {
  planets: optional(array(PlanetModel), []),
  people: optional(array(PersonModel), []),

  loadingPlanets: optional(boolean, false),
  loadingPeople: optional(boolean, false),
})
  .actions(self => ({
    async afterCreate() {
      const people = await self.fetchPeople();
      const planets = await self.fetchPlanets(true);
      // map up person models to residents
      planets.forEach(planet => {
        planet.residents = (planet.residents || []).map(residentUrl => {
          const person = people.find(person => person.url === residentUrl);
          return person || null;
        });
      });
      self.setPlanets(planets);
    },

    async fetchPlanets(skipSetting = false) {
      self.setLoadingPlanets(true);
      const { data } = await apiService.getPlanets();
      self.setLoadingPlanets(false);
      if (!skipSetting) {
        self.setPlanets(data);
      } else {
        return data;
      }
    },
    async fetchPeople() {
      self.setLoadingPeople(true);
      const { data } = await apiService.getPeople();
      self.setLoadingPeople(false);
      self.setPeople(data);
      return data;
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
  }));

export default StarWarsStore;
