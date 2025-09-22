export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  phoneNumber?: string;
  addresses?: Address[];
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  newsletter?: boolean;
  marketingEmails?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginError: string | null;
  registerError: string | null;
  resetPasswordError: string | null;
  resetPasswordSuccess: boolean;
  verifyEmailSuccess: boolean;
  verifyEmailError: string | null;
  userProfile: UserProfile | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface NewPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface UserProfile extends User {
  ordersCount: number;
  wishlistCount: number;
  addressesCount: number;
  defaultPaymentMethod?: {
    id: string;
    type: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    total: number;
    itemCount: number;
  }>;
}
