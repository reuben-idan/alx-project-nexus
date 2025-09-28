import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { toggleCart, toggleSearch, setTheme } from '../../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../features/auth/hooks/useAuth';

// Memoized selector to prevent unnecessary re-renders
const selectCartItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => items
);

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface NavLink {
  name: string;
  path: string;
  children?: Category[];
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock categories - replace with actual API call
  const categories: Category[] = [
    { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
    { id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs' },
    { id: '3', name: 'Meat & Seafood', slug: 'meat-seafood' },
    { id: '4', name: 'Bakery', slug: 'bakery' },
    { id: '5', name: 'Beverages', slug: 'beverages' },
  ];


  const cartItems = useSelector(selectCartItems) || [];
  const { isAuthenticated, logout } = useAuth();
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const dispatch = useDispatch();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    {
      name: 'Categories',
      path: '/categories',
      children: categories,
    },
    { name: 'Deals', path: '/deals' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Orders', path: '/orders' },
  ];

  // Handle click outside mobile menu
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="glass-nav fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
            
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center group"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Home"
              >
                <div className="glass-card rounded-2xl p-1 mr-3 group-hover:scale-105 transition-transform duration-300 flex items-center">
                  <Logo className="h-8 w-auto rounded-lg object-contain" />
                </div>
                <span className="glass-title text-xl hidden sm:inline">Everything Grocery</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`glass-nav-item px-4 py-2 ${
                    location.pathname === link.path ? 'glass-nav-item-active' : ''
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  <div className="flex items-center">
                    {link.name}
                    {link.children && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            <Link to="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300"
                aria-label="Search products"
                onClick={() => {
                  // Optional: Add any search-specific logic here if needed
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <Search className="h-5 w-5" />
              </motion.div>
            </Link>

            <Link
              to="/cart"
              className="relative"
              aria-label={`Shopping Cart ${cartItemCount > 0 ? `(${cartItemCount} items)` : ''}`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-water-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300 hidden sm:block"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                dispatch(setTheme(isDark ? 'light' : 'dark'));
              }}
              aria-label={document.documentElement.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-lg">🌙</span>
              </div>
            </motion.button>

            {isAuthenticated ? (
              <>
<Link
                  to="/orders"
                  className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300 hidden md:block"
                  aria-label="My Orders"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 8 9 8 7"></polyline>
                    </svg>
                  </motion.div>
                </Link>
                <Link
                  to="/profile"
                  className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300 hidden md:block"
                  aria-label="My Account"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <User className="h-5 w-5" />
                  </motion.div>
n                </Link>
                <button
                  onClick={logout}
                  className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300 hidden md:block"
                  aria-label="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300 hidden md:block"
                aria-label="Login or Register"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 pt-16"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 w-full max-h-[calc(100vh-4rem)] overflow-y-auto rounded-b-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              ref={menuRef}
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.path} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-lg ${
                        location.pathname === link.path
                          ? 'bg-water-50 text-water-600 dark:bg-water-900/30 dark:text-water-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50'
                      }`}
                      aria-current={location.pathname === link.path ? 'page' : undefined}
                    >
                      <div className="flex items-center justify-between">
                        {link.name}
                        {link.children && (
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        )}
                      </div>
                    </Link>
                    
                    {link.children && link.children.length > 0 && (
                      <div className="pl-4 pb-2 space-y-1">
                        {link.children.map((category) => (
                          <Link
                            key={category.id}
                            to={`/categories/${category.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-2 text-sm rounded-lg ${
                              location.pathname === `/categories/${category.slug}`
                                ? 'bg-water-50 text-water-600 dark:bg-water-900/30 dark:text-water-400'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                            }`}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-2 space-y-1">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${
                          location.pathname === '/profile'
                            ? 'bg-water-50 text-water-600 dark:bg-water-900/30 dark:text-water-400'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <User className="mr-3 h-5 w-5 flex-shrink-0" />
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${
                        location.pathname === '/auth'
                          ? 'bg-water-50 text-water-600 dark:bg-water-900/30 dark:text-water-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <User className="mr-3 h-5 w-5 flex-shrink-0" />
                      Login / Register
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${
                      location.pathname === '/cart'
                        ? 'bg-water-50 text-water-600 dark:bg-water-900/30 dark:text-water-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="relative mr-3">
                      <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                      {cartItems && cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-water-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                    Shopping Cart
                  </Link>

                  <button
                    onClick={() => {
                      const isDark = document.documentElement.classList.contains('dark');
                      dispatch(setTheme(isDark ? 'light' : 'dark'));
                    }}
                    className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50 rounded-lg"
                  >
                    <span className="mr-3 text-lg">
                      {document.documentElement.classList.contains('dark') ? '☀️' : '🌙'}
                    </span>
                    {document.documentElement.classList.contains('dark') ? 'Light' : 'Dark'} Mode
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
