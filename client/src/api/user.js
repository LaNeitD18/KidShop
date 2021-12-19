import API from '.';

export const getUserList = () => API.get('/user');
export const getUserByUsername = (username) =>
  API.get(`/user/username/${username}`);
export const deleteUser = (username) => API.delete(`/user/${username}`);
export const createUser = (data) => API.post('/user', data);
export const getUser = (id) => API.get(`/user/${id}`);
export const editUser = (id, data) => API.patch(`/user/${id}`, data);
