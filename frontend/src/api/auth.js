import client from './client';

export const register    = (data)  => client.post('/auth/register', data).then(r => r.data);
export const login       = (data)  => client.post('/auth/login', data).then(r => r.data);
export const logout      = ()      => client.post('/auth/logout').then(r => r.data);
export const getMe       = ()      => client.get('/auth/me').then(r => r.data);
export const setPrefs    = (prefs) => client.put('/auth/preferencias', { preferencias: prefs }).then(r => r.data);
export const updateProfile = (data) => client.put('/auth/perfil', data).then(r => r.data);
export const changePassword = (data) => client.put('/auth/password', data).then(r => r.data);
export const getProfileStats = () => client.get('/auth/perfil/stats').then(r => r.data);
