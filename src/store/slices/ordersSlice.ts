import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'status'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `#${Date.now()}`,
        date: new Date(),
        status: 'processing',
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },
});

export const { addOrder, updateOrderStatus, setLoading, setError, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
