import React, { createContext, useMemo, useState, useContext } from 'react';
import { getStoreList } from '../api/store';
import { getUser } from '../api/user';
import { fetchAllWarehouses } from '../api/warehouse';
import useLocalStorage from '../hooks/useLocalStorage';

const RolesContext = createContext();

export function RolesProvider(props) {
  const [roles, setRoles] = useState([]);
  const value = useMemo(() => [roles, setRoles], [roles]);
  return <RolesContext.Provider value={value} {...props} />;
}

export function useRoles() {
  const [roles, setRoles] = useContext(RolesContext);
  const [user] = useLocalStorage('user');
  const updateRoles = () => {
    const userId = user?.id;
    if (userId) {
      getUser(userId).then(({ data }) => {
        const roleObj = {};
        const quyen = data?.quyen || '[]';
        const roleArr = JSON.parse(quyen)?.filter((e) => e);
        roleArr?.forEach((r) => {
          roleObj[r] = true;
        });
        setRoles((prev) => ({ ...prev, ...roleObj, bh: data.cuaHang?.id }));
      });
    }
    getStoreList().then(({ data }) => {
      const storesArray = data
        .filter((d) => d.chuCuaHang.id === userId)
        .map((d) => d.id);
      setRoles((prev) => ({
        ...prev,
        stores: storesArray.length ? storesArray : null,
      }));
    });
    fetchAllWarehouses().then(({ data }) => {
      const warehousesArray = data
        .filter((d) => d.quanLyKho.id === userId)
        .map((d) => d.id);
      setRoles((prev) => ({
        ...prev,
        warehouses: warehousesArray.length ? warehousesArray : null,
      }));
    });
  };

  return [roles, updateRoles, setRoles];
}
