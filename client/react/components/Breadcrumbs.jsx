import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useMst } from '../../stores/StoreProvider';
import styles from './breadcrumbs.scss';

const Breadcrumb = ({
  name,
  to
}) => (
  to
    ? <Link className="breadcrumb" to={to}>{name}</Link>
    : <div className="breadcrumb">{name}</div>
);

const Breadcrumbs = () => {
  const storeValues = useMst(store => ({
    planets: store.planets,
    people: store.people,
    getPerson: store.getPerson,
    getPlanet: store.getPlanet,
  }));
  const location = useLocation();
  const paths = determinePaths(storeValues, location.pathname);

  if (!paths.length) return null;

  const crumbs = paths.map(({ name, to }) => (
    <Breadcrumb key={name} name={name} to={to} />
  )).reduce((prev, curr) => ([
    prev,
    <div key={`${name}-separator`} className="separator">&#x3e;</div>,
    curr
  ]));

  return (
    <div className="breadcrumbs">
      {crumbs}
    </div>
  );
};

function determinePaths({ planets, people, getPerson, getPlanet }, path) {
  const paths = path.substr(1).split('/'); // remove first /, then split path
  const output = [];
  for (let i = 0; i < paths.length; i += 2) {
    const route = paths[i];
    const id = paths[i + 1];
    const isLast = i + 2 >= paths.length;
    const isFirst = i === 0;

    let name;
    let to = isFirst && id
      ? `/${paths.slice(0, 2).join('/')}`
      : `/${paths.slice(0, i).join('/')}`;

    if (!id) {
      name = capitalizeFirstLetter(route);
    } else {
      // not a great way to do this unless you have a map somewhere, or name the pathing the same as the store
      // which isn't a great idea for any type of future refactoring
      switch (route) {
        case 'planets':
          name = getPlanet(id)?.name;
          break;
        case 'people':
        case 'residents':
          name = getPerson(id)?.name;
          break;
      }
    }

    if (name) {
      // we have a static first page, so add before any child pages. If we had
      // every list as a sub-page, we wouldn't need this or the extra `to` logic
      if ((isFirst && !isLast) || (isFirst && isLast && id)) {
        output.push({ name: capitalizeFirstLetter(paths[0]), to: `/${paths[0]}` })
      }
      if (!isLast) {
        output.push({ name, to });
      } else {
        output.push({ name });
      }
    }
  }
  return output;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Breadcrumbs;
