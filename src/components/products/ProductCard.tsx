import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  glassmorphic?: boolean;
  showAddToCart?: boolean;
  addedToCart?: boolean;
}

const ProductCard = ({
  product,
  onAddToCart,
  glassmorphic = false,
  showAddToCart = true,
  addedToCart = false,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product);
  };

  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
    // TODO: Integrate with wishlist backend
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${glassmorphic ? "backdrop-blur-xl" : ""}`}
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative group">
        {/* Product Labels */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          {product.isOnSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              SALE
            </span>
          )}
          {!product.isInStock && (
            <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              OUT OF STOCK
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              NEW
            </span>
          )}
        </div>
        
        <img
          src={product.images?.[0]?.url || "/images/logo.png"}
          alt={product.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.png'; }}
          className="w-full h-48 object-cover rounded-t-2xl group-hover:opacity-90 transition-opacity"
        />
        <>
          <button
            className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-green-100 transition-colors"
            onClick={handleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}`}
            />
          </button>
          <button
            className="absolute bottom-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-green-100 transition-colors"
            onClick={() => setShowQuickView(true)}
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5 text-green-500" />
          </button>
        </>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3
          className="font-bold text-lg text-gray-900 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p
          className="text-gray-600 text-sm line-clamp-2 h-10 overflow-hidden"
          title={product.description}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className={`font-bold text-xl ${product.isOnSale ? 'text-red-600' : 'text-green-700'}`}>
              ${product.price.toFixed(2)}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </span>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
            </div>
          </div>
          {showAddToCart && (
            <button
              className={`px-4 py-2 rounded-full font-semibold shadow flex items-center gap-1 transition-all duration-300 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              }`}
              onClick={handleAddToCart}
              disabled={addedToCart}
              aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
            >
              {addedToCart ? (
                <>
                  <svg className="animate-check w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      {/* Quick View Modal */}
      {showQuickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-glass-400 hover:text-red-500"
              onClick={() => setShowQuickView(false)}
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={product.images?.[0]?.url || "/images/logo.png"}
              alt={product.name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.png'; }}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-glass-900">
              {product.name}
            </h2>
            <p className="text-glass-600 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-700 text-xl">
                ${product.price.toFixed(2)}
              </span>
              <button
                className="btn-water px-4 py-2 rounded-full font-semibold shadow flex items-center gap-1"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
