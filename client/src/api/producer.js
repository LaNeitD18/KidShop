import API from '.';

export const createProducer = (data) => API.post('/producer', data);
export const fetchProducers = () => API.get('/producer');
export const fetchAProducer = (id) => API.get(`/producer/${id}`);
export const deleteProducer = (id) => API.delete(`/producer/${id}`);
export const editProducer = (id, data) => API.patch(`/producer/${id}`, data);
