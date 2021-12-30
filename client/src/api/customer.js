import API from '.';

export const fetchCustomers = () => API.get('/customer');
export const createCustomer = (data) => API.post('/customer', data);
export const fetchCustomer = (id) => API.get(`/customer/${id}`);
export const editCustomer = (id, data) => API.patch(`/customer/${id}`, data);

// export const deleteCounter = (id) => API.delete(`/counter/${id}`);
