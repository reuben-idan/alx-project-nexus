import { Product } from '../../types/product';
import ProductCard from './ProductCard';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import type { AppDispatch } from '../../store/store';

interface ProductsGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}

const ProductsGrid = ({
  products,
  loading = false,
  error = null,
  emptyMessage = 'No products found.',
  className = '',
}: ProductsGridProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product,
      quantity: 1,
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse glass-card glass-card-hover backdrop-blur-xl shadow-glass rounded-2xl h-96" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart} 
          glassmorphic
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
