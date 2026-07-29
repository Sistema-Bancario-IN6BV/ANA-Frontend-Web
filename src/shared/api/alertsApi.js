import { httpClient } from './httpClient';

export const alertsApi = {
  create: (payload) => httpClient.post('/alerts/create', payload).then((r) => r.data),
  list: (params) => httpClient.get('/alerts/get', { params }).then((r) => r.data),
  getById: (id) => httpClient.get(`/alerts/${id}`).then((r) => r.data),
  markAsRead: (id, readBy) => httpClient.put(`/alerts/${id}/read`, { readBy }).then((r) => r.data),
  activate: (id) => httpClient.put(`/alerts/${id}/activate`).then((r) => r.data),
  deactivate: (id) => httpClient.put(`/alerts/${id}/deactivate`).then((r) => r.data),
};
