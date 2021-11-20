import API from '.';

export const login = (data) => API.post('auth/login', data);
export const verifyToken = (token) => API.get(`auth/verify/${token}`);
