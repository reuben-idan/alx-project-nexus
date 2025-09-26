import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchNewArrivals } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const NewArrivalsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchNewArrivals(24));
  }, [dispatch]);

  // Handle add to cart
  const handleAddToCart = useCallback((product: any) => {
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
        isNew: product.isNew
      },
      quantity: 1
    }));
    
    toast.success(`${product.name} added to cart`, {
      position: 'top-right',
      duration: 2000,
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 drop-shadow">New Arrivals</h1>
          <p className="text-xl mb-8">Discover the freshest products just added to our store!</p>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newArrivals.length > 0 ? (
            newArrivals.map(product => (
              <div key={product.id} className="relative group">
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  glassmorphic 
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No new arrivals found</h3>
              <p className="text-gray-500">Check back soon for the latest products!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
