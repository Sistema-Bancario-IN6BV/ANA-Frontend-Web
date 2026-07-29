import { httpClient } from './httpClient';

export const caregiversApi = {
  create: (payload) => httpClient.post('/caregivers/create', payload).then((r) => r.data),
  list: (params) => httpClient.get('/caregivers/get', { params }).then((r) => r.data),
  getById: (id) => httpClient.get(`/caregivers/${id}`).then((r) => r.data),
  update: (id, payload) => httpClient.put(`/caregivers/${id}`, payload).then((r) => r.data),
  activate: (id) => httpClient.put(`/caregivers/${id}/activate`).then((r) => r.data),
  deactivate: (id) => httpClient.put(`/caregivers/${id}/deactivate`).then((r) => r.data),
};
