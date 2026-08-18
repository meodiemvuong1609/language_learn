import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './axios';
import Cookies from 'js-cookie';

// Async action to handle login
export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      // baseURL on axiosInstance already includes /api, so use relative path here
      const response = await axiosInstance.post('/auth/login/', payload);

      // Check the code in the response data
      if (response.data.code === 200) {
        const token = response.data.data;
        // Persist so ProtectedRoute (cookie-based) works after register auto-login
        // and across reloads — LoginForm previously set this, register did not.
        if (typeof window !== 'undefined' && token) {
          Cookies.set('token', token, { expires: 7 });
        }
        return token;
      } else {
        // Return a custom error message if code is not 200
        return rejectWithValue(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      // Return a custom error message if the request fails
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      // baseURL on axiosInstance already includes /api, so use relative path here
      const response = await axiosInstance.get('/auth/me/');
      // Check the code in the response data
      if (response.data.code === 200) {
        return response.data.data; // Return user data on success
      } else {
        // Return a custom error message if code is not 200
        return rejectWithValue(response.data.message || 'Unknown error occurred');
      }
    } catch (error) {
      // Return a custom error message if the request fails
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload || null;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Save token to state
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Save user data to state
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
