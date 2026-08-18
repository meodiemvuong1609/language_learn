import api from './api';

export const progressService = {
  // Get user's overall progress
  getOverallProgress: async () => {
    const response = await api.get('/progress/');
    return response.data;
  },

  // Get progress for a specific content type
  getProgressByType: async (contentType, objectId) => {
    const response = await api.get(`/progress/?content_type=${contentType}&object_id=${objectId}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (progressId, data) => {
    const response = await api.put(`/progress/${progressId}/`, data);
    return response.data;
  },

  // Get user preferences
  getUserPreferences: async () => {
    const response = await api.get('/preferences/');
    return response.data;
  },

  // Update user preferences
  updateUserPreferences: async (preferencesId, data) => {
    const response = await api.put(`/preferences/${preferencesId}/`, data);
    return response.data;
  },
};
