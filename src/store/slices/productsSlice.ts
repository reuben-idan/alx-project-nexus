import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Product, PaginatedProducts, ProductFilterOptions } from '../../types/product';
import { RootState } from '../store';
import productService from '../../services/api/products';

export interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
  relatedProducts: Product[];
  currentProduct: Product | null;
  filterOptions: ProductFilterOptions | null;
  searchResults: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    category: string | null;
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    rating: number | null;
    searchQuery: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    inStock: boolean | null;
    onSale: boolean | null;
    featured: boolean | null;
    tags: string[];
  };
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  onSaleProducts: [],
  relatedProducts: [],
  currentProduct: null,
  filterOptions: null,
  searchResults: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  filters: {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    searchQuery: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    inStock: null,
    onSale: null,
    featured: null,
    tags: [],
  },
};

export const fetchProducts = createAsyncThunk<
  PaginatedProducts,
  { page?: number; limit?: number; [key: string]: any },
  { rejectValue: string }
>('products/fetchProducts', async (params = {}, { rejectWithValue }) => {
  try {
    const response = await productService.getProducts(params);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (idOrSlug, { rejectWithValue }) => {
  try {
    const product = await productService.getProductById(idOrSlug);
    return product;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Product not found');
  }
});

export const fetchFeaturedProducts = createAsyncThunk<
  Product[],
  number | undefined,
  { rejectValue: string }
>('products/fetchFeaturedProducts', async (limit = 8, { rejectWithValue }) => {
  try {
    const products = await productService.getFeaturedProducts(limit);
    return products;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
  }
});

export const fetchNewArrivals = createAsyncThunk<
  Product[],
  number | undefined,
  { rejectValue: string }
>('products/fetchNewArrivals', async (limit = 8, { rejectWithValue }) => {
  try {
    const products = await productService.getNewArrivals(limit);
    return products;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
  }
});

export const fetchOnSaleProducts = createAsyncThunk<
  Product[],
  number | undefined,
  { rejectValue: string }
>('products/fetchOnSaleProducts', async (limit = 8, { rejectWithValue }) => {
  try {
    const products = await productService.getOnSaleProducts(limit);
    return products;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products on sale');
  }
});

export const searchProducts = createAsyncThunk<
  PaginatedProducts,
  string,
  { state: RootState; rejectValue: string }
>('products/searchProducts', async (query, { getState, rejectWithValue }) => {
  try {
    const { pagination } = getState().products;
    const response = await productService.searchProducts(query, {
      page: pagination.page,
      limit: pagination.limit,
    });
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
      state.pagination.page = 1; // Reset to first page when changing category
    },
    setBrand: (state, action: PayloadAction<string | null>) => {
      state.filters.brand = action.payload;
      state.pagination.page = 1;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.pagination.page = 1;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.filters.rating = action.payload;
      state.pagination.page = 1;
    },
    setSortBy: (state, action: PayloadAction<{ field: string; order: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.field;
      state.filters.sortOrder = action.payload.order;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when changing limit
    },
    resetFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        searchQuery: state.filters.searchQuery, // Keep search query
      };
      state.pagination.page = 1;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPreviousPage: action.payload.hasPreviousPage,
      };
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Product By Id
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Featured Products
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
      state.featuredProducts = action.payload;
    });

    // Fetch New Arrivals
    builder.addCase(fetchNewArrivals.fulfilled, (state, action) => {
      state.newArrivals = action.payload;
    });

    // Fetch On Sale Products
    builder.addCase(fetchOnSaleProducts.fulfilled, (state, action) => {
      state.onSaleProducts = action.payload;
    });

    // Search Products
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.products;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
        hasNextPage: action.payload.hasNextPage,
        hasPreviousPage: action.payload.hasPreviousPage,
      };
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectFeaturedProducts = (state: RootState) => state.products.featuredProducts;
export const selectNewArrivals = (state: RootState) => state.products.newArrivals;
export const selectOnSaleProducts = (state: RootState) => state.products.onSaleProducts;
export const selectSearchResults = (state: RootState) => state.products.searchResults;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;
export const selectPagination = (state: RootState) => state.products.pagination;
export const selectFilters = (state: RootState) => state.products.filters;

export const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (products: Product[], filters) => {
    return products.filter((product: Product) => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      // Filter by brand
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }
      
      // Filter by price range
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }
      
      // Filter by rating
      if (filters.rating !== null && product.rating < filters.rating) {
        return false;
      }
      
      // Filter by stock status
      if (filters.inStock !== null && product.isInStock !== filters.inStock) {
        return false;
      }
      
      // Filter by sale status
      if (filters.onSale !== null && product.isOnSale !== filters.onSale) {
        return false;
      }
      
      // Filter by featured status
      if (filters.featured !== null && product.isFeatured !== filters.featured) {
        return false;
      }
      
      // Filter by tags
      if (filters.tags.length > 0 && !filters.tags.some((tag: string) => product.tags.includes(tag))) {
        return false;
      }
      
      return true;
    });
  }
);

export const selectSortedProducts = createSelector(
  [selectFilteredProducts, selectFilters],
  (products, filters) => {
    const sortedProducts = [...products];
    
    return sortedProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'newest':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
);

// Export actions
export const {
  setSearchQuery,
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
  setSortBy,
  setPage,
  setLimit,
  resetFilters,
  clearCurrentProduct,
  clearSearchResults,
} = productsSlice.actions;

export default productsSlice.reducer;
