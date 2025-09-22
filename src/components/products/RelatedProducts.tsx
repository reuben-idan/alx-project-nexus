import { Product } from '../../types/product';
import ProductsGrid from './ProductsGrid';

export interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
  title?: string;
  maxItems?: number;
  loading?: boolean;
  error?: string | null;
}

const RelatedProducts = ({
  products,
  currentProductId,
  title = 'You May Also Like',
  maxItems = 5,
  loading = false,
  error = null,
}: RelatedProductsProps) => {
  // Filter out the current product and limit the number of related products
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, maxItems);

  if (relatedProducts.length === 0 && !loading) {
    return null; // Don't render anything if there are no related products
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <ProductsGrid 
        products={relatedProducts}
        loading={loading}
        error={error}
        emptyMessage="No related products found."
        className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      />
    </section>
  );
};

export default RelatedProducts;
