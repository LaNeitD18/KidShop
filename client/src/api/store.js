import API from '.';

export const postStore = (data) => API.post('/store', data);
export const getStoreList = () => API.get('/store');
export const getStore = (id) => API.get(`/store/${id}`);
