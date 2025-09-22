import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import productsReducer from '../store/slices/productsSlice';
import cartReducer from '../store/slices/cartSlice';
import authReducer from '../store/slices/authSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['cart/addToCart', 'cart/updateCartItemQuantity', 'cart/removeFromCart'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['cart.items', 'cart.summary'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
