import { httpClient } from './httpClient';

export const medicationsApi = {
  create: (payload) => httpClient.post('/medications/create', payload).then((r) => r.data),
  list: (params) => httpClient.get('/medications/get', { params }).then((r) => r.data),
  getById: (id) => httpClient.get(`/medications/${id}`).then((r) => r.data),
  update: (id, payload) => httpClient.put(`/medications/${id}`, payload).then((r) => r.data),
  activate: (id) => httpClient.put(`/medications/${id}/activate`).then((r) => r.data),
  deactivate: (id) => httpClient.put(`/medications/${id}/deactivate`).then((r) => r.data),
  take: (id) => httpClient.post(`/medications/${id}/take`).then((r) => r.data),
  getLogs: (id, limit = 20, skip = 0) =>
    httpClient.get(`/medications/${id}/logs`, { params: { limit, skip } }).then((r) => r.data),
};
