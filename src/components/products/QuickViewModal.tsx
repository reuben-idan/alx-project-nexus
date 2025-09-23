import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const selectedVariant = product.variants?.[0] || null;
  const price = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const discount = originalPrice && price < originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isInStock = selectedVariant 
    ? (selectedVariant.stock ?? 0) > 0 
    : product.isInStock;

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, selectedVariant?.stock || product.stock || 10));
    setQuantity(newQuantity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <motion.div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-white">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Quick View</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 sm:flex gap-8">
              {/* Image Gallery */}
              <div className="w-full sm:w-1/2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[selectedImageIndex]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevImage();
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextImage();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                            aria-label="Next image"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No image available
                    </div>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square overflow-hidden rounded-md border-2 ${
                          index === selectedImageIndex 
                            ? 'border-primary' 
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="mt-6 sm:mt-0 sm:w-1/2">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 ${
                          rating < (product.rating || 0) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                        fill={rating < (product.rating || 0) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center">
                    {discount > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(price)}
                        </span>
                        <span className="ml-3 text-xl text-gray-500 line-through">
                          {formatCurrency(originalPrice)}
                        </span>
                        <span className="ml-3 bg-red-100 text-red-600 text-sm font-medium px-2.5 py-0.5 rounded">
                          -{discount}%
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(price)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        disabled={quantity >= (selectedVariant?.stock || product.stock || 10)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedVariant?.stock || product.stock || 0} available
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={!isInStock}
                    className={`w-full justify-center py-3 text-base ${isInStock ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsWishlist(!isWishlist)}
                    className="w-full justify-center py-3 text-base"
                  >
                    <Heart 
                      className={`mr-2 h-5 w-5 ${isWishlist ? 'fill-current text-red-500' : ''}`}
                      fill={isWishlist ? 'currentColor' : 'none'}
                    />
                    {isWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900">Details</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {product.category}
                    </p>
                    {selectedVariant?.sku && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">SKU:</span> {selectedVariant.sku}
                      </p>
                    )}
                    {product.brand && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Brand:</span> {product.brand}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickViewModal;
