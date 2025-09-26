import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/product';
import { selectProducts, selectLoading, selectError, fetchProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const DealsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'bestDiscount' | 'priceLowToHigh' | 'priceHighToLow' | 'bestRating'>('bestDiscount');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [addedToCart, setAddedToCart] = useState<{[key: string]: boolean}>({});
  
  // Handle add to cart
  const handleAddToCart = useCallback((product: Product) => {
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        description: product.description,
        stock: product.stock,
        rating: product.rating,
        category: product.category,
        isOnSale: product.isOnSale,
        originalPrice: product.originalPrice,
        discount: product.discount,
        isNew: product.isNew,
        slug: product.slug || `product-${product.id}`,
        shortDescription: product.shortDescription || (product.description ? product.description.substring(0, 100) + '...' : ''),
        reviewCount: product.reviewCount || 0,
        sku: product.sku || `SKU-${product.id}`,
        tags: product.tags || [],
        isFeatured: product.isFeatured || false,
        isInStock: product.isInStock !== undefined ? product.isInStock : true,
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString()
      },
      quantity: 1
    }));
    
    // Show visual feedback
    setAddedToCart(prev => ({
      ...prev,
      [product.id]: true
    }));
    
    // Show success toast
    toast.success(`${product.name} added to cart`, {
      position: 'top-right',
      duration: 2000,
    });
    
    // Reset feedback after animation
    setTimeout(() => {
      setAddedToCart(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  }, [dispatch]);

  const loadProducts = useCallback(async () => {
    try {
      // Fetch products on sale (which have discounts)
      await dispatch(fetchProducts({ onSale: true, limit: 100 }));
    } catch (err) {
      console.error('Error fetching discounted products:', err);
    }
  }, [dispatch]);

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Apply filters and sorting
  useEffect(() => {
    if (!products || products.length === 0) return;

    let result = [...products];

    // Apply sorting
    result.sort((a, b) => {
      const discountA = a.discount || 0;
      const discountB = b.discount || 0;
      
      switch (sortBy) {
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'priceHighToLow':
          return b.price - a.price;
        case 'bestRating':
          return (b.rating || 0) - (a.rating || 0);
        case 'bestDiscount':
        default:
          return discountB - discountA;
      }
    });
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, sortBy]);

  // Handle page change
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">Error loading deals: {error}</p>
        <Button onClick={loadProducts}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hot Deals & Discounts</h1>
        <p className="text-lg md:text-xl mb-6">
          Don't miss out on these amazing deals! Limited time offers on your favorite products.
        </p>
      </div>

      {/* Sort and Filter */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Deals for You</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="bestDiscount">Best Discount</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="bestRating">Best Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard 
                product={product}
                onAddToCart={handleAddToCart}
                showAddToCart={true}
                addedToCart={addedToCart[product.id] || false}
              />
            </div>
          ))}
        </div>
        
        {currentProducts.length > 0 && (
          <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Subscribe & Get 15% Off Your First Order!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
              Join our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions. 
              Plus, get 15% off your first order when you subscribe today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe & Save 15%
              </button>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
