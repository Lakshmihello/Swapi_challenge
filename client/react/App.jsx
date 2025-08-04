import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import styles from './App.scss';
import { useMst } from '../stores/StoreProvider';
import Planet from './routes/Planet';
import Planets from './routes/Planets';
import Resident from './routes/Resident';
import People from './routes/People';
import Breadcrumbs from './components/Breadcrumbs';
import CustomCursor from './components/CustomCursor';
import TopNav from './components/TopNav';

const App = () => {
  const { loading } = useMst(store => ({
    loading: store.loadingPlanets || store.loadingPeople,
  }));

  if (loading) {
    return (
      <div>
        Loading...
        <br />
        This may take a bit if loading for the first time...
      </div>
    );
  }

  return (
    <div className="app">
      <CustomCursor />
      <TopNav />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Navigate to="/planets" replace />} />
        <Route path="/people" element={<People />} />
        <Route path="/people/:residentId" element={<Resident />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/planets/:planetId" element={<Planet />} />
        <Route path="/planets/:planetId/residents/:residentId" element={<Resident />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
};

export default observer(App);
