import axios from 'axios';

const apiService = {
 getPlanets(params={}) {
  return axios.get('/api/starWars/planets', {
    params,
  });
},
 getPeople(params={}) {
  return axios.get('/api/starWars/people', {
    params
  });
},
  // For paginated requests
  getPlanetsPaginated(page = 1, limit = 10, params = {}) {
    return axios.get('/api/starWars/planets', { 
      params: { ...params, page, limit } 
    });
  },
  
  getPeoplePaginated(page = 1, limit = 10, params = {}) {
    return axios.get('/api/starWars/people', { 
      params: { ...params, page, limit } 
    });
  },
  // Optimized call for initial loading (gets both planets and people)
  getPlanetsWithPeople(params = {}) {
    return axios.get('/api/starWars/planets', { 
      params: { ...params, includePeople: 'true', replacePeopleNames: 'true' }
    });
  }
};
export default apiService;
