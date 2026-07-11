import { apiRequest } from '../../../api/apiClient';

export function registerUser({ fullname, username, email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, username, email, password }),
  });
}

export function loginUser({ email, password, rememberMe }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember_me: !!rememberMe }),
  });
}

export function logoutUser() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me', {
    method: 'GET',
  });
}

export async function googleLogin(credential) {
  return apiRequest('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
}

export function forgotPassword(email) {
  return apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export function resetPassword({ token, newPassword }) {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}