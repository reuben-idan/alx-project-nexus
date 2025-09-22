import { Product } from '../../types/product';
import { Carousel } from '../ui/Carousel';
import ProductCard from './ProductCard';

export interface FeaturedProductsProps {
  products: Product[];
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  onAddToCart: (product: Product) => void;
}

const FeaturedProducts = ({
  products,
  title,
  subtitle,
  loading = false,
  error = null,
  onAddToCart,
}: FeaturedProductsProps) => {
  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-100 rounded-xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Error loading featured products: {error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't render anything if there are no featured products
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <Carousel 
          items={products} 
          renderItem={(product) => (
            <div key={product.id} className="px-2">
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            </div>
          )}
          className="py-4"
          itemClassName="w-64"
          showDots={true}
          showArrows={true}
        />
      </div>
    </section>
  );
};

export default FeaturedProducts;
