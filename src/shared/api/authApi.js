import { httpClient } from './httpClient';

export const authApi = {
  login: (emailOrUsername, password) =>
    httpClient.post('/auth/login', { emailOrUsername, password }).then((r) => r.data),

  register: (payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, value);
    });
    return httpClient
      .post('/auth/register', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  getProfile: () => httpClient.get('/auth/profile').then((r) => r.data),

  verifyEmail: (token) => httpClient.post('/auth/verify-email', { token }).then((r) => r.data),

  resendVerification: (email) =>
    httpClient.post('/auth/resend-verification', { email }).then((r) => r.data),

  forgotPassword: (email) => httpClient.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token, newPassword) =>
    httpClient.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),

  getElderly: () => httpClient.get('/auth/elderly').then((r) => r.data),
};
