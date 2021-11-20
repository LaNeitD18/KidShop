import React, { createContext, useMemo, useState, useContext } from 'react';

const RolesContext = createContext();

function RolesProvider(props) {
  const [roles, setRoles] = useState([]);
  const value = useMemo(() => [roles, setRoles], [roles]);
  return <RolesContext.Provider value={value} {...props} />;
}

function useRoles() {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}

export { RolesProvider, useRoles };
