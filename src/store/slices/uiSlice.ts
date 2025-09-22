import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutPanelOpen: boolean;
  toast: {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  loading: {
    isLoading: boolean;
    message?: string;
  };
  viewMode: 'grid' | 'list';
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'newest' | 'popular';
  filters: {
    priceRange: [number, number];
    categories: string[];
    brands: string[];
    ratings: number[];
    inStock: boolean;
    onSale: boolean;
  };
}

const initialState: UIState = {
  theme: 'light',
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isCheckoutPanelOpen: false,
  toast: {
    isVisible: false,
    message: '',
    type: 'info',
  },
  loading: {
    isLoading: false,
    message: '',
  },
  viewMode: 'grid',
  sortBy: 'default',
  filters: {
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    ratings: [],
    inStock: false,
    onSale: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
        document.documentElement.classList.toggle('dark', state.theme === 'dark');
      }
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.classList.toggle('dark', action.payload === 'dark');
      }
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    toggleCart: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCartOpen = action.payload ?? !state.isCartOpen;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    toggleCheckoutPanel: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCheckoutPanelOpen = action.payload ?? !state.isCheckoutPanelOpen;
    },
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.toast = {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    setLoading: (
      state,
      action: PayloadAction<{
        isLoading: boolean;
        message?: string;
      }>
    ) => {
      state.loading = {
        isLoading: action.payload.isLoading,
        message: action.payload.message || '',
      };
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'default' | 'price_asc' | 'price_desc' | 'newest' | 'popular'>
    ) => {
      state.sortBy = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<{
        priceRange?: [number, number];
        categories?: string[];
        brands?: string[];
        ratings?: number[];
        inStock?: boolean;
        onSale?: boolean;
      }>
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileMenu,
  toggleCart,
  toggleSearch,
  toggleCheckoutPanel,
  showToast,
  hideToast,
  setLoading,
  setViewMode,
  setSortBy,
  updateFilters,
  resetFilters,
} = uiSlice.actions;

export const selectUI = (state: { ui: UIState }) => state.ui;

export default uiSlice.reducer;
