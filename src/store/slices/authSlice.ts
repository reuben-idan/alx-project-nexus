import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Load initial state from localStorage if available
const loadInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (error) {
        console.error('Failed to parse auth state from localStorage', error);
      }
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update in localStorage
        if (typeof window !== 'undefined') {
          const storedAuth = localStorage.getItem('auth');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            localStorage.setItem('auth', JSON.stringify({
              ...authData,
              user: { ...authData.user, ...action.payload },
            }));
          }
        }
      }
    },
  },
  // Handle async thunks from authApi
  extraReducers: (builder) => {
    // Handle pending, fulfilled, and rejected states for login
    builder.addMatcher(
      (action) => action.type.endsWith('/login/pending'),
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    
    builder.addMatcher(
      (action) => action.type.endsWith('/login/fulfilled'),
      (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        }
      }
    );
    
    builder.addMatcher(
      (action) => action.type.endsWith('/login/rejected'),
      (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      }
    );
    
    // Handle logout
    builder.addMatcher(
      (action) => action.type.endsWith('/logout/fulfilled'),
      (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        
        // Clear from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth');
        }
      }
    );
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  setAuthError,
  updateUserProfile,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
