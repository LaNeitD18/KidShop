import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFeature } from './context/FeatureContext';
import { getStoreList } from './api/store';

import ErrorPage from './pages/ErrorPage';
import BranchPage from './pages/admin/branch/BranchPage';
import EditBranchPage from './pages/admin/branch/EditBranchPage';
import EditSupplierPage from './pages/supplier/EditSupplierPage';
import SupplierPage from './pages/supplier/SupplierPage';
import WarehousePage from './pages/warehouse/WarehousePage';
import MainContainer from './components/MainContainer';
import EditWarehousePage from './pages/warehouse/EditWarehousePage';
import ProducerPage from './pages/producer/ProducerPage';
import EditProducerPage from './pages/producer/EditProducerPage';
import CounterPage from './pages/store/counter/CounterPage';
import EditCounterPage from './pages/store/counter/EditCounterPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const [feature, setFeature] = useFeature();
  useEffect(() => {
    getStoreList().then(({ data }) => {
      setFeature((prev) => ({ ...prev, stores: data.map((d) => d.id) }));
    });
  }, []);

  return <LoginPage />;

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="app" replace />} />
        <Route path="app" element={<MainContainer />}>
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="admin">
            <Route index element={<Navigate to="branch" replace />} />
            <Route path="branch">
              <Route index element={<BranchPage />} />
              <Route
                path="edit/:branchId"
                element={<EditBranchPage mode="edit" />}
              />
              <Route path="add" element={<EditBranchPage mode="add" />} />
            </Route>
          </Route>
          <Route
            path="store"
            element={
              <Navigate
                to={
                  feature.stores ? feature.stores[0].toString() : '/error/403'
                }
                replace
              />
            }
          />
          <Route path="store/:storeId">
            <Route index element={<Navigate to="counter" replace />} />
            <Route path="counter">
              <Route index element={<CounterPage />} />
              <Route
                path="edit/:counterId"
                element={<EditCounterPage mode="edit" />}
              />
              <Route path="add" element={<EditCounterPage mode="add" />} />
            </Route>
          </Route>
          <Route path="supply">
            <Route index element={<Navigate to="supplier" replace />} />
            <Route path="supplier">
              <Route index element={<SupplierPage />} />
              <Route
                path="edit/:supplierId"
                element={<EditSupplierPage mode="edit" />}
              />
              <Route path="add" element={<EditSupplierPage />} />
            </Route>
            <Route path="producer">
              <Route index element={<ProducerPage />} />
              <Route
                path="edit/:producerId"
                element={<EditProducerPage mode="edit" />}
              />
              <Route path="add" element={<EditProducerPage />} />
            </Route>
          </Route>
          <Route path="storage">
            <Route index element={<Navigate to="warehouse" replace />} />
            <Route path="warehouse">
              <Route index element={<WarehousePage />} />
              <Route
                path="edit/:warehouseId"
                element={<EditWarehousePage mode="edit" />}
              />
              <Route path="add" element={<EditWarehousePage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
