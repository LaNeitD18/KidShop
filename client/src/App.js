import BranchPage from './pages/admin/branch/BranchPage';
import EditBranchPage from './pages/admin/branch/EditBranchPage';
import EditSupplierPage from './pages/supplier/EditSupplierPage';
import SupplierPage from './pages/supplier/SupplierPage';
import WarehousePage from './pages/warehouse/WarehousePage';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainContainer from './components/MainContainer';
import ErrorPage from './pages/ErrorPage';
import EditWarehousePage from './pages/warehouse/EditWarehousePage';
import CounterPage from './pages/store/counter/CounterPage';
import EditCounterPage from './pages/store/counter/EditCounterPage';

function App() {
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
              <Route path="edit/:id" element={<EditBranchPage mode="edit" />} />
              <Route path="add" element={<EditBranchPage mode="add" />} />
            </Route>
          </Route>
          <Route path="store">
            <Route index element={<Navigate to="counter" replace />} />
            <Route path="counter">
              <Route index element={<CounterPage />} />
              <Route
                path="edit/:id"
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
                path="edit/:id"
                element={<EditSupplierPage mode="edit" />}
              />
              <Route path="add" element={<EditSupplierPage />} />
            </Route>
          </Route>
          <Route path="storage">
            <Route index element={<Navigate to="warehouse" replace />} />
            <Route path="warehouse">
              <Route index element={<WarehousePage />} />
              <Route
                path="edit/:id"
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
