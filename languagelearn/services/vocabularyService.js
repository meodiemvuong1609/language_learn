import api from './api';

export const vocabularyService = {
  // Get all vocabularies
  getAllVocabularies: async () => {
    const response = await api.get('/vocabulary/');
    return response.data;
  },

  // Get a single vocabulary by ID
  getVocabulary: async (id) => {
    const response = await api.get(`/vocabulary/${id}/`);
    return response.data;
  },

  // Get user's vocabulary lists
  getUserLists: async () => {
    const response = await api.get('/vocabulary-lists/');
    return response.data;
  },

  // Create a new vocabulary list
  createList: async (listData) => {
    const response = await api.post('/vocabulary-lists/', listData);
    return response.data;
  },

  // Get a single vocabulary list
  getList: async (id) => {
    const response = await api.get(`/vocabulary-lists/${id}/`);
    return response.data;
  },

  // Update a vocabulary list
  updateList: async (id, listData) => {
    const response = await api.put(`/vocabulary-lists/${id}/`, listData);
    return response.data;
  },

  // Delete a vocabulary list
  deleteList: async (id) => {
    await api.delete(`/vocabulary-lists/${id}/`);
  },

  // Get user's vocabulary progress
  getUserVocabularies: async () => {
    const response = await api.get('/user-vocabulary/');
    return response.data;
  },

  // Update user's vocabulary progress
  updateUserVocabulary: async (id, data) => {
    const response = await api.put(`/user-vocabulary/${id}/`, data);
    return response.data;
  },

  // Get vocabularies by topic
  getByTopic: async (topicId) => {
    const response = await api.get(`/vocabulary/by_topic/?topic_id=${topicId}`);
    return response.data;
  },

  // Get vocabularies by level
  getByLevel: async (levelId) => {
    const response = await api.get(`/vocabulary/by_level/?level_id=${levelId}`);
    return response.data;
  },

  // Get related words (synonyms/antonyms)
  getRelatedWords: async (vocabularyId) => {
    const response = await api.get(`/vocabulary/${vocabularyId}/related_words/`);
    return response.data;
  },
}; 