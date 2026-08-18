import api from './api';

export const testService = {
  // Get all tests
  getAllTests: async () => {
    const response = await api.get('/tests/');
    return response.data;
  },

  // Get a single test by ID
  getTest: async (id) => {
    const response = await api.get(`/tests/${id}/`);
    return response.data;
  },

  // Submit test answers
  submitTest: async (testId, answers) => {
    const response = await api.post(`/tests/${testId}/submit/`, { answers });
    return response.data;
  },

  // Get test history
  getTestHistory: async () => {
    const response = await api.get('/test-attempts/');
    return response.data;
  },
};
