import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchNewArrivals } from '../store/slices/productsSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const NewArrivalsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchNewArrivals(24));
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
              <ProductCard key={product.id} product={product} glassmorphic />
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
