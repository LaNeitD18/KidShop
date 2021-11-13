import API from '.';

export const createCounter = (data) => API.post('/counter', data);
export const getCounterList = () => API.get('/counter');
export const getCounter = (id) => API.get(`/counter/${id}`);
export const deleteCounter = (id) => API.delete(`/counter/${id}`);
export const editCounter = (id, data) => API.patch(`/counter/${id}`, data);
