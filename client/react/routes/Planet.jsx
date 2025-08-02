import React from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './planet.scss';
import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import SubTitle from '../components/SubTitle';

const Planet = () => {
  const urlParams = useParams();
  const { getPlanet } = useMst(store => ({
    getPlanet: store.getPlanet,
  }));

  const planet = getPlanet(urlParams.planetId);

  if (!planet) {
    return <div>404</div>;
  }

  const displayKeys = Object.keys(planet).filter(key => (
    !(planet[key] instanceof Array)
    && !['id', 'name', 'url', 'created', 'edited'].includes(key)
  ));

  return (
    <div className="planet">
      <PageTitle>{planet.name}</PageTitle>

      <SubTitle>Details</SubTitle>
      <div className="details">
        {displayKeys.map(key => (
          <div key={key} className="detailItem">
            <div className="detailName">{key}</div>
            <div className="detailValue">{planet[key]}</div>
          </div>
        ))}
      </div>

      <SubTitle>Residents</SubTitle>
      <div className="list">
        {planet.residents.map(resident => (
          !resident
            ? null
            : (
              <Link
                className="listItem"
                key={resident.id}
                to={`/planets/${urlParams.planetId}/residents/${resident.id}`}
              >
                {resident.name}
              </Link>
            )
        ))}
      </div>
    </div>
  );
};

export default Planet;
