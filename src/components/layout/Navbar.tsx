import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectCartItemsCount } from '../../features/cart/cartSelectors';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppDispatch } from '../../store';
import { searchProducts } from '../../features/products/productsSlice';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const dispatch = useAppDispatch();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle search with debounce
  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchProducts(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, dispatch]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-ios-blue">
              Everything Grocery
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-ios-blue border-b-2 border-ios-blue'
                    : 'text-ios-label-primary hover:text-ios-blue transition-colors'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-ios-label-tertiary" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-ios-gray-4 rounded-full bg-ios-gray-6 text-ios-label-primary placeholder-ios-label-tertiary focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/account"
              className="p-2 rounded-full text-ios-label-primary hover:bg-ios-gray-6 transition-colors"
              aria-label="Account"
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full text-ios-label-primary hover:bg-ios-gray-6 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ios-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-ios-label-primary hover:bg-ios-gray-6 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-ios-gray-5">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-4 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-ios-label-tertiary" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-ios-gray-4 rounded-full bg-ios-gray-6 text-ios-label-primary placeholder-ios-label-tertiary focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === link.path
                    ? 'bg-ios-blue text-white'
                    : 'text-ios-label-primary hover:bg-ios-gray-6'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-ios-gray-5">
              <Link
                to="/account"
                className="flex items-center px-3 py-2 text-base font-medium text-ios-label-primary hover:bg-ios-gray-6 rounded-md"
              >
                <User className="mr-3 h-6 w-6" />
                My Account
              </Link>
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 text-base font-medium text-ios-label-primary hover:bg-ios-gray-6 rounded-md"
              >
                <div className="relative mr-3">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-ios-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                Shopping Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
