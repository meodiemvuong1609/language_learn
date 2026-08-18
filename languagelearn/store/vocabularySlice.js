import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vocabularyService } from '../services/vocabularyService';

function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

export const fetchVocabularies = createAsyncThunk(
  'vocabulary/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await vocabularyService.getAllVocabularies();
      return asList(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vocabularies');
    }
  }
);

export const fetchVocabularyById = createAsyncThunk(
  'vocabulary/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await vocabularyService.getVocabulary(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vocabulary');
    }
  }
);

export const fetchVocabularyLists = createAsyncThunk(
  'vocabulary/fetchLists',
  async (_, { rejectWithValue }) => {
    try {
      const data = await vocabularyService.getUserLists();
      return asList(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vocabulary lists');
    }
  }
);

export const fetchUserVocabularies = createAsyncThunk(
  'vocabulary/fetchUserVocabs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await vocabularyService.getUserVocabularies();
      return asList(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user vocabularies');
    }
  }
);

const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState: {
    items: [],
    userVocabularies: [],
    lists: [],
    selectedVocabulary: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedVocabulary: (state) => {
      state.selectedVocabulary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vocabularies
      .addCase(fetchVocabularies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocabularies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVocabularies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch vocabulary by ID
      .addCase(fetchVocabularyById.fulfilled, (state, action) => {
        state.selectedVocabulary = action.payload;
      })
      // Fetch user vocabularies
      .addCase(fetchUserVocabularies.fulfilled, (state, action) => {
        state.userVocabularies = action.payload;
      })
      // Fetch vocabulary lists
      .addCase(fetchVocabularyLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      });
  },
});

export const { clearSelectedVocabulary, clearError } = vocabularySlice.actions;
export default vocabularySlice.reducer;
