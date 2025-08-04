import React from 'react';
import { useParams } from 'react-router-dom';

import styles from './resident.scss';
import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import SubTitle from '../components/SubTitle';

const Resident = () => {
  const { residentId } = useParams();
  const { getPerson, getPlanet } = useMst(store => ({
    getPerson: store.getPerson,
    getPlanet: store.getPlanet,
  }));

  // Handle different ID formats - could be just ID or URL path
  let cleanedId = residentId;
  if (residentId && residentId.includes('/')) {
    cleanedId = residentId.split('/').filter(Boolean).pop();
  }
 const resident = getPerson(parseInt(cleanedId));

  if (!resident) {
    return <div>404 - Resident not found
      <PageTitle>Person Not Found</PageTitle>
        <div>404 - Person with ID {cleanedId} not found</div>
    </div>;
  }

  let planetName = 'unknown';
  if (resident.homeworld) {
     // Extract planet ID from homeworld URL
    // const planetId = resident.homeworld.split('/').pop();
     const planetId = resident.homeworld.split('/').filter(Boolean).pop();
    const planet = getPlanet(parseInt(planetId));
    if (planet) {
      planetName = planet.name;
    }
  }
 // Filter out unwanted fields for display
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
            <div className="detailName">{key.replace(/_/g, ' ')}</div>
            <div className="detailValue">{resident[key]}</div>
          </div>
        ))}
        <div className="detailItem">
          <div className="detailName">homeworld</div>
          <div className="detailValue">{planetName}</div>
        </div>
      </div>
    </div>
  );
};


export default Resident;


