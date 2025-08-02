import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import styles from './planets.scss';

const Planets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { planets, getFilteredPlanets } = useMst(store => ({
    planets: store.planets,
    getFilteredPlanets: store.getFilteredPlanets,
  }));

  const filteredPlanets = getFilteredPlanets(searchTerm);

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
    </div>
  );
};

export default observer(Planets);
