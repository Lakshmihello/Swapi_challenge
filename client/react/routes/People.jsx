import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../stores/StoreProvider';
import PageTitle from '../components/PageTitle';
import styles from './people.scss';
import apiService from '../../services/api';
const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [people, setPeople] = useState([]);
  const [total, setTotal] = useState(0);
const [loading,setLoading]=useState(false);
 
const {people:storePeople,getFilteredPeople}=useMst(store=>({
  people:store.people,
  getFilteredPeople:store.getFilteredPeople,
}))
const limit=10;

 useEffect(() => {
   fetchPaginatedPeople();
  }, [page]);

  //fetching paginated data with data,limit and total
    const fetchPaginatedPeople = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPeoplePaginated(page, limit);
      setPeople(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching people:', error);
      setPeople([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter people based on search term - with null safety
    const filteredPeople = (people||[]).filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 10);
 if (loading) {
    return <div>Loading people...</div>;
  }
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
   {filteredPeople.length > 0 ? (
          filteredPeople.map(person => (
            <Link
              className="listItem"
              key={person.id}
              to={`/people/${person.id}`}
            >
              {person.name}
            </Link>
          ))
        ) : (
          <div>No people found</div>
        )}
      </div>

      {total > 0 && (
        <div className="pagination">
          <button 
            disabled={page === 1 || loading} 
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span> Page {page} of {totalPages} </span>
          <button 
            disabled={page === totalPages || loading} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default observer(People);
