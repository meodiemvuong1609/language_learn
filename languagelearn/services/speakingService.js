import api from './api';

export const speakingService = {
  // Get all speaking lessons
  getAllSpeakingLessons: async () => {
    const response = await api.get('/speaking-lessons/');
    return response.data;
  },

  // Get a single speaking lesson
  getSpeakingLesson: async (id) => {
    const response = await api.get(`/speaking-lessons/${id}/`);
    return response.data;
  },

  // Get speaking exercises for a lesson
  getSpeakingExercises: async (lessonId) => {
    const response = await api.get(`/speaking-exercises/?lesson=${lessonId}`);
    return response.data;
  },

  // Get pronunciation patterns
  getPronunciationPatterns: async () => {
    const response = await api.get('/pronunciation-patterns/');
    return response.data;
  },

  // Get user's speaking progress
  getUserProgress: async () => {
    const response = await api.get('/speaking-progress/');
    return response.data;
  },

  // Update user's speaking progress
  updateProgress: async (id, data) => {
    const response = await api.put(`/speaking-progress/${id}/`, data);
    return response.data;
  },

  // Submit a speaking attempt
  submitAttempt: async (data) => {
    const response = await api.post('/speaking-attempts/', data);
    return response.data;
  },

  // Get user's speaking attempts
  getUserAttempts: async () => {
    const response = await api.get('/speaking-attempts/');
    return response.data;
  },
}; 