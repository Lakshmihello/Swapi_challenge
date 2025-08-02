import { types } from 'mobx-state-tree';

const { model, array, string, number } = types;

const Person = model('Person', {
  id: number,
  name: string,
  birth_year: string,
  eye_color: string,
  gender: string,
  height: string,
  mass: string,
  skin_color: string,
  homeworld: string,
  films: array(string),
  species: array(string),
  starships: array(string),
  vehicles: array(string),
  url: string,
  created: string,
  edited: string,
});

export default Person;
