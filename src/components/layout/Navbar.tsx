import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleCart, toggleSearch, setTheme } from '../../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
// import { searchProducts } from '../../features/products/productsSlice';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  // Search functionality will be implemented later
  const [searchQuery] = useState('');

  // Mock categories - replace with actual API call
  const categories: Category[] = [
    { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
    { id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs' },
    { id: '3', name: 'Meat & Seafood', slug: 'meat-seafood' },
    { id: '4', name: 'Bakery', slug: 'bakery' },
    { id: '5', name: 'Beverages', slug: 'beverages' },
  ];

  const { cart } = useSelector((state: RootState) => ({
    cart: state.cart,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle search with debounce
  useEffect(() => {
    if (debouncedSearchQuery) {
      // dispatch(searchProducts(debouncedSearchQuery));
      console.log('Searching for:', debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-white dark:bg-gray-900'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Everything Grocery
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                  onMouseEnter={() => link.children && setIsCategoriesOpen(true)}
                  onMouseLeave={() => link.children && setIsCategoriesOpen(false)}
                >
                  <div className="flex items-center">
                    {link.name}
                    {link.children && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </Link>

                {/* Dropdown Menu */}
                {link.children && link.children.length > 0 && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <div className="py-1">
                      {link.children.map((category) => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
                      <Link
                        to="/categories"
                        className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-800"
                      >
                        View all categories
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
              onClick={() => dispatch(toggleSearch())}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none relative"
              onClick={() => dispatch(toggleCart())}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>

            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                dispatch(setTheme(isDark ? 'light' : 'dark'));
              }}
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="dark:hidden">🌞</span>
                <span className="hidden dark:inline">🌙</span>
              </div>
            </button>

            <Link
              to="/account"
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
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
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.children && link.children.length > 0 && (
                    <div className="pl-4">
                      {link.children.slice(0, 5).map((category) => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.slug}`}
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link
                  to="/account"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                >
                  <User className="mr-3 h-6 w-6" />
                  My Account
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                >
                  <div className="relative mr-3">
                    <ShoppingCart className="h-6 w-6" />
                    {cart.items && cart.items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.items.length}
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
