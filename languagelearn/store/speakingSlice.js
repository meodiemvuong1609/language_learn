import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { speakingService } from '../services/speakingService';

// Async thunks
export const fetchSpeakingLessons = createAsyncThunk(
  'speaking/fetchLessons',
  async (_, { rejectWithValue }) => {
    try {
      const data = await speakingService.getAllSpeakingLessons();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch speaking lessons');
    }
  }
);

export const fetchSpeakingExercises = createAsyncThunk(
  'speaking/fetchExercises',
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await speakingService.getSpeakingExercises(lessonId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

export const fetchSpeakingProgress = createAsyncThunk(
  'speaking/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const data = await speakingService.getUserProgress();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const submitSpeakingAttempt = createAsyncThunk(
  'speaking/submitAttempt',
  async ({ exerciseId, audioFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('exercise', exerciseId);
      formData.append('audio_recording', audioFile);

      const data = await speakingService.submitAttempt(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit attempt');
    }
  }
);

const speakingSlice = createSlice({
  name: 'speaking',
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
      .addCase(fetchSpeakingLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeakingLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchSpeakingLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSpeakingExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
      })
      .addCase(fetchSpeakingProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
  },
});

export const { setCurrentLesson, clearError } = speakingSlice.actions;
export default speakingSlice.reducer;
