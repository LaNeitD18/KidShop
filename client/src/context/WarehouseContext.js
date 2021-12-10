import { createContext, useState } from 'react';

const WarehouseContext = createContext({
  listWarehouses: [],
  setListWarehouses: () => {},
});

const WarehouseProvider = (props) => {
  const [listWarehouses, setListWarehouses] = useState([]);

  return (
    <WarehouseContext.Provider value={[listWarehouses, setListWarehouses]}>
      {props.children}
    </WarehouseContext.Provider>
  );
};

export { WarehouseContext, WarehouseProvider };
