import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../services/progressService';

// Async thunks
export const fetchOverallProgress = createAsyncThunk(
  'progress/fetchOverall',
  async (_, { rejectWithValue }) => {
    try {
      const data = await progressService.getOverallProgress();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const fetchUserPreferences = createAsyncThunk(
  'progress/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const data = await progressService.getUserPreferences();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch preferences');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'progress/updatePreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const data = await progressService.updateUserPreferences(
        preferencesData.id,
        preferencesData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update preferences');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    overall: null,
    preferences: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverallProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverallProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.overall = action.payload;
      })
      .addCase(fetchOverallProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
