import { apiRequest } from '../../../api/apiClient';

export const ProfileAPI = {
  getCurrentUser: () => apiRequest('/api/auth/me'),

  updateProfile: (userId, payload) =>
    apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  uploadAvatar: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest(`/api/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    });
  },

  logout: () =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),
};