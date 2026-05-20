import client from './client';

export const getCatalogo  = (params) => client.get('/recetas', { params }).then(r => r.data);
export const getReceta    = (id)     => client.get(`/recetas/${id}`).then(r => r.data);
export const getPrecio    = (id, raciones) => client.get(`/recetas/${id}/precio`, { params: { raciones } }).then(r => r.data);
