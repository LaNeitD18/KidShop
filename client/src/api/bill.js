import API from '.';

export const createBill = (data) => API.post('/bill', data);
