import api from './api';

export const listeningService = {
  // Get all audio lessons
  getAllAudioLessons: async () => {
    const response = await api.get('/audio-lessons/');
    return response.data;
  },

  // Get a single audio lesson
  getAudioLesson: async (id) => {
    const response = await api.get(`/audio-lessons/${id}/`);
    return response.data;
  },

  // Get listening exercises for a lesson
  getListeningExercises: async (lessonId) => {
    const response = await api.get(`/listening-exercises/?lesson=${lessonId}`);
    return response.data;
  },

  // Get user's listening progress
  getUserProgress: async () => {
    const response = await api.get('/listening-progress/');
    return response.data;
  },

  // Update user's listening progress
  updateProgress: async (id, data) => {
    const response = await api.put(`/listening-progress/${id}/`, data);
    return response.data;
  },

  // Submit a listening exercise attempt
  submitAttempt: async (data) => {
    const response = await api.post('/listening-attempts/', data);
    return response.data;
  },

  // Get user's listening attempts
  getUserAttempts: async () => {
    const response = await api.get('/listening-attempts/');
    return response.data;
  },
}; 