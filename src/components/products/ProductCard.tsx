import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  glassmorphic?: boolean;
}

const ProductCard = ({
  product,
  onAddToCart,
  glassmorphic = false,
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
        <img
          src={product.images?.[0]?.url || "/images/logo.png"}
          alt={product.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.png'; }}
          className="w-full h-48 object-cover rounded-t-2xl"
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
          className="font-bold text-lg text-glass-900 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p
          className="text-glass-600 text-sm truncate"
          title={product.description}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-green-700 text-xl">
            ${product.price.toFixed(2)}
          </span>
          <button
            className="btn-water px-3 py-2 rounded-full font-semibold shadow flex items-center gap-1 hover:scale-105 transition-transform"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
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
