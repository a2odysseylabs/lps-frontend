// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials } from '../../types/auth';
import { api } from '../../services/api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await api.post('/logout');

  // Clear all cookies
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=');
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // Clear local storage
  localStorage.clear();

  // Reset Redux state
  dispatch(clearAuthState());
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const response = await api.post('/refresh-token');
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      });
  },
});

export const { clearError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
