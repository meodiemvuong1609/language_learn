import api from './api';

// Unwrap standard envelope { message, code, data, count? } -> data
function unwrap(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data) return data.data;
  return data;
}

export const vocabularyService = {
  // Get all vocabularies
  getAllVocabularies: async () => unwrap((await api.get('/vocabulary/')).data),

  // Get a single vocabulary by ID
  getVocabulary: async (id) => unwrap((await api.get(`/vocabulary/${id}/`)).data),

  // Get user's vocabulary lists
  getUserLists: async () => unwrap((await api.get('/vocabulary-lists/')).data),

  // Create a new vocabulary list
  createList: async (listData) => unwrap((await api.post('/vocabulary-lists/', listData)).data),

  // Get a single vocabulary list
  getList: async (id) => unwrap((await api.get(`/vocabulary-lists/${id}/`)).data),

  // Update a vocabulary list
  updateList: async (id, listData) => unwrap((await api.put(`/vocabulary-lists/${id}/`, listData)).data),

  // Delete a vocabulary list
  deleteList: async (id) => {
    await api.delete(`/vocabulary-lists/${id}/`);
  },

  // Get user's vocabulary progress
  getUserVocabularies: async () => unwrap((await api.get('/user-vocabulary/')).data),

  // Update user's vocabulary progress
  updateUserVocabulary: async (id, data) => unwrap((await api.put(`/user-vocabulary/${id}/`, data)).data),

  // Get vocabularies by topic
  getByTopic: async (topicId) => unwrap((await api.get(`/vocabulary/by_topic/?topic_id=${topicId}`)).data),

  // Get vocabularies by level
  getByLevel: async (levelId) => unwrap((await api.get(`/vocabulary/by_level/?level_id=${levelId}`)).data),

  // Get related words (synonyms/antonyms)
  getRelatedWords: async (vocabularyId) => unwrap((await api.get(`/vocabulary/${vocabularyId}/related_words/`)).data),
};
