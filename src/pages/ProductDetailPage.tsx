import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ChevronLeft, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productsSlice';
import { AppDispatch, RootState } from '../store';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { product, loading, error } = useSelector((state: RootState) => ({
    product: state.products.currentProduct,
    loading: state.products.loading === 'pending',
    error: state.products.error,
  }));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.discount > 0 ? 
        product.price * (1 - product.discount / 100) : 
        product.price,
      image: product.images[0]?.url || '',
      quantity,
      stock: product.stock,
    }));
    
    toast.success('Added to cart', {
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };
  
  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }
  
  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;
  
  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-green-600 inline-flex items-center text-sm">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/products" className="text-gray-700 hover:text-green-600 ml-1 md:ml-2 text-sm font-medium">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-500 ml-1 md:ml-2 text-sm font-medium">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Product Section */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl overflow-hidden h-96 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img 
                  src={product.images[selectedImage]?.url} 
                  alt={product.name} 
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index 
                        ? 'border-green-500' 
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.name} ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="mt-8 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-full ${isWishlist ? 'text-red-500' : 'text-gray-400'}`}
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Heart className={`h-5 w-5 ${isWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-gray-400">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-green-600 font-medium">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="mt-4">
              {product.discount > 0 && (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice!)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <Badge variant="destructive" className="ml-3">
                    Save {product.discount}%
                  </Badge>
                </div>
              )}
              {!product.discount && (
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
              {product.unit && (
                <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
              )}
            </div>
            
            <p className="mt-4 text-gray-600">{product.shortDescription}</p>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-10 p-0 rounded-r-none"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="h-10 w-16 flex items-center justify-center border-t border-b border-gray-300">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-10 p-0 rounded-l-none"
                  onClick={handleIncrement}
                  disabled={!product.inStock || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-2 text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Buy Now
              </Button>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Free Delivery</h4>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-500">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
                    <p className="text-sm text-gray-500">100% secure payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                {product.description || 'No description available.'}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.brand || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.weight || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {product.dimensions || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-8">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {review.user.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-xs text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Write a review</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your email address will not be published. Required fields are marked *
                  </p>
                  
                  <form className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Your rating *
                      </label>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Your review *
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name *
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
