import React, { useContext } from 'react';

const MSTContext = React.createContext(null);

export const Provider = MSTContext.Provider;

export function useMst(mapStateToProps) {
  const store = useContext(MSTContext);

  if (typeof mapStateToProps !== 'undefined') {
    return mapStateToProps(store);
  }

  return store;
}
