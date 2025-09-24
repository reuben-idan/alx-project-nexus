import React, { useState, useEffect } from 'react';
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


  const cartItems = useSelector(selectCartItems);
  const { isAuthenticated, logout } = useAuth();

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
  ];

  return (
    <header className="glass-nav relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="glass-card rounded-2xl p-1 mr-3 group-hover:scale-105 transition-transform duration-300 flex items-center">
                <Logo className="h-8 w-auto rounded-lg object-contain" />
              </div>
              <span className="glass-title text-xl">Everything Grocery</span>
            </Link>
          </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      to={link.path}
                      className={`glass-nav-item ${location.pathname === link.path ? 'glass-nav-item-active' : ''}`}
                    >
                      <div className="flex items-center">
                        {link.name}
                        {link.children && (
                          <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                        )}
                      </div>
                    </Link>

                    {/* Dropdown Menu removed as requested */}
                  </div>
                );
              })}
            </nav>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300"
              onClick={() => {
                dispatch(toggleSearch());
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.location.href = '/products';
              }}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="glass-card rounded-2xl p-3 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300 relative"
              onClick={() => {
                dispatch(toggleCart());
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.location.href = '/cart';
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems && cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-water-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 focus:ring-2 focus:ring-water-500 transition-all duration-300"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                dispatch(setTheme(isDark ? 'light' : 'dark'));
              }}
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-lg">🌙</span>
              </div>
            </motion.button>


            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300 ml-2"
                  aria-label="Sign Out"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300"
                aria-label="Login/Register"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass-card rounded-2xl p-2 text-glass-600 hover:text-white hover:bg-glass-300/20 transition-all duration-300"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-glass-200/20 backdrop-blur-2xl border-t border-glass-300/20 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'bg-glass-400/30 text-white shadow-glass-sm'
                        : 'text-glass-600 hover:text-white hover:bg-glass-300/20'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.children && link.children.length > 0 && (
                    <div className="pl-4 mt-2 space-y-1">
                      {link.children.slice(0, 5).map((category) => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.slug}`}
                          className="block px-4 py-2 text-sm text-glass-600 hover:text-white hover:bg-glass-300/20 rounded-2xl transition-all duration-300"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-glass-300/20 mt-4">

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-base font-medium text-glass-600 hover:text-white hover:bg-glass-300/20 rounded-2xl transition-all duration-300"
                    >
                      <User className="mr-3 h-6 w-6" />
                      My Account
                    </Link>
                    <button
                      className="flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 mt-2"
                      onClick={logout}
                    >
                      <LogOut className="mr-3 h-6 w-6" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center px-4 py-3 text-base font-medium text-glass-600 hover:text-white hover:bg-glass-300/20 rounded-2xl transition-all duration-300"
                  >
                    <User className="mr-3 h-6 w-6" />
                    Login / Register
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="flex items-center px-4 py-3 text-base font-medium text-glass-600 hover:text-white hover:bg-glass-300/20 rounded-2xl transition-all duration-300"
                >
                  <div className="relative mr-3">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems && cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-water-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                  Shopping Cart
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
