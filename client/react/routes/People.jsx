import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import styles from './people.scss';

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { people, getFilteredPeople } = useMst(store => ({
    people: store.people,
    getFilteredPeople: store.getFilteredPeople,
  }));

  const filteredPeople = getFilteredPeople(searchTerm);

  return (
    <div className="people">
      <PageTitle>People</PageTitle>

      <input
        type="text"
        className="filterBox"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Filter..."
      />

      <div className="list">
        {filteredPeople.map(person => (
          <Link
            className="listItem"
            key={person.id}
            to={`/person/${person.id}`}
          >
            {person.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default observer(People);
