import client from './client';

export const getFavoritos   = ()   => client.get('/favoritos').then(r => r.data);
export const toggleFavorito = (id) => client.post(`/favoritos/${id}`).then(r => r.data);
