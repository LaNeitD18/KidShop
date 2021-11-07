import API from '.';

export const fetchAllWarehouses = () => API.get('/warehouse');
export const createWarehouse = (data) => API.post('/warehouse', data);
export const editWarehouse = (id, data) => API.patch(`/warehouse/${id}`, data);
export const deleteWarehouse = (id) => API.delete(`/warehouse/${id}`);
