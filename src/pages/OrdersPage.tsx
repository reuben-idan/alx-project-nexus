import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  X,
  Package,
  Truck,
  CheckCircle,
  RefreshCw,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  OrderStatus,
  progressOrderStatuses,
} from "../store/slices/ordersSlice";

const statusIcons = {
  processing: <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />,
  shipped: <Truck className="h-4 w-4 text-blue-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <X className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders?.orders || []);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Automatically progress order statuses on component mount and every minute
  useEffect(() => {
    dispatch(progressOrderStatuses());

    const interval = setInterval(() => {
      dispatch(progressOrderStatuses());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order: any) => order.status === selectedStatus);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusDescription = (status: OrderStatus, orderDate: Date) => {
    const now = new Date();
    const hoursSinceOrder =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    switch (status) {
      case "processing":
        return hoursSinceOrder < 1
          ? "Your order is being prepared and will be shipped soon."
          : "Your order is ready and will be shipped within the next hour.";
      case "shipped":
        return `Your order is on its way! Expected delivery in ${Math.max(1, Math.ceil(24 - hoursSinceOrder))} hours.`;
      case "delivered":
        return "Your order has been successfully delivered.";
      case "cancelled":
        return "This order has been cancelled.";
      default:
        return "";
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Order History
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and download
            invoices.
          </p>
          {/* Status Filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full glass-card backdrop-blur-lg shadow-lg ${selectedStatus === "all" ? "bg-green-100 text-green-800" : "bg-white/60 text-gray-800 hover:bg-gray-200"}`}
            >
              All Orders
            </button>
            {Object.entries(statusIcons).map(([status, icon]) => {
              const count = orders.filter(
                (order: any) => order.status === status
              ).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as OrderStatus)}
                  className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 glass-card backdrop-blur-lg shadow-lg ${selectedStatus === status ? statusColors[status as keyof typeof statusColors] : "bg-white/60 text-gray-800 hover:bg-gray-200"}`}
                >
                  {icon}
                  {getStatusText(status as OrderStatus)}
                  {count > 0 && ` (${count})`}
                </button>
              );
            })}
          </div>
          {/* Orders List */}
          <div className="mt-8 space-y-8">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No orders found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedStatus === "all"
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${selectedStatus} orders.`}
                </p>
                <div className="mt-6">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  >
                    <Link
                      to="/products"
                      className="flex items-center justify-center"
                    >
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              filteredOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="border border-white/30 rounded-xl overflow-hidden glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-white/60 via-green-50/40 to-green-100/40 px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order {order.id}
                        </h3>
                        <span
                          className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full glass-card backdrop-blur-lg shadow ${statusColors[order.status as keyof typeof statusColors]}`}
                        >
                          {
                            statusIcons[
                              order.status as keyof typeof statusIcons
                            ]
                          }
                          <span className="ml-1">
                            {getStatusText(order.status)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                        <time dateTime={order.date.toISOString()}>
                          {format(order.date, "MMMM d, yyyy")}
                        </time>
                      </div>
                    </div>

                    {/* Status Description */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {getStatusDescription(order.status, order.date)}
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"} •{" "}
                        {formatCurrency(
                          order.total +
                            (order.total > 50 ? 0 : 5.99) +
                            order.total * 0.1
                        )}
                      </p>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        {expandedOrder === order.id
                          ? "Hide details"
                          : "View details"}
                      </button>
                    </div>
                  </div>
                  {/* Order Items */}
                  {expandedOrder === order.id && (
                    <div className="px-4 py-6 sm:px-6 border-t border-white/30">
                      <h4 className="sr-only">Items</h4>
                      <ul role="list" className="divide-y divide-gray-200">
                        {order.items.map((item: any) => (
                          <li key={item.id} className="py-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-white/30 glass-card backdrop-blur-lg">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      "https://via.placeholder.com/80";
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
                      <div className="mt-6 border-t border-white/30 pt-6">
                        <h4 className="text-sm font-medium text-gray-900">
                          Order Summary
                        </h4>
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
                              {order.total > 50 ? "Free" : "$5.99"}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Tax</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.total * 0.1)}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between border-t border-white/30 pt-2">
                            <dt className="text-base font-medium text-gray-900">
                              Total
                            </dt>
                            <dd className="text-base font-medium text-gray-900">
                              {formatCurrency(
                                order.total +
                                  (order.total > 50 ? 0 : 5.99) +
                                  order.total * 0.1
                              )}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      {/* Order Progress Timeline */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Order Progress
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex items-center ${order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "processing" || order.status === "shipped" || order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="ml-2 text-sm font-medium">
                              Order Placed
                            </span>
                          </div>
                          <div
                            className={`flex-1 h-0.5 ${order.status === "shipped" || order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`flex items-center ${order.status === "shipped" || order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "shipped" || order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="ml-2 text-sm font-medium">
                              Shipped
                            </span>
                          </div>
                          <div
                            className={`flex-1 h-0.5 ${order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`flex items-center ${order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="ml-2 text-sm font-medium">
                              Delivered
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping and Payment Info */}
                      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Shipping Address
                          </h4>
                          <address className="mt-2 not-italic text-sm text-gray-500">
                            {order.shippingAddress.name}
                            <br />
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </address>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Information
                          </h4>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>{order.paymentMethod}</p>
                            {order.status !== "cancelled" &&
                              order.trackingNumber && (
                                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                  <p className="font-medium text-blue-900">
                                    Tracking Number
                                  </p>
                                  <p className="text-blue-700 font-mono">
                                    {order.trackingNumber}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      {/* Order Actions */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        {order.status === "delivered" && (
                          <>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              Leave a Review
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              Buy Again
                            </Button>
                          </>
                        )}
                        {order.status === "shipped" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            disabled
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Preparing Order
                          </Button>
                        )}
                        {order.status === "cancelled" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            Buy Again
                          </Button>
                        )}
                        <Button className="w-full sm:w-auto ml-auto bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
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
          {filteredOrders.length === 0 && selectedStatus === "all" && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet. Start shopping to see your
                orders here.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                >
                  <Link
                    to="/products"
                    className="flex items-center justify-center"
                  >
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {/* Help Section */}
          <div className="mt-12 border-t border-white/30 pt-8">
            <h2 className="text-lg font-medium text-gray-900">
              Need help with your order?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Contact our customer service team for assistance with your order.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                className="glass-card backdrop-blur-lg shadow"
              >
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
