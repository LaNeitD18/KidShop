import API from '.';

export const fetchAllSuppliers = () => API.get('/supplier');
export const createSupplier = (newSupplier) =>
  API.post('/supplier', newSupplier);
export const editSupplier = (id, data) => API.patch(`/supplier/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/supplier/${id}`);
