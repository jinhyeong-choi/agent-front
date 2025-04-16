import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, RegistrationRequest, AuthState } from '@/types';
import { setToken, setUser, getUser, removeToken, removeUser } from '@/utils/auth';
import { post, get } from '@/utils/api';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  expires: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await post('/auth/login', credentials);
      
      if (response.status !== 200) {
        return rejectWithValue(response.message || 'Login failed');
      }
      
      // Store token and user data in localStorage
      setToken(response.data.token.access_token, response.data.token.expires_in);
      setUser(response.data);
      
      return {
        user: response.data,
        token: response.data.token.access_token,
        expires: response.data.token.expires_in,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegistrationRequest, { rejectWithValue }) => {
    try {
      const response = await post('/auth/register', userData);
      
      if (response.status !== 201) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      
      // Store token and user data in localStorage
      setToken(response.data.token.access_token, response.data.token.expires_in);
      setUser(response.data);
      
      return {
        user: response.data,
        token: response.data.token.access_token,
        expires: response.data.token.expires_in,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {
      // Get user data from localStorage
      const user = getUser();
      if (!user) {
        throw new Error('No user data found');
      }
      
      // Fetch fresh user data from API
      const response = await get('/users/me');
      
      if (response.status !== 200) {
        throw new Error('Failed to refresh user data');
      }
      
      // Update user data in localStorage
      setUser(response.data);
      
      return {
        user: response.data,
      };
    } catch (error: any) {
      // If the refresh fails, log out the user
      removeToken();
      removeUser();
      return rejectWithValue(error.message || 'Failed to refresh user data');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token and user data from localStorage
      removeToken();
      removeUser();
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateTokenBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.token_balance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expires = action.payload.expires;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expires = action.payload.expires;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Refresh user
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.expires = null;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.expires = null;
        state.error = null;
      });
  },
});

export const { setAuthUser, setAuthError, clearAuthError, updateTokenBalance } = authSlice.actions;

export default authSlice.reducer;