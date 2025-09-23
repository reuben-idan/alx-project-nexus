import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CartItem, CartState, CartSummary, ShippingAddress, BillingAddress, PaymentMethod, Coupon } from '../../../types/cart';
import { Product } from '../../../types/product';
import { RootState } from '../store';

// Helper function to calculate cart summary
const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0; // Will be calculated based on coupons
  const taxRate = 0.1; // 10% tax rate (adjust as needed)
  const tax = (subtotal - discount) * taxRate;
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0; // Free shipping over $100
  const total = subtotal - discount + tax + shipping;
  
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount: items.length,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

// Load cart from localStorage if available
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      summary: calculateSummary([]),
      isLoading: false,
      error: null,
      lastUpdated: null,
    };
  }
  
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate the cart structure
      if (parsedCart.items && Array.isArray(parsedCart.items)) {
        return {
          ...parsedCart,
          summary: calculateSummary(parsedCart.items),
          isLoading: false,
          error: null,
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
  }
  
  return {
    items: [],
    summary: calculateSummary([]),
    isLoading: false,
    error: null,
    lastUpdated: null,
  };
};

const initialState: CartState = loadCartFromStorage();

// Save cart to localStorage whenever it changes
const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      const cartToSave = {
        ...state,
        summary: calculateSummary(state.items), // Recalculate before saving
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('cart', JSON.stringify(cartToSave));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart or update quantity if already exists
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number; variantId?: string }>) => {
      const { product, quantity = 1, variantId } = action.payload;
      const now = new Date().toISOString();
      
      // Find existing item
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );
      
      // Get variant if exists
      const variant = variantId 
        ? product.variants?.find(v => v.id === variantId)
        : null;
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].updatedAt = now;
      } else {
        // Create new cart item
        const cartItem: CartItem = {
          id: `${product.id}-${variantId || 'default'}`,
          productId: product.id,
          variantId: variant?.id,
          name: variant ? `${product.name} - ${variant.name}` : product.name,
          price: variant?.price ?? product.price,
          originalPrice: variant?.originalPrice ?? product.originalPrice,
          quantity,
          image: variant?.images?.[0]?.url ?? product.images?.[0]?.url ?? '',
          stock: variant?.stock ?? product.stock ?? 0,
          sku: variant?.sku ?? product.sku ?? '',
          weight: variant?.weight,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            stock: product.stock ?? 0,
            variants: product.variants || [],
          },
          variant: variant || undefined,
          isAvailable: (variant?.stock ?? product.stock ?? 0) > 0,
          addedAt: now,
          updatedAt: now,
        };
        
        // Add new item to cart
        state.items.push(cartItem);
      }
      
      // Recalculate cart summary
      state.summary = calculateSummary(state.items);
      state.lastUpdated = now;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    // Update item quantity
    updateCartItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = Math.min(
            quantity,
            state.items[itemIndex].stock
          );
          state.items[itemIndex].updatedAt = new Date().toISOString();
        }
        
        // Recalculate summary
        state.summary = calculateSummary(state.items);
        state.lastUpdated = new Date().toISOString();
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Recalculate summary
      state.summary = calculateSummary(state.items);
      state.lastUpdated = new Date().toISOString();
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.summary = calculateSummary([]);
      state.lastUpdated = new Date().toISOString();
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    // Update shipping address
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      saveCartToStorage(state);
    },
    
    // Update billing address
    setBillingAddress: (state, action: PayloadAction<BillingAddress>) => {
      state.billingAddress = action.payload;
      saveCartToStorage(state);
    },
    
    // Update payment method
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
      saveCartToStorage(state);
    },
    
    // Apply coupon
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
      // Recalculate summary with discount
      state.summary = calculateSummary(state.items);
      saveCartToStorage(state);
    },
    
    // Remove coupon
    removeCoupon: (state) => {
      state.coupon = undefined;
      // Recalculate summary without discount
      state.summary = calculateSummary(state.items);
      saveCartToStorage(state);
    },
    
    // Set cart loading state
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set cart error
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartSummary = (state: RootState) => state.cart.summary;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartLastUpdated = (state: RootState) => state.cart.lastUpdated;
export const selectShippingAddress = (state: RootState) => state.cart.shippingAddress;
export const selectBillingAddress = (state: RootState) => state.cart.billingAddress;
export const selectPaymentMethod = (state: RootState) => state.cart.paymentMethod;
export const selectCoupon = (state: RootState) => state.cart.coupon;

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectIsItemInCart = (productId: string, variantId?: string) => 
  createSelector(
    [selectCartItems],
    (items) => items.some(
      item => item.productId === productId && item.variantId === variantId
    )
  );

export const selectCartItemById = (itemId: string) => 
  createSelector(
    [selectCartItems],
    (items) => items.find(item => item.id === itemId)
  );

// Export actions
export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setShippingAddress,
  setBillingAddress,
  setPaymentMethod,
  applyCoupon,
  removeCoupon,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
