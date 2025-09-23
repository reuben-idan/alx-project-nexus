import { useState } from 'react';
import { format } from 'date-fns';
import { X, Package, Truck, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

// Mock data - in a real app, this would come from an API
const mockOrders: Order[] = [
  {
    id: '#12345',
    date: new Date(2023, 10, 15),
    status: 'delivered',
    total: 187.94,
    items: [
      {
        id: '1',
        name: 'Organic Bananas',
        price: 0.99,
        quantity: 5,
        image: '/bananas.jpg'
      },
      {
        id: '2',
        name: 'Organic Gala Apples',
        price: 2.49,
        quantity: 3,
        image: '/apples.jpg'
      },
      {
        id: '3',
        name: 'Organic Free-Range Eggs',
        price: 4.99,
        quantity: 2,
        image: '/eggs.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999AA1234567890'
  },
  {
    id: '#12344',
    date: new Date(2023, 10, 10),
    status: 'shipped',
    total: 89.97,
    items: [
      {
        id: '4',
        name: 'Organic Chicken Breast',
        price: 8.99,
        quantity: 2,
        image: '/chicken.jpg'
      },
      {
        id: '5',
        name: 'Organic Brown Rice',
        price: 3.99,
        quantity: 1,
        image: '/rice.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999BB9876543210'
  },
  {
    id: '#12343',
    date: new Date(2023, 10, 5),
    status: 'processing',
    total: 32.97,
    items: [
      {
        id: '6',
        name: 'Organic Spinach',
        price: 2.99,
        quantity: 3,
        image: '/spinach.jpg'
      },
      {
        id: '7',
        name: 'Organic Strawberries',
        price: 4.99,
        quantity: 2,
        image: '/strawberries.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    paymentMethod: 'Visa ending in 4242'
  },
  {
    id: '#12342',
    date: new Date(2023, 9, 28),
    status: 'cancelled',
    total: 45.98,
    items: [
      {
        id: '8',
        name: 'Organic Avocados',
        price: 2.99,
        quantity: 4,
        image: '/avocados.jpg'
      },
      {
        id: '9',
        name: 'Organic Blueberries',
        price: 4.99,
        quantity: 2,
        image: '/blueberries.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    paymentMethod: 'Visa ending in 4242'
  }
];

const statusIcons = {
  processing: <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />,
  shipped: <Truck className="h-4 w-4 text-blue-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <X className="h-4 w-4 text-red-500" />
};

const statusColors = {
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Order History
          </h1>
          
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and download invoices.
          </p>
          
          {/* Status Filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 text-sm font-medium rounded-full ${selectedStatus === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Orders
            </button>
            {Object.entries(statusIcons).map(([status, icon]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as OrderStatus)}
                className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 ${selectedStatus === status ? statusColors[status as keyof typeof statusColors] : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {icon}
                {getStatusText(status as OrderStatus)}
                {status === 'processing' && ' (1)'}
                {status === 'shipped' && ' (1)'}
                {status === 'delivered' && ' (1)'}
                {status === 'cancelled' && ' (1)'}
              </button>
            ))}
          </div>
          
          {/* Orders List */}
          <div className="mt-8 space-y-8">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedStatus === 'all' 
                    ? 'You haven\'t placed any orders yet.' 
                    : `You don't have any ${selectedStatus} orders.`}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                        <time dateTime={order.date.toISOString()}>
                          {format(order.date, 'MMMM d, yyyy')}
                        </time>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        {expandedOrder === order.id ? 'Hide details' : 'View details'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {expandedOrder === order.id && (
                    <div className="px-4 py-6 sm:px-6 border-t border-gray-200">
                      <h4 className="sr-only">Items</h4>
                      <ul role="list" className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <li key={item.id} className="py-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/80';
                                  }}
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Order Summary */}
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900">Order Summary</h4>
                        <dl className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.total)}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Shipping</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {order.total > 50 ? 'Free' : '$5.99'}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Tax</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.total * 0.1)}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                            <dt className="text-base font-medium text-gray-900">Total</dt>
                            <dd className="text-base font-medium text-gray-900">
                              {formatCurrency(order.total + (order.total > 50 ? 0 : 5.99) + (order.total * 0.1))}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      {/* Shipping and Payment Info */}
                      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                          <address className="mt-2 not-italic text-sm text-gray-500">
                            {order.shippingAddress.name}<br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </address>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Information</h4>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>{order.paymentMethod}</p>
                            {order.status !== 'cancelled' && order.trackingNumber && (
                              <p className="mt-2">
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Actions */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        {order.status === 'delivered' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Leave a Review
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Track Package
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Buy it again
                          </Button>
                        )}
                        {order.status === 'cancelled' && (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Buy it again
                          </Button>
                        )}
                        <Button className="w-full sm:w-auto ml-auto">
                          View Invoice
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Empty State for No Orders */}
          {filteredOrders.length === 0 && selectedStatus === 'all' && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
          
          {/* Help Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">Need help with your order?</h2>
            <p className="mt-2 text-sm text-gray-500">
              Contact our customer service team for assistance with your order.
            </p>
            <div className="mt-4">
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
