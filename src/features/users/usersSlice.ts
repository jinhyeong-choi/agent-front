import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserUpdateRequest, PasswordUpdate } from '@/types';
import { setAuthUser } from '@/features/auth/authSlice';
import { get, put, post } from '@/utils/api';

interface UsersState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const getUserProfile = createAsyncThunk(
  'users/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<User>('/users/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (userData: UserUpdateRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await put<User>('/users/me', userData);
      
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to update profile');
      }
      
      // Update the auth user with the new profile data
      dispatch(setAuthUser(response.data));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'users/updatePassword',
  async (passwordData: PasswordUpdate, { rejectWithValue }) => {
    try {
      const response = await post<User>('/auth/password', passwordData);
      
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to update password');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update password');
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // updatePassword
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = usersSlice.actions;

export default usersSlice.reducer;