import { createContext, useState } from 'react';

const SupplierContext = createContext({
  listSuppliers: [],
  setListSuppliers: () => {},
});

const SupplierProvider = (props) => {
  const [listSuppliers, setListSuppliers] = useState([]);

  return (
    <SupplierContext.Provider value={[listSuppliers, setListSuppliers]}>
      {props.children}
    </SupplierContext.Provider>
  );
};

export { SupplierContext, SupplierProvider };
