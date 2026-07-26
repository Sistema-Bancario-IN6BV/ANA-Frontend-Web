import { httpClient } from './httpClient';

export const bloodPressureApi = {
  create: (payload) => httpClient.post('/bloodPressure/create', payload).then((r) => r.data),
  list: (params) => httpClient.get('/bloodPressure/get', { params }).then((r) => r.data),
  getById: (id) => httpClient.get(`/bloodPressure/${id}`).then((r) => r.data),
  activate: (id) => httpClient.put(`/bloodPressure/${id}/activate`).then((r) => r.data),
  deactivate: (id) => httpClient.put(`/bloodPressure/${id}/deactivate`).then((r) => r.data),
};
