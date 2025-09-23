import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { ShoppingCart, Heart, Eye, Star, Tag, Check, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { motion } from 'framer-motion';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variantId?: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Use the first variant if available, otherwise use the product itself
  const selectedVariant = product.variants?.[0] || null;
  
  // State management
  const [isWishlist, setIsWishlist] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const price = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const discount = originalPrice && price < originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isInStock = selectedVariant 
    ? (selectedVariant.stock ?? 0) > 0 
    : product.isInStock;

  // Product rating
  const averageRating = product.rating || 0;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product, selectedVariant?.id);
  };

  // Handle quantity changes (commented out as it's not currently used)
  // const handleQuantityChange = (newQuantity: number) => {
  //   if (newQuantity < 1) return;
  //   const maxQuantity = selectedVariant?.stock ?? product.stock ?? 0;
  //   setQuantity(Math.min(newQuantity, maxQuantity));
  // };

  // Toggle wishlist
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  // Get product image
  const getProductImage = () => {
    if (product.images?.length > 0) {
      return product.images[0].url;
    }
    return '/placeholder-product.jpg';
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Handle variant selection (commented out as it's not currently used)
  // const handleVariantSelect = (variant: ProductVariant) => {
  //   setSelectedVariant(variant);
  //   setQuantity(1);
  // };

  // Handle add to cart from quick view
  const handleAddToCartFromQuickView = (product: Product) => {
    onAddToCart(product, selectedVariant?.id);
    // You could add a toast notification here
  };

  // Check if product has any special tags
  const hasTags = product.tags && product.tags.length > 0;
  const isNew = product.createdAt && 
    (new Date().getTime() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000);

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group h-full flex flex-col"
      >
        <div className="relative group flex-1 flex flex-col">
          {/* Product Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}% OFF
              </span>
            )}
            {isNew && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </span>
            )}
            {hasTags && product.tags.some(tag => tag.toLowerCase() === 'bestseller') && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Bestseller
              </span>
            )}
          </div>

          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 relative">
            <img
              src={getProductImage()}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
            
            {/* Quick actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
              <button
                onClick={handleQuickView}
                className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
                title="Quick view"
                aria-label="Quick view"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full ${isWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'} hover:scale-110 transition-all duration-200 shadow-md`}
                title={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="h-5 w-5" fill={isWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            {/* Out of stock overlay */}
            {!isInStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          {/* Product info */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                    <Link to={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-1">
                    <Link 
                      to={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {product.category}
                    </Link>
                  </div>
                </div>
                <div className="text-right">
                  {originalPrice && originalPrice > price ? (
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(price)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                      Save {discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Rating and Review Count */}
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-3.5 w-3.5 ${rating < averageRating ? 'text-yellow-400' : 'text-gray-200'}`}
                      fill={rating < averageRating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                {product.reviewCount > 0 && (
                  <a 
                    href={`/products/${product.slug}#reviews`}
                    className="ml-1.5 text-xs text-gray-500 hover:underline"
                  >
                    ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                  </a>
                )}
              </div>

              {/* Product Tags */}
              {hasTags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{product.tags.length - 2} more</span>
                  )}
                </div>
              )}

              {/* Shipping Info */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Truck className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span>Free shipping</span>
                </div>
                {product.stock && product.stock > 0 && (
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    <span>In Stock ({product.stock} units)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to cart button */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`w-full flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isInStock
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={16} className="mr-2" />
                <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
          
          {/* Quick View Modal */}
          <QuickViewModal
            product={product}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
            onAddToCart={handleAddToCartFromQuickView}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
