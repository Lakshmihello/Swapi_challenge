import { types } from 'mobx-state-tree';

import PersonModel from './Person.model.js';

const { model, number, string, array, maybeNull } = types;

const Planet = model('Planet', {
  id: number,
  name: string,
  rotation_period: string,
  orbital_period: string,
  gravity: string,
  population: string,
  climate: string,
  terrain: string,
  surface_water: string,
  residents: array(maybeNull(PersonModel)),
  films: array(string),
  url: string,
  created: string,
  edited: string,
});

export default Planet;
