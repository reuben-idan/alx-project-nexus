import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;
  
  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };
  
  // Toggle wishlist
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };
  
  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
          <img
            src={product.images[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                New
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          <div 
            className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center space-x-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-2 rounded-full bg-white text-gray-800 shadow-md hover:bg-green-500 hover:text-white transition-colors ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Add to cart"
            >
              <ShoppingCart size={20} />
            </button>
            <button 
              onClick={toggleWishlist}
              className={`p-2 rounded-full bg-white text-gray-800 shadow-md hover:bg-red-500 hover:text-white transition-colors ${isWishlist ? 'bg-red-500 text-white' : ''}`}
              title={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={20} fill={isWishlist ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white text-gray-800 shadow-md hover:bg-blue-500 hover:text-white transition-colors"
              title="Quick view"
            >
              <Eye size={20} />
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          
          {/* Title */}
          <h3 className="font-medium text-gray-900 mt-1 mb-2 line-clamp-2 h-12">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews.length})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mt-3">
            <div>
              {product.discount > 0 ? (
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
              )}
              {product.unit && (
                <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-1 transition-colors ${
                product.inStock
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} />
              <span>{product.inStock ? 'Add' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </Link>
      
      {/* Quick View Modal - Would be implemented with a proper modal component */}
      {quickViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Quick View Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Quick View</h3>
                <button 
                  onClick={() => setQuickViewOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <img 
                    src={product.images[0]?.url || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-auto rounded"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={`${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews.length} reviews)
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    {product.discount > 0 ? (
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(product.price * (1 - product.discount / 100))}
                        </span>
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Save {product.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    {product.unit && (
                      <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <div className="flex border rounded-md overflow-hidden w-32">
                        <button 
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => {}}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          max={product.stock}
                          defaultValue="1"
                          className="w-full text-center focus:outline-none"
                        />
                        <button 
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => {}}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{product.stock} available</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={`px-6 py-3 rounded-md flex items-center justify-center space-x-2 transition-colors ${
                        product.inStock
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                    
                    <button
                      onClick={toggleWishlist}
                      className={`px-6 py-3 rounded-md flex items-center justify-center space-x-2 border ${
                        isWishlist 
                          ? 'bg-red-50 text-red-500 border-red-200'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <Heart size={18} fill={isWishlist ? 'currentColor' : 'none'} />
                      <span>{isWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
