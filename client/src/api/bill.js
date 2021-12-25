import API from '.';

export const createBill = (data) => API.post('/bill', data);
export const getBills = (storeId) => API.get(`/bill/all/${storeId}`);
export const getBill = (id) => API.get(`/bill/${id}`);
