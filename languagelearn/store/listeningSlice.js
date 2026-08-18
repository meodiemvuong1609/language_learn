import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listeningService } from '../services/listeningService';

// Async thunks
export const fetchAudioLessons = createAsyncThunk(
  'listening/fetchLessons',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listeningService.getAllAudioLessons();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audio lessons');
    }
  }
);

export const fetchListeningExercises = createAsyncThunk(
  'listening/fetchExercises',
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await listeningService.getListeningExercises(lessonId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

export const fetchListeningProgress = createAsyncThunk(
  'listening/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const data = await listeningService.getUserProgress();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const submitListeningAttempt = createAsyncThunk(
  'listening/submitAttempt',
  async ({ exerciseId, userAnswer }, { rejectWithValue }) => {
    try {
      const data = await listeningService.submitAttempt({
        exercise: exerciseId,
        user_answer: userAnswer,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit attempt');
    }
  }
);

const listeningSlice = createSlice({
  name: 'listening',
  initialState: {
    lessons: [],
    exercises: [],
    progress: [],
    currentLesson: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch audio lessons
      .addCase(fetchAudioLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudioLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchAudioLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch exercises
      .addCase(fetchListeningExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
      })
      // Fetch progress
      .addCase(fetchListeningProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      // Submit attempt
      .addCase(submitListeningAttempt.fulfilled, (state, action) => {
        // Refresh progress after submission
      });
  },
});

export const { setCurrentLesson, clearError } = listeningSlice.actions;
export default listeningSlice.reducer;
