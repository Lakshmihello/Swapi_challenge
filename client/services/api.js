import axios from 'axios';

export default {
  getPlanets,
  getPeople,
};

function getPlanets() {
  return axios.get('/api/starWars/planets', {
    params: {
      sortBy: 'name',
      replacePeopleNames: false,
    }
  });
}

function getPeople() {
  return axios.get('/api/starWars/people', {
    params: {
      sortBy: 'name',
    }
  });
}
