import api from './api';
import { tokenService } from './tokenService';

export function apiErrorMessage(error, fallback = 'Request failed') {
  return (
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message ||
    fallback
  );
}

function unwrap(data) {
  if (data && typeof data.code === 'number') {
    if (data.code === 200) return data.data;
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    const token = unwrap(response.data);
    if (token) {
      await tokenService.setToken(token);
    }
    return token;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch {
      // still clear local token
    }
    await tokenService.removeToken();
  },

  isAuthenticated: async () => {
    return await tokenService.hasToken();
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return unwrap(response.data);
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return unwrap(response.data);
  },
};
 