import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

// Store
import type { AppDispatch, RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productsSlice';

// Components
import ProductDetail from '../components/products/ProductDetail';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/button';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get product data from Redux store
  const { currentProduct: product, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  
  // Handle adding product to cart
  const handleAddToCart = async (quantity: number) => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      
      // Calculate final price considering discount
      const finalPrice = product.discount && product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      
      // Dispatch add to cart action
      await dispatch(addToCart({
        product: {
          ...product,
          price: finalPrice, // Override with discounted price
        },
        quantity,
      }));
      
      // Show success message
      toast.success('Added to cart', {
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart', {
        description: 'There was an error adding the item to your cart. Please try again.',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Handle adding product to wishlist
  const handleAddToWishlist = async () => {
    if (!product) return;
    
    try {
      setIsAddingToWishlist(true);
      
      // In a real app, you would dispatch an action to add to wishlist
      // await dispatch(addToWishlist({ productId: product.id }));
      
      // Show success message
      toast.success('Added to wishlist', {
        description: `${product.name} has been added to your wishlist`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist', {
        description: 'There was an error adding the item to your wishlist. Please try again.',
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Show loading state
  if (loading && !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner className="mx-auto" />
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage 
          message={error || 'The requested product could not be found.'}
        />
        <div className="mt-4">
          <Button 
            onClick={() => navigate('/products')} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/products')} 
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        
        {/* Main Product Detail */}
        <ProductDetail 
          product={product} 
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          loading={isAddingToCart || isAddingToWishlist}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
