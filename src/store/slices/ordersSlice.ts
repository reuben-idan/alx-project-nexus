import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

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

// Sample orders for demonstration
const sampleOrders: Order[] = [
  {
    id: "#ORD-001",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "delivered",
    items: [
      {
        id: "1",
        name: "Fresh Organic Apples",
        price: 4.99,
        quantity: 2,
        image: "/images/Fresh Apples.png",
      },
      {
        id: "2",
        name: "Premium Bananas",
        price: 2.99,
        quantity: 1,
        image: "/images/Bananas.png",
      },
    ],
    total: 12.97,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "Visa ending in 1234",
    trackingNumber: "TRK123456789",
  },
  {
    id: "#ORD-002",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "shipped",
    items: [
      {
        id: "3",
        name: "Sourdough Bread",
        price: 3.99,
        quantity: 1,
        image: "/images/Sourdough Bread.png",
      },
    ],
    total: 3.99,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "Visa ending in 1234",
    trackingNumber: "TRK987654321",
  },
  {
    id: "#ORD-003",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "processing",
    items: [
      {
        id: "4",
        name: "Organic Spinach",
        price: 2.49,
        quantity: 1,
        image: "/images/Organic Spinach.png",
      },
      {
        id: "5",
        name: "Fresh Carrots",
        price: 1.99,
        quantity: 2,
        image: "/images/Carrots.png",
      },
    ],
    total: 6.47,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "PayPal",
  },
];

const initialState: OrdersState = {
  orders: sampleOrders,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (
      state,
      action: PayloadAction<Omit<Order, "id" | "date" | "status">>
    ) => {
      const newOrder: Order = {
        ...action.payload,
        id: `#ORD-${String(Date.now()).slice(-6)}`,
        date: new Date(),
        status: "processing",
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        // Add tracking number when order is shipped
        if (action.payload.status === "shipped" && !order.trackingNumber) {
          order.trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }
      }
    },
    // Automatically progress order statuses
    progressOrderStatuses: (state) => {
      const now = new Date();
      state.orders.forEach((order) => {
        const orderAge = now.getTime() - order.date.getTime();
        const hoursSinceOrder = orderAge / (1000 * 60 * 60);

        // Auto-progress based on time
        if (order.status === "processing" && hoursSinceOrder >= 2) {
          order.status = "shipped";
          if (!order.trackingNumber) {
            order.trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          }
        } else if (order.status === "shipped" && hoursSinceOrder >= 24) {
          order.status = "delivered";
        }
      });
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

export const {
  addOrder,
  updateOrderStatus,
  progressOrderStatuses,
  setLoading,
  setError,
  clearOrders,
} = ordersSlice.actions;
export default ordersSlice.reducer;
