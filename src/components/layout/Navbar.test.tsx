import React from 'react';
import { render, screen, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
// Remove unused import

// Mock the Redux store
// This is now handled in the renderNavbar function

// Mock the auth hook
vi.mock('../../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn().mockImplementation(() => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

// Mock the theme hook
const mockToggleTheme = vi.fn();
vi.mock('../../features/theme/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock the categories hook
const mockUseCategories = vi.fn();
vi.mock('../../features/categories/hooks/useCategories', () => ({
  useCategories: mockUseCategories,
}));

// Default mock implementation
mockUseCategories.mockReturnValue({
  data: [
    { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
    { id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs' },
  ],
  error: null,
});

// Mock framer-motion for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  __esModule: true,
}));

// Mock the Logo component
vi.mock('../ui/Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn().mockReturnValue({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'test',
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
    BrowserRouter: actual.BrowserRouter,
    Link: actual.Link,
  };
});

let testStore: Store;

const renderNavbar = (initialPath = '/'): RenderResult => {
  window.history.pushState({}, 'Test page', initialPath);
  
  testStore = configureStore({
    reducer: {
      cart: () => ({
        items: [
          { id: '1', name: 'Test Product', price: 10, quantity: 2 },
          { id: '2', name: 'Another Product', price: 20, quantity: 1 },
        ],
      }),
      ui: () => ({
        isSearchOpen: false,
        isCartOpen: false,
        theme: 'light',
      }),
    },
  });
  
  return render(
    <Provider store={testStore}>
      <Router>
        <Navbar />
      </Router>
    </Provider>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset the URL
    window.history.pushState({}, '', '/');
  });

  it('renders the navbar with logo and navigation links', () => {
    renderNavbar();
    
    // Check if logo is rendered
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    
    // Check if main navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    
    // Check if cart icon is rendered
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
    
    // Check if search icon is rendered
    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
  });

  it('displays the correct number of items in the cart', () => {
    renderNavbar();
    
    // The mock cart has 3 items total (2 + 1)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', async () => {
    renderNavbar();
    
    // Menu should be closed by default
    const openMenuButton = screen.getByLabelText('Open menu');
    expect(openMenuButton).toBeInTheDocument();
    
    // Open mobile menu
    fireEvent.click(openMenuButton);
    
    // Menu should be open now
    const closeButton = screen.getByLabelText('Close menu');
    expect(closeButton).toBeInTheDocument();
    
    // Check for user icon (login button)
    const userIcon = screen.getByLabelText('My Account');
    expect(userIcon).toBeInTheDocument();
    
    // Close mobile menu
    fireEvent.click(closeButton);
    
    // Menu should be closed again
    await waitFor(() => {
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });
  });

  it('closes mobile menu when clicking outside', async () => {
    renderNavbar();
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    // Click outside the menu
    fireEvent.mouseDown(document);
    
    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByText('Login / Register')).not.toBeInTheDocument();
    });
  });

  it('navigates to the correct route when a link is clicked', () => {
    renderNavbar();
    
    // Test navigation to Shop
    const shopLink = screen.getByText('Shop');
    fireEvent.click(shopLink);
    expect(window.location.pathname).toBe('/products');
    
    // Test navigation to Categories
    const categoriesLink = screen.getByText('Categories');
    fireEvent.click(categoriesLink);
    expect(window.location.pathname).toBe('/categories');
  });

  it('displays login button when not authenticated', () => {
    renderNavbar();
    
    // Find the user icon (login button) in the desktop view
    const userIcon = screen.getByRole('link', { name: /login or register/i });
    expect(userIcon).toBeInTheDocument();
    
    // Check that it links to the auth page
    expect(userIcon).toHaveAttribute('href', '/auth');
  });

  it('displays user menu when authenticated', async () => {
    // Mock the auth hook to return authenticated state
    vi.mock('../../features/auth/hooks/useAuth', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: { name: 'Test User', email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
      }),
    }));
    
    renderNavbar();
    
    // Open mobile menu to see user options
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('toggles dark mode when theme button is clicked', () => {
    // Reset mock before test
    mockToggleTheme.mockClear();
    
    renderNavbar();
    
    // Find the theme toggle button
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeButton).toBeInTheDocument();
    
    // Click the theme toggle
    fireEvent.click(themeButton);
    
    // Verify the toggle function was called
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('navigates to categories page when categories link is clicked', () => {
    renderNavbar();
    // Find and click the categories link
    const categoriesLink = screen.getByRole('link', { name: /categories/i });
    fireEvent.click(categoriesLink);
    
    // Verify navigation to categories page
    expect(window.location.pathname).toBe('/categories');
  });

  it('navigates to category page when a category is clicked', async () => {
    // Mock the categories data
    const mockCategories = [
      { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
      { id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs' },
    ];

    // Set the mock implementation for this test
    mockUseCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    renderNavbar();
    
    // Open mobile menu to access categories in mobile view
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    
    // Find the categories section using the mobile menu structure
    const categoriesLink = screen.getByRole('link', { name: /categories/i });
    fireEvent.click(categoriesLink);
    
    // Check if category links are rendered in the mobile menu
    await waitFor(() => {
      mockCategories.forEach(category => {
        const categoryLink = screen.getByRole('link', { name: category.name });
        expect(categoryLink).toBeInTheDocument();
        expect(categoryLink).toHaveAttribute('href', `/categories/${category.slug}`);
      });
    });
  });

});
