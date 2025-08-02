import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './topNav.scss';

const TopNav = () => (
  <div className="nav">
    <NavLink to="/planets">Planets</NavLink>
    <NavLink to="/people">People</NavLink>
  </div>
);

export default TopNav;
