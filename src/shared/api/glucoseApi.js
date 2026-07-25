import { httpClient } from './httpClient';

export const glucoseApi = {
  create: (payload) => httpClient.post('/glucose/create', payload).then((r) => r.data),
  list: (params) => httpClient.get('/glucose/get', { params }).then((r) => r.data),
  getById: (id) => httpClient.get(`/glucose/${id}`).then((r) => r.data),
  activate: (id) => httpClient.put(`/glucose/${id}/activate`).then((r) => r.data),
  deactivate: (id) => httpClient.put(`/glucose/${id}/deactivate`).then((r) => r.data),
};
