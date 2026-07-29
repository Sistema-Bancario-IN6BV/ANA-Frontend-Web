import { httpClient } from './httpClient';

export const usersApi = {
  updateUserRole: (userId, roleName) =>
    httpClient.put(`/users/${userId}/role`, { roleName }).then((r) => r.data),

  getUserRoles: (userId) => httpClient.get(`/users/${userId}/roles`).then((r) => r.data),

  getUsersByRole: (roleName) => httpClient.get(`/users/by-role/${roleName}`).then((r) => r.data),

  getCaregiversOfElderly: (elderlyId) =>
    httpClient.get(`/users/elderly/${elderlyId}/caregivers`).then((r) => r.data),
};
