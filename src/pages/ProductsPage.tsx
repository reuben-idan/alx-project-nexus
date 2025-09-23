import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Product, ProductFilterOptions, ProductSortOption } from '../types/product';

// Components
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import ProductSort from '../components/products/ProductSort';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, pagination } = useSelector((state: RootState) => state.products);
  
  // State for filters and sorting
  const [filters, setFilters] = useState<Partial<ProductFilterOptions>>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStock: false,
    onSale: false,
  });
  
  const [sortBy, setSortBy] = useState<ProductSortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch products when filters, sort, or page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          sortOrder: sortBy.endsWith('-desc') ? 'desc' : 'asc',
          ...filters,
        };
        
        // Remove undefined values
        Object.keys(params).forEach(key => 
          params[key as keyof typeof params] === undefined && delete params[key as keyof typeof params]
        );
        
        await dispatch(fetchProducts(params));
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchData();
  }, [dispatch, currentPage, itemsPerPage, sortBy, filters]);

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      productId: product.id,
      product,
      quantity: 1,
      price: product.price,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ProductFilterOptions>) => {
    setFilters(prev => {
      const updatedFilters = {
        ...prev,
        ...newFilters,
      };
      return updatedFilters;
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (value: ProductSortOption) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading === 'pending' && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl mb-8">Discover our wide range of fresh groceries and household essentials</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing {pagination?.total ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
                {Math.min(currentPage * itemsPerPage, pagination?.total || 0)} of {pagination?.total || 0} products
              </p>
              <div className="w-full md:w-auto">
                <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
              </div>
            </div>

            {/* Loading State */}
            {loading === 'pending' && (
              <div className="flex justify-center my-12">
                <LoadingSpinner size="md" />
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* No Results */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                <button 
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  onClick={() => {
                    setFilters({});
                    setSortBy('featured');
                    setCurrentPage(1);
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
