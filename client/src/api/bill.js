import API from '.';

export const createBill = (data) => API.post('/bill', data);
export const getBills = (storeId) => API.get(`/bill/all/${storeId}`);
