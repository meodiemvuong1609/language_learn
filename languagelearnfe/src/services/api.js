import { axiosInstance } from '@/store/axios';

const API_BASE = '';

// Unwrap backend {code, data, message} envelope. DRF CRUD/list payloads
// (including {count, results}) have no numeric code and pass through.
function unwrap(data) {
  if (data && typeof data.code === 'number') {
    if (data.code >= 200 && data.code < 300) return data.data;
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  // ── Common ──────────────────────────────────────────
  getLevels: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/levels/`, { params });
    return res.data;
  },
  getTopics: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/topics/`, { params });
    return res.data;
  },

  // ── Auth ────────────────────────────────────────────
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login/', credentials);
    return unwrap(res.data);
  },
  getMe: async () => {
    const res = await axiosInstance.get('/auth/me/');
    return unwrap(res.data);
  },

  // ── Dashboard ───────────────────────────────────────
  getDashboardStats: async () => {
    const res = await axiosInstance.get(`${API_BASE}/progress/dashboard-stats/`);
    return unwrap(res.data);
  },
  getProgress: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/progress/`, { params });
    return res.data;
  },
  getPreferences: async () => {
    const res = await axiosInstance.get(`${API_BASE}/preferences/me/`);
    return unwrap(res.data);
  },
  updatePreferences: async (data) => {
    const res = await axiosInstance.patch(`${API_BASE}/preferences/me/`, data);
    return unwrap(res.data);
  },

  // ── Vocabulary ──────────────────────────────────────
  getVocabularies: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/vocabulary/`, { params });
    return res.data;
  },
  getVocabulary: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/vocabulary/${id}/`);
    return res.data;
  },
  getUserVocabulary: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/user-vocabulary/`, { params: { ...params } });
    return res.data;
  },
  getUserVocabularyStats: async () => {
    const res = await axiosInstance.get(`${API_BASE}/user-vocabulary/statistics/`);
    return unwrap(res.data);
  },
  getDueVocabulary: async () => {
    const res = await axiosInstance.get(`${API_BASE}/user-vocabulary/due_for_review/`);
    return unwrap(res.data);
  },
  reviewWord: async (vocabularyId, isCorrect) => {
    const res = await axiosInstance.post(`${API_BASE}/user-vocabulary/review_word/`, {
      vocabulary_id: vocabularyId,
      is_correct: isCorrect,
    });
    return unwrap(res.data);
  },
  forgotPassword: async (email) => {
    const res = await axiosInstance.post('/auth/forgot-password/', { email });
    return unwrap(res.data);
  },
  resetPassword: async (payload) => {
    const res = await axiosInstance.post('/auth/reset-password/', payload);
    return unwrap(res.data);
  },
  updateMe: async (data) => {
    const res = await axiosInstance.patch('/auth/me/', data);
    return unwrap(res.data);
  },
  logout: async () => {
    const res = await axiosInstance.post('/auth/logout/');
    return unwrap(res.data);
  },

  getAudioLesson: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/audio-lessons/${id}/`);
    return res.data;
  },
  submitListeningAnswer: async (exerciseId, answer) => {
    const res = await axiosInstance.post(`${API_BASE}/listening-exercises/${exerciseId}/submit_answer/`, { answer });
    return unwrap(res.data);
  },
  getSpeakingLesson: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/speaking-lessons/${id}/`);
    return res.data;
  },
  getSpeakingExercises: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/speaking-exercises/`, { params });
    return res.data;
  },
  submitSpeakingSelfScore: async (data) => {
    const res = await axiosInstance.post(`${API_BASE}/speaking-attempts/submit_self_score/`, data);
    return res.data;
  },
  submitQuiz: async (quizId, answersData) => {
    const res = await axiosInstance.post(`${API_BASE}/quizzes/${quizId}/submit/`, answersData);
    return unwrap(res.data);
  },
  getSentenceStructure: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/sentence-structures/${id}/`);
    return res.data;
  },
  submitSentenceExercise: async (id, answers) => {
    const res = await axiosInstance.post(`${API_BASE}/sentence-structures/${id}/submit_exercise/`, { answers });
    return unwrap(res.data);
  },
  getReadingLesson: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/reading-lessons/${id}/`);
    return res.data;
  },
  submitReadingComprehension: async (id, answers) => {
    const res = await axiosInstance.post(`${API_BASE}/reading-lessons/${id}/submit_comprehension/`, { answers });
    return unwrap(res.data);
  },

  // ── Listening ───────────────────────────────────────
  getAudioLessons: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/audio-lessons/`, { params });
    return res.data;
  },
  getListeningExercises: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/listening-exercises/`, { params });
    return res.data;
  },

  // ── Speaking ────────────────────────────────────────
  getSpeakingLessons: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/speaking-lessons/`, { params });
    return res.data;
  },
  getPronunciationPatterns: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/pronunciation-patterns/`, { params });
    return res.data;
  },

  // ── Quiz ────────────────────────────────────────────
  getQuizzes: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/quizzes/`, { params });
    return res.data;
  },
  getQuiz: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/quizzes/${id}/`);
    return res.data;
  },
  getQuestions: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/questions/`, { params });
    return res.data;
  },

  // ── Sentence / Grammar ──────────────────────────────
  getSentenceStructures: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/sentence-structures/`, { params });
    return res.data;
  },

  // ── Reading ─────────────────────────────────────────
  getReadingLessons: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/reading-lessons/`, { params });
    return res.data;
  },
  getReadingParagraphs: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/reading-paragraphs/`, { params });
    return res.data;
  },

  // ── Flashcard Decks ─────────────────────────────────
  getFlashcardDecks: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-decks/`, { params });
    return res.data;
  },
  getFlashcardDeck: async (id) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-decks/${id}/`);
    return res.data;
  },
  createFlashcardDeck: async (data) => {
    const res = await axiosInstance.post(`${API_BASE}/flashcard-decks/`, data);
    return res.data;
  },
  updateFlashcardDeck: async (id, data) => {
    const res = await axiosInstance.put(`${API_BASE}/flashcard-decks/${id}/`, data);
    return res.data;
  },
  deleteFlashcardDeck: async (id) => {
    const res = await axiosInstance.delete(`${API_BASE}/flashcard-decks/${id}/`);
    return res.data;
  },
  addCardsToDeck: async (id, cards) => {
    const res = await axiosInstance.post(`${API_BASE}/flashcard-decks/${id}/add_cards/`, { cards });
    return unwrap(res.data);
  },
  removeCardsFromDeck: async (id, cardIds) => {
    const res = await axiosInstance.delete(`${API_BASE}/flashcard-decks/${id}/remove_cards/`, { data: { card_ids: cardIds } });
    return unwrap(res.data);
  },
  getMyFlashcardDecks: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-decks/my_decks/`, { params });
    return res.data;
  },
  getFavoriteFlashcardDecks: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-decks/favorites/`, { params });
    return res.data;
  },
  getPublicFlashcardDecks: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-decks/public_decks/`, { params });
    return res.data;
  },

  // ── Flashcards ──────────────────────────────────────
  getFlashcards: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcards/`, { params });
    return res.data;
  },
  createFlashcard: async (data) => {
    const res = await axiosInstance.post(`${API_BASE}/flashcards/`, data);
    return res.data;
  },
  updateFlashcard: async (id, data) => {
    const res = await axiosInstance.put(`${API_BASE}/flashcards/${id}/`, data);
    return res.data;
  },
  deleteFlashcard: async (id) => {
    const res = await axiosInstance.delete(`${API_BASE}/flashcards/${id}/`);
    return res.data;
  },

  // ── Flashcard Progress ──────────────────────────────
  getFlashcardProgress: async (params = {}) => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-progress/`, { params });
    return res.data;
  },
  getFlashcardProgressStats: async () => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-progress/statistics/`);
    return unwrap(res.data);
  },
  getDueFlashcards: async () => {
    const res = await axiosInstance.get(`${API_BASE}/flashcard-progress/due_for_review/`);
    return res.data;
  },
  reviewFlashcard: async (id, isCorrect) => {
    const res = await axiosInstance.post(`${API_BASE}/flashcard-progress/${id}/review/`, { is_correct: isCorrect });
    return unwrap(res.data);
  },
  bulkCreateProgress: async (deckId) => {
    const res = await axiosInstance.post(`${API_BASE}/flashcard-progress/bulk_create_progress/`, { deck_id: deckId });
    return unwrap(res.data);
  },

  // ── Classroom / LMS ─────────────────────────────────
  getClassroomDashboard: async () => {
    const res = await axiosInstance.get('/classroom/dashboard/');
    return unwrap(res.data);
  },
  getStudents: async (params = {}) => {
    const res = await axiosInstance.get('/students/', { params: { page_size: 100, ...params } });
    return res.data;
  },
  getStudent: async (id) => {
    const res = await axiosInstance.get(`/students/${id}/`);
    return res.data;
  },
  createStudent: async (data) => {
    const res = await axiosInstance.post('/students/', data);
    return unwrap(res.data);
  },
  approveStudent: async (id) => {
    const res = await axiosInstance.post(`/students/${id}/approve/`);
    return unwrap(res.data);
  },
  rejectStudent: async (id) => {
    const res = await axiosInstance.post(`/students/${id}/reject/`);
    return unwrap(res.data);
  },
  getCourses: async (params = {}) => {
    const res = await axiosInstance.get('/courses/', { params: { page_size: 100, ...params } });
    return res.data;
  },
  getCourse: async (id) => {
    const res = await axiosInstance.get(`/courses/${id}/`);
    return res.data;
  },
  createCourse: async (data) => {
    const res = await axiosInstance.post('/courses/', data);
    return res.data;
  },
  updateCourse: async (id, data) => {
    const res = await axiosInstance.patch(`/courses/${id}/`, data);
    return res.data;
  },
  deleteCourse: async (id) => {
    const res = await axiosInstance.delete(`/courses/${id}/`);
    return res.data;
  },
  getClassGroups: async (params = {}) => {
    const res = await axiosInstance.get('/class-groups/', { params: { page_size: 100, ...params } });
    return res.data;
  },
  getClassGroup: async (id) => {
    const res = await axiosInstance.get(`/class-groups/${id}/`);
    return res.data;
  },
  createClassGroup: async (data) => {
    const res = await axiosInstance.post('/class-groups/', data);
    return res.data;
  },
  enrollStudent: async (groupId, studentId) => {
    const res = await axiosInstance.post(`/class-groups/${groupId}/enroll/`, { student_id: studentId });
    return unwrap(res.data);
  },
  enrollStudents: async (groupId, studentIds) => {
    const res = await axiosInstance.post(`/class-groups/${groupId}/enroll/`, { student_ids: studentIds });
    return unwrap(res.data);
  },
  unenrollStudent: async (groupId, studentId) => {
    const res = await axiosInstance.post(`/class-groups/${groupId}/unenroll/`, { student_id: studentId });
    return unwrap(res.data);
  },
  getSessions: async (params = {}) => {
    const res = await axiosInstance.get('/sessions/', { params: { page_size: 100, ...params } });
    return res.data;
  },
  getSession: async (id) => {
    const res = await axiosInstance.get(`/sessions/${id}/`);
    return res.data;
  },
  createSession: async (data) => {
    const res = await axiosInstance.post('/sessions/', data);
    return res.data;
  },
  updateSession: async (id, data) => {
    const res = await axiosInstance.patch(`/sessions/${id}/`, data);
    return res.data;
  },
  deleteSession: async (id) => {
    const res = await axiosInstance.delete(`/sessions/${id}/`);
    return res.data;
  },
  markAttendance: async (sessionId, payload) => {
    const res = await axiosInstance.post(`/sessions/${sessionId}/attendance/`, payload);
    return unwrap(res.data);
  },
};
