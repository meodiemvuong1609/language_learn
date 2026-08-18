import api from './api';

function results(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results || [];
}

// Unwrap standard envelope { message, code, data, count? } -> data
function unwrap(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data) return data.data;
  return data;
}

export const learningService = {
  getDueVocabulary: async () => unwrap((await api.get('/user-vocabulary/due_for_review/')).data),
  reviewWord: async (vocabularyId, isCorrect) =>
    unwrap((await api.post('/user-vocabulary/review_word/', { vocabulary_id: vocabularyId, is_correct: isCorrect })).data),
  getAudioLessons: async () => results((await api.get('/audio-lessons/')).data),
  getAudioLesson: async (id) => unwrap((await api.get(`/audio-lessons/${id}/`)).data),
  submitListening: async (id, answer) =>
    unwrap((await api.post(`/listening-exercises/${id}/submit_answer/`, { answer })).data),
  getSpeakingLessons: async () => results((await api.get('/speaking-lessons/')).data),
  getSpeakingLesson: async (id) => unwrap((await api.get(`/speaking-lessons/${id}/`)).data),
  submitSpeaking: async (payload) =>
    unwrap((await api.post('/speaking-attempts/submit_self_score/', payload)).data),
  getSentences: async () => results((await api.get('/sentence-structures/')).data),
  getSentence: async (id) => unwrap((await api.get(`/sentence-structures/${id}/`)).data),
  submitSentence: async (id, answers) =>
    unwrap((await api.post(`/sentence-structures/${id}/submit_exercise/`, { answers })).data),
  getQuizzes: async () => results((await api.get('/quizzes/')).data),
  getQuiz: async (id) => unwrap((await api.get(`/quizzes/${id}/`)).data),
  submitQuiz: async (id, answers) =>
    unwrap((await api.post(`/quizzes/${id}/submit/`, { answers })).data),
  getReadingLessons: async () => results((await api.get('/reading-lessons/')).data),
  getReadingLesson: async (id) => unwrap((await api.get(`/reading-lessons/${id}/`)).data),
  submitReading: async (id, answers) =>
    unwrap((await api.post(`/reading-lessons/${id}/submit_comprehension/`, { answers })).data),
  getDashboard: async () => unwrap((await api.get('/progress/dashboard-stats/')).data),
  getMyDecks: async () => results((await api.get('/flashcard-decks/my_decks/')).data),
  getDueFlashcards: async () => {
    const data = unwrap((await api.get('/flashcard-progress/due_for_review/')).data);
    return Array.isArray(data) ? data : results(data);
  },
  reviewFlashcard: async (id, isCorrect) =>
    unwrap((await api.post(`/flashcard-progress/${id}/review/`, { is_correct: isCorrect })).data),
  bulkCreateProgress: async (deckId) =>
    unwrap((await api.post('/flashcard-progress/bulk_create_progress/', { deck_id: deckId })).data),
  getPreferences: async () => unwrap((await api.get('/preferences/me/')).data),
  updatePreferences: async (data) => unwrap((await api.patch('/preferences/me/', data)).data),
};
