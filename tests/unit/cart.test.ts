import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart, removeFromCart, updateCartItemQuantity, clearCart } from '../../src/store/slices/cartSlice';
import { Product } from '../../src/types/product';

// Mock product for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 10.99,
  originalPrice: 12.99,
  description: 'A test product',
  images: [{ url: '/test-image.jpg', alt: 'Test Product' }],
  stock: 10,
  sku: 'TEST-001',
  category: 'test',
  tags: ['test'],
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('Cart Functionality', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  it('should add a product to cart with quantity 1', () => {
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].quantity).toBe(1);
    expect(state.cart.items[0].productId).toBe(mockProduct.id);
  });

  it('should increment quantity when adding same product again', () => {
    // Add product first time
    store.dispatch(addToCart({ product: mockProduct }));
    
    // Add same product again
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].quantity).toBe(2);
  });

  it('should not create duplicates when adding same product', () => {
    // Add product multiple times
    store.dispatch(addToCart({ product: mockProduct }));
    store.dispatch(addToCart({ product: mockProduct }));
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    // Add product first
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    const itemId = state.cart.items[0].id;
    
    // Remove the item
    store.dispatch(removeFromCart(itemId));
    
    const newState = store.getState();
    expect(newState.cart.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    // Add product first
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    const itemId = state.cart.items[0].id;
    
    // Update quantity
    store.dispatch(updateCartItemQuantity({ itemId, quantity: 5 }));
    
    const newState = store.getState();
    expect(newState.cart.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    // Add product first
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    const itemId = state.cart.items[0].id;
    
    // Set quantity to 0
    store.dispatch(updateCartItemQuantity({ itemId, quantity: 0 }));
    
    const newState = store.getState();
    expect(newState.cart.items).toHaveLength(0);
  });

  it('should clear entire cart', () => {
    // Add multiple products
    store.dispatch(addToCart({ product: mockProduct }));
    store.dispatch(addToCart({ product: { ...mockProduct, id: '2', name: 'Test Product 2' } }));
    
    // Clear cart
    store.dispatch(clearCart());
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
  });

  it('should calculate correct totals', () => {
    // Add product with quantity 2
    store.dispatch(addToCart({ product: mockProduct }));
    store.dispatch(addToCart({ product: mockProduct }));
    
    const state = store.getState();
    const expectedSubtotal = mockProduct.price * 2;
    expect(state.cart.summary.subtotal).toBe(expectedSubtotal);
    expect(state.cart.summary.itemCount).toBe(1);
    expect(state.cart.summary.totalItems).toBe(2);
  });
});