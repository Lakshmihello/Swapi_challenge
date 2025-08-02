import React from 'react';
import { useParams } from 'react-router-dom';

import styles from './resident.scss';
import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import SubTitle from '../components/SubTitle';

const Resident = () => {
  const urlParams = useParams();
  const { getPerson, getPlanet } = useMst(store => ({
    getPerson: store.getPerson,
    getPlanet: store.getPlanet,
  }));

  const resident = getPerson(urlParams.residentId);
  const planet = resident ? getPlanet(resident.homeworld?.split('/').pop()) : {};

  if (!resident) {
    return <div>404</div>;
  }

  const displayKeys = Object.keys(resident).filter(key => (
    !(resident[key] instanceof Array)
    && !['homeworld', 'id', 'name', 'url', 'created', 'edited'].includes(key)
  ));

  return (
    <div className="resident">
      <PageTitle>{resident.name}</PageTitle>

      <SubTitle>Details</SubTitle>
      <div className="details">
        {displayKeys.map(key => (
          <div key={key} className="detailItem">
            <div className="detailName">{key}</div>
            <div className="detailValue">{resident[key]}</div>
          </div>
        ))}
        <div className="detailItem">
          <div className="detailName">homeworld</div>
          <div className="detailValue">{planet.name || 'unknown'}</div>
        </div>
      </div>
    </div>
  );
};

export default Resident;
