import API from '.';

export const postStore = (data) => API.post('/store', data);
export const getStoreList = () => API.get('/store');
export const getStore = (id) => API.get(`/store/${id}`);
export const deleteStore = (id) => API.delete(`/store/${id}`);
export const editStore = (id, data) => API.patch(`/store/${id}`, data);
