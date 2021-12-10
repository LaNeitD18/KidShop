import React, { createContext, useMemo, useState, useContext } from 'react';
import { getStoreList } from '../api/store';
import { fetchAllWarehouses } from '../api/warehouse';

const RolesContext = createContext();

export function RolesProvider(props) {
  const [roles, setRoles] = useState([]);
  const value = useMemo(() => [roles, setRoles], [roles]);
  return <RolesContext.Provider value={value} {...props} />;
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  const updateRoles = () => {
    getStoreList().then(({ data }) => {
      context[1]((prev) => ({ ...prev, stores: data.map((d) => d.id) }));
    });
    fetchAllWarehouses().then(({ data }) => {
      context[1]((prev) => ({ ...prev, warehouses: data.map((d) => d.id) }));
    });
  };
  return [context[0], updateRoles, context[1]];
}
