import API from '.';

// warehouse
export const fetchAllWarehouses = () => API.get('/warehouse');
export const fetchAWarehouse = (id) => API.get(`/warehouse/${id}`);
export const createWarehouse = (data) => API.post('/warehouse', data);
export const editWarehouse = (id, data) => API.patch(`/warehouse/${id}`, data);
export const deleteWarehouse = (id) => API.delete(`/warehouse/${id}`);

// import-product-receipt
export const fetchAllImportReceipts = (warehouseId) =>
  API.get(`/import-product-receipt/all/${warehouseId}`);
export const fetchImportReceipt = (id) =>
  API.get(`/import-product-receipt/${id}`);
export const createImportReceipt = (data) =>
  API.post('/import-product-receipt', data);
export const editImportReceipt = (id, data) =>
  API.patch(`/import-product-receipt/${id}`, data);
export const deleteImportReceipt = (id) =>
  API.delete(`/import-product-receipt/${id}`);

export const fetchExportReceipts = () => API.get('/export-product-receipt');
export const fetchExportReceipt = (id) =>
  API.get(`/export-product-receipt/${id}`);
export const createExportReceipt = (data) =>
  API.post('/export-product-receipt', data);
export const editExportReceipt = (id, data) =>
  API.patch(`/export-product-receipt/${id}`, data);
export const deleteExportReceipt = (id) =>
  API.delete(`/export-product-receipt/${id}`);
