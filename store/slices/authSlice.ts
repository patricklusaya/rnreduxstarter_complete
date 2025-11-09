import {
    loginUser,
    logoutUser,
    onAuthStateChange,
    registerUser
} from '@/services/authService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

// Serializable user data type
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Helper function to convert Firebase User to serializable format
const userToSerializable = (user: User | null): SerializableUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

// Register async thunk
export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await registerUser(email, password);
    return userToSerializable(user);
  }
);

// Login async thunk
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await loginUser(email, password);
    return userToSerializable(user);
  }
);

// Logout async thunk
export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
});

// Initialize auth state
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  return new Promise<SerializableUser | null>((resolve) => {
    const unsubscribe = onAuthStateChange((user) => {
      unsubscribe();
      resolve(userToSerializable(user));
    });
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to logout';
      });

    // Initialize
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

