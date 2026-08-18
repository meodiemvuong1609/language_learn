import api from './api';

export const sentenceService = {
  // Get all sentence structures
  getAllSentences: async () => {
    const response = await api.get('/sentence-structures/');
    return response.data;
  },

  // Get a single sentence structure by ID
  getSentence: async (id) => {
    const response = await api.get(`/sentence-structures/${id}/`);
    return response.data;
  },

  // Search sentences
  searchSentences: async (query) => {
    const response = await api.get(`/sentence-structures/?search=${encodeURIComponent(query)}`);
    return response.data;
  },
};
