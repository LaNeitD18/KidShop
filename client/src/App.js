import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useRoles } from "./context/RolesContext";

import ErrorPage from "./pages/ErrorPage";
import BranchPage from "./pages/admin/branch/BranchPage";
import EditBranchPage from "./pages/admin/branch/EditBranchPage";
import EditSupplierPage from "./pages/supplier/EditSupplierPage";
import SupplierPage from "./pages/supplier/SupplierPage";
import WarehousePage from "./pages/warehouse/WarehousePage";
import MainContainer from "./components/MainContainer";
import EditWarehousePage from "./pages/warehouse/EditWarehousePage";
import ProducerPage from "./pages/producer/ProducerPage";
import EditProducerPage from "./pages/producer/EditProducerPage";
import CounterPage from "./pages/store/counter/CounterPage";
import EditCounterPage from "./pages/store/counter/EditCounterPage";
import { LoginPage } from "./pages/LoginPage";
import ProductPage from "./pages/business/product/ProductPage";
import EditProductPage from "./pages/business/product/EditProductPage";
import ImportProductPage from "./pages/warehouse/import/ImportProductPage";
import ExportProductPage from "./pages/warehouse/export/ExportProductPage";
import EditImportReceiptPage from "./pages/warehouse/import/EditImportProductReceipt";
import SalePage from "./pages/counter/SalePage";
import StoreImportPage from "./pages/store/import/StoreImportPage";
import EmployeePage from "./pages/admin/employee/EmployeePage";
import EditEmployeePage from "./pages/admin/employee/EditEmployeePage";
import StaffPage from "./pages/store/staff/StaffPage";
import EditExportReceiptPage from "./pages/warehouse/export/EditExportProductReceipt";
import EditStoreImportPage from "./pages/store/import/EditStoreImportPage";
import StoreDashboard from "./pages/store/dashboard/StoreDashboard";

function App() {
  const [roles, updateRoles] = useRoles();
  useEffect(() => {
    updateRoles();
  }, []);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="app" replace />} />
        <Route path="app" element={<MainContainer />}>
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="admin">
            <Route index element={<Navigate to="employee" replace />} />
            <Route path="employee">
              <Route index element={<EmployeePage />} />
              <Route
                path="edit/:employeeId"
                element={<EditEmployeePage mode="edit" />}
              />
              <Route path="add" element={<EditEmployeePage mode="add" />} />
            </Route>
            <Route path="branch">
              <Route index element={<BranchPage />} />
              <Route
                path="edit/:branchId"
                element={<EditBranchPage mode="edit" />}
              />
              <Route path="add" element={<EditBranchPage mode="add" />} />
            </Route>
          </Route>
          <Route path="business">
            <Route index element={<Navigate to="product" replace />} />
            <Route path="product">
              <Route index element={<ProductPage />} />
              <Route
                path="edit/:productId"
                element={<EditProductPage mode="edit" />}
              />
              <Route path="add" element={<EditProductPage mode="add" />} />
            </Route>
          </Route>
          <Route
            path="store"
            element={
              <Navigate
                to={roles?.stores ? roles?.stores[0]?.toString() : "/error/403"}
                replace
              />
            }
          />
          <Route path="store/:storeId">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StoreDashboard />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="counter">
              <Route index element={<CounterPage />} />
              <Route
                path="edit/:counterId"
                element={<EditCounterPage mode="edit" />}
              />
              <Route path="add" element={<EditCounterPage mode="add" />} />
            </Route>
            <Route path="import">
              <Route index element={<StoreImportPage />} />
              <Route
                path="edit/:exportReceiptId"
                element={<EditStoreImportPage mode="edit" />}
              />
              <Route path="add" element={<EditStoreImportPage mode="add" />} />
            </Route>
          </Route>
          <Route
            path="counter"
            element={<SalePage />}
            disableMenu
            disableBreadcrumb
          />
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
            <Route index element={<Navigate to="warehouses" replace />} />

            <Route path="warehouses">
              <Route index element={<WarehousePage />} />
              <Route
                path="edit/:warehouseId"
                element={<EditWarehousePage mode="edit" />}
              />
              <Route path="add" element={<EditWarehousePage />} />
            </Route>
          </Route>
          <Route
            path="warehouse"
            element={
              <Navigate
                to={
                  roles?.warehouses
                    ? roles?.warehouses[0]?.toString()
                    : "/error/403"
                }
                replace
              />
            }
          />
          <Route path="warehouse/:warehouseId">
            <Route index element={<Navigate to="import-product" replace />} />
            <Route path="import-product">
              <Route index element={<ImportProductPage />} />
              <Route
                path="edit/:importReceiptId"
                element={<EditImportReceiptPage mode="edit" />}
              />
              <Route path="add" element={<EditImportReceiptPage />} />
            </Route>
            <Route path="export-product">
              <Route index element={<ExportProductPage />} />
              <Route
                path="edit/:exportReceiptId"
                element={<EditExportReceiptPage mode="edit" />}
              />
              <Route path="add" element={<EditExportReceiptPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
