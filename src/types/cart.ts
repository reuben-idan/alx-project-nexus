import { Product, ProductVariant } from './product';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  stock: number;
  sku: string;
  weight?: number;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    variants?: ProductVariant[];
  };
  variant?: ProductVariant;
  isAvailable: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  totalItems: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: PaymentMethod;
  coupon?: Coupon;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email: string;
  isDefault?: boolean;
  type: 'shipping';
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email: string;
  isDefault?: boolean;
  type: 'billing';
  sameAsShipping?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  description?: string;
  minPurchase?: number;
  expiresAt?: string;
  applied: boolean;
}
