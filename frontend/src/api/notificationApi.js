import { apiRequest } from './apiClient';

export const NotificationAPI = {
  getCurrentUser: () => apiRequest('/api/auth/me'),

  getForUser: (userId, skip = 0, limit = 100) =>
    apiRequest(`/api/notifications/user/${userId}?skip=${skip}&limit=${limit}`),

  markAsRead: (id) =>
    apiRequest(`/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true }),
    }),

  delete: (id) =>
    apiRequest(`/api/notifications/${id}`, { method: 'DELETE' }),
};