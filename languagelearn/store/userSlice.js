import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService, apiErrorMessage } from '../services/authService';

export const loginAndLoadUser = createAsyncThunk(
  'user/loginAndLoad',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      await authService.login(username, password);
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Login failed'));
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  'user/loadCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const hasToken = await authService.isAuthenticated();
      if (!hasToken) return null;
      return await authService.getCurrentUser();
    } catch (error) {
      await authService.logout();
      return rejectWithValue(apiErrorMessage(error, 'Failed to load user'));
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await authService.logout();
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAndLoadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAndLoadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginAndLoadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.error = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
