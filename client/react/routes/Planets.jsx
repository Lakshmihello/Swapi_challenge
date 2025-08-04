import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import styles from './planets.scss';
import apiService from '../../services/api';
const Planets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [planets, setPlanets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { planets:storePlanets, getFilteredPlanets } = useMst(store => ({
    planets: store.planets,
    getFilteredPlanets: store.getFilteredPlanets,
  }));
const limit = 10;
useEffect(() => {
    fetchPaginatedPlanets();
  }, [page]);

    const fetchPaginatedPlanets = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPlanetsPaginated(page, limit);
      setPlanets(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching planets:', error);
    } finally {
      setLoading(false);
    }
  };

   // Filter planets based on search term
  const filteredPlanets =  planets.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <div>Loading planets...</div>;
  }
  return (
    <div className="planets">
      <PageTitle>Planets</PageTitle>

      <input
        type="text"
        className="filterBox"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Filter..."
      />

      <div className="list">
        {filteredPlanets.map(planet => (
          <Link
            className="listItem"
            key={planet.id}
            to={`/planets/${planet.id}`}
          >
            {planet.name}
          </Link>
        ))}
      </div>
      {filteredPlanets.length === 0 && !loading && (
        <div>No planets found</div>
      )}

      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span> Page {page} of {totalPages} </span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default observer(Planets);

