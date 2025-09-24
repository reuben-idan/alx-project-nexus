import { Link } from 'react-router-dom';
import { X, Plus, Minus, ArrowLeft, ArrowRight, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../utils/format';
import { 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal
} from '../store/slices/cartSlice';
import { AppDispatch } from '../store';
import { Button } from '../components/ui/button';
import productsMock from '../mocks/products.mock.json';

type CartItemProps = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

const CartItem = ({
  id,
  productId,
  name,
  price,
  quantity,
  image,
  stock,
  onRemove,
  onUpdateQuantity
}: CartItemProps) => {
  const handleIncrement = () => {
    if (quantity < stock) {
      onUpdateQuantity(productId, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(productId, quantity - 1);
    }
  };

  // determine a product-specific image fallback (prefer real product images in /public/images)
  const product = productsMock.find((p: any) => p.id === productId || p.id === String(productId) || p.slug === productId);
  let productImage = image || product?.images?.[0]?.url || '/images/logo.png';
  // Correct known mismatches in the mock data: use the Sourdough and Premium Apple files from public/images
  if (product?.slug === 'sourdough-bread' || (product?.name && product.name.toLowerCase().includes('sourdough'))) {
    productImage = '/images/Sourdough Bread.png';
  }
  if (product?.slug === 'premium-apple' || (product?.name && product.name.toLowerCase().includes('premium apple'))) {
    productImage = '/images/Premium Apple.png';
  }

  return (
    <div className="flex items-center py-4 glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl">
      <div className="flex-shrink-0 h-24 w-24 overflow-hidden rounded-md border border-gray-200">
        <img
          src={productImage}
          alt={name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo.png'; }}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col sm:flex-row">
        <div className="flex-1">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="text-sm sm:text-base">
              <Link to={`/products/${id}`} className="hover:text-green-600">
                {name}
              </Link>
            </h3>
            <p className="ml-4">{formatCurrency(price)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">In Stock: {stock}</p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              type="button"
              onClick={handleDecrement}
              className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              disabled={quantity >= stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => onRemove(productId)}
            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 sm:mt-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  
  const shipping = total > 50 || total === 0 ? 0 : 5.99;
  const tax = total * 0.1; // 10% tax
  const orderTotal = total + shipping + tax;

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateCartItemQuantity({ itemId: productId, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="glass-card backdrop-blur-lg shadow-2xl p-8 rounded-xl text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-green-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <Button asChild className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                <Link to="/products" className="flex items-center justify-center">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
                   <div className="border-t border-b border-gray-200">
                     <div className="flex flex-col gap-4 py-4">
                       {items.map((item) => (
                         <CartItem
                           key={item.id}
                           {...item}
                           onRemove={handleRemoveItem}
                           onUpdateQuantity={handleUpdateQuantity}
                         />
                       ))}
                     </div>
                   </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearCart}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Clear cart
              </button>
            </div>
            <div className="mt-8">
              <Link to="/products" className="flex items-center text-sm font-medium text-green-600 hover:text-green-500">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </section>
          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-xl glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-2xl px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 border border-white/30"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order Summary</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">{formatCurrency(total)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">{formatCurrency(tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">{formatCurrency(orderTotal)}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 text-base font-medium shadow-lg"
              >
                <Link to="/checkout" className="flex w-full items-center justify-center">Checkout</Link>
              </Button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link to="/products" className="font-medium text-green-600 hover:text-green-500 flex items-center gap-1">
                  Continue Shopping<ArrowRight className="h-4 w-4" />
                </Link>
              </p>
            </div>
          </section>
        </div>
        {/* Features */}
        <div className="mt-16 border-t border-gray-200 py-8">
          <h2 className="sr-only">Why shop with us</h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Free Shipping',
                description: 'Free shipping on all orders over $50',
                icon: Truck,
              },
              {
                name: 'Secure Payment',
                description: '100% secure payment with SSL encryption',
                icon: Shield,
              },
              {
                name: 'Easy Returns',
                description: '30-day return policy',
                icon: RefreshCw,
              },
            ].map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full glass-card backdrop-blur-lg bg-gradient-to-br from-green-100/60 via-white/40 to-green-200/40 text-green-600 shadow-lg">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
