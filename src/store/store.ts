import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer, { Order } from './slices/ordersSlice';

// Define the shape of the entire Redux state
export interface RootState {
  cart: any; // Replace 'any' with the actual cart state type if available
  auth: any;  // Replace 'any' with the actual auth state type if available
  ui: any;    // Replace 'any' with the actual UI state type if available
  products: any; // Replace 'any' with the actual products state type if available
  orders: {
    orders: Order[];
    loading: boolean;
    error: string | null;
  };
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    ui: uiReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export { store };
