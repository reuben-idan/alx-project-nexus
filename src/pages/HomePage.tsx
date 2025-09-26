import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Leaf, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
};

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="floating-card group cursor-pointer"
  >
    <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="glass-title text-xl mb-3">{title}</h3>
    <p className="glass-text">{description}</p>
  </motion.div>
);

const CategoryCard = ({ name, count, gradient, delay = 0 }: { name: string; count: number; gradient: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link
      to={`/products?category=${name.toLowerCase().replace(/\s+/g, '-')}`}
      className="glass-card-hover glass-card group cursor-pointer h-full"
    >
      <div className="relative z-10 text-center">
        <div className={`mx-auto w-20 h-20 rounded-3xl ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <ShoppingBag className="h-10 w-10 text-white" />
        </div>
        <h3 className="glass-title text-lg mb-2">{name}</h3>
        <p className="text-glass-600 text-sm">{count} items</p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-center text-water-400">
            <span className="text-sm font-medium mr-2">Shop Now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-water-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-glass-300/10 rounded-full blur-3xl animate-pulse-glass"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-water-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="glass-title text-5xl md:text-7xl mb-8 leading-tight">
              Fresh Groceries
              <br />
              <span className="bg-gradient-to-r from-water-400 via-water-500 to-water-600 bg-clip-text text-transparent">
                Delivered
              </span>
            </h1>
            <p className="glass-subtitle text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Experience the future of grocery shopping with our premium selection of fresh, organic products delivered with care.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="btn-water inline-flex items-center text-lg font-semibold px-8 py-4"
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  Start Shopping
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/deals"
                  className="btn-outline-glass inline-flex items-center text-lg font-semibold px-8 py-4"
                >
                  <Star className="mr-3 h-6 w-6" />
                  View Deals
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-glass-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="glass-title text-4xl md:text-5xl mb-6">Why Choose Everything Grocery</h2>
            <p className="glass-subtitle text-xl max-w-3xl mx-auto">
              We're revolutionizing grocery shopping with premium quality, unmatched convenience, and cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Truck className="h-8 w-8 text-white" />}
              title="Lightning Fast"
              description="Same-day delivery with real-time tracking and flexible scheduling options."
              gradient="bg-gradient-to-r from-water-400 to-water-500"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Quality Assured"
              description="Every product is carefully selected and quality-checked before delivery."
              gradient="bg-gradient-to-r from-water-500 to-water-600"
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8 text-white" />}
              title="Fresh & Organic"
              description="Extensive selection of organic, locally-sourced, and sustainable products."
              gradient="bg-gradient-to-r from-water-600 to-water-700"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-8 w-8 text-white" />}
              title="Seamless Experience"
              description="Intuitive app design with personalized recommendations and easy returns."
              gradient="bg-gradient-to-r from-water-700 to-water-500"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="glass-title text-4xl md:text-5xl mb-6">Shop by Category</h2>
            <p className="glass-subtitle text-xl max-w-2xl mx-auto">
              Discover our curated selection across all grocery categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Fruits & Vegetables', count: 128, gradient: 'bg-gradient-to-br from-green-400 to-emerald-500' },
              { name: 'Dairy & Eggs', count: 86, gradient: 'bg-gradient-to-br from-blue-400 to-blue-500' },
              { name: 'Meat & Seafood', count: 64, gradient: 'bg-gradient-to-br from-red-400 to-pink-500' },
              { name: 'Bakery', count: 42, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
              { name: 'Beverages', count: 57, gradient: 'bg-gradient-to-br from-purple-400 to-purple-500' },
              { name: 'Snacks', count: 94, gradient: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
            ].map((category, index) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                count={category.count}
                gradient={category.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="floating-card text-center"
          >
            <h2 className="glass-title text-4xl md:text-5xl mb-6">Ready to Experience the Future?</h2>
            <p className="glass-subtitle text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have already transformed their grocery shopping experience.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth/register"
                className="btn-water inline-flex items-center text-xl font-bold px-12 py-6"
              >
                Create Your Account
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
