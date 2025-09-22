import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Leaf } from 'lucide-react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fresh Groceries Delivered to Your Doorstep
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Shop the freshest produce, dairy, meats, and more with fast, reliable delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
              <Link
                to="/products?category=on-sale"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best grocery shopping experience with quality products and excellent service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Truck className="h-6 w-6" />}
              title="Fast Delivery"
              description="Get your groceries delivered in as little as 1 hour or schedule for later."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Quality Guaranteed"
              description="We handpick the freshest products and ensure they meet our high standards."
            />
            <FeatureCard
              icon={<Leaf className="h-6 w-6" />}
              title="Fresh & Organic"
              description="Wide selection of fresh, organic, and locally-sourced products."
            />
            <FeatureCard
              icon={<ShoppingBag className="h-6 w-6" />}
              title="Easy Returns"
              description="Not satisfied? We offer easy returns and refunds for all our products."
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our wide range of grocery categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Fruits & Vegetables', count: 128 },
              { name: 'Dairy & Eggs', count: 86 },
              { name: 'Meat & Seafood', count: 64 },
              { name: 'Bakery', count: 42 },
              { name: 'Beverages', count: 57 },
              { name: 'Snacks', count: 94 },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative overflow-hidden rounded-xl bg-gray-50 p-6 text-center hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                    <ShoppingBag className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of happy customers who trust us for their grocery needs.
          </p>
          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
