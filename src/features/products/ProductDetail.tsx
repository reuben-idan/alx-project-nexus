import { useState } from 'react';
import { Star, Heart, Share2, Truck, Shield, Package, Check, Minus, Plus } from 'lucide-react';
import { Product } from '../../types/product';
import { Button } from '../../components/ui/button';
import ProductGallery from './ProductGallery';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onAddToWishlist: () => void;
  loading?: boolean;
}

const ProductDetail = ({
  product,
  onAddToCart,
  onAddToWishlist,
  loading = false,
}: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleVariantSelect = (variantId: string) => {
    const variant = product.variants?.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const price = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discount = selectedVariant?.discount || product.discount;
  const inStock = (selectedVariant?.stock || product.stock) > 0;
  const stock = selectedVariant?.stock || product.stock;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Gallery */}
      <div className="lg:sticky lg:top-4">
        <ProductGallery 
          images={product.images} 
          className="max-w-2xl mx-auto" 
        />
      </div>

      {/* Product Info */}
      <div>
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <span>Home</span> / <span>{product.category}</span> / <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Title and Rating */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`${star <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            {discount && discount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>
          {inStock ? (
            <div className="flex items-center mt-1 text-green-600 text-sm">
              <Check size={16} className="mr-1" />
              In Stock ({stock} available)
            </div>
          ) : (
            <div className="text-red-500 text-sm mt-1">Out of Stock</div>
          )}
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {product.variantType || 'Variant'}: <span className="font-normal">{selectedVariant?.name}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant.id)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    selectedVariant?.id === variant.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center">
            <button
              onClick={decrementQuantity}
              className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center border-t border-b border-gray-300 py-2 px-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              onClick={incrementQuantity}
              className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={quantity >= stock}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            onClick={() => onAddToCart(quantity)}
            disabled={!inStock || loading}
            className="flex-1 justify-center py-3 px-6"
            variant="primary"
            size="lg"
            isLoading={loading}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button
            onClick={onAddToWishlist}
            variant="outline"
            size="lg"
            className="flex-1 justify-center py-3 px-6"
          >
            <Heart size={20} className="mr-2" />
            Wishlist
          </Button>
        </div>

        {/* Delivery & Returns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start">
            <Truck size={20} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Free Shipping</h4>
              <p className="text-sm text-gray-500">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-start">
            <Package size={20} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Easy Returns</h4>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-start">
            <Shield size={20} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Secure Checkout</h4>
              <p className="text-sm text-gray-500">SSL encrypted</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
          <div className="prose prose-sm text-gray-500">
            {product.description || 'No description available.'}
          </div>
        </div>

        {/* Share */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-3">Share:</span>
            <div className="flex space-x-3">
              {['Facebook', 'Twitter', 'Pinterest', 'Email'].map((social) => (
                <button
                  key={social}
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                  aria-label={`Share on ${social}`}
                >
                  <Share2 size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
