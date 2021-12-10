import API from '.';

export const postProduct = (data) => API.post('/product', data);
export const getProductList = () => API.get('/product');
export const getProduct = (id) => API.get(`/product/${id}`);
export const deleteProduct = (id) => API.delete(`/product/${id}`);
export const editProduct = (id, data) => API.patch(`/product/${id}`, data);
