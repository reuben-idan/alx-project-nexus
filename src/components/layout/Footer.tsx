import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin, CreditCard, Truck, Shield, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', path: '/products' },
        { name: 'Featured', path: '/featured' },
        { name: 'New Arrivals', path: '/new-arrivals' },
        { name: 'Deals', path: '/deals' },
        { name: 'Gift Cards', path: '/gift-cards' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { name: 'Fruits & Vegetables', path: '/category/fruits-vegetables' },
        { name: 'Dairy & Eggs', path: '/category/dairy-eggs' },
        { name: 'Meat & Seafood', path: '/category/meat-seafood' },
        { name: 'Bakery', path: '/category/bakery' },
        { name: 'Beverages', path: '/category/beverages' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
        { name: 'Press', path: '/press' },
        { name: 'Contact Us', path: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Track Order', path: '/track-order' },
        { name: 'Returns & Refunds', path: '/returns' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'FAQ', path: '/faq' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On all orders over $50',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: '100% secure payment',
    },
    {
      icon: Shield,
      title: 'Quality Products',
      description: 'Direct from farmers',
    },
    {
      icon: HelpCircle,
      title: '24/7 Support',
      description: 'Dedicated support',
    },
  ];

  return (
    <footer className="bg-ios-background-secondary border-t border-ios-gray-5">
      {/* Features */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-ios-blue/10 p-3 rounded-full text-ios-blue">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ios-label-primary">{feature.title}</h3>
                  <p className="text-sm text-ios-label-secondary">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-ios-blue">Everything Grocery</span>
            </div>
            <p className="mt-4 text-sm text-ios-label-secondary">
              Your one-stop shop for fresh groceries delivered to your doorstep. We source the finest products to bring you quality and convenience.
            </p>
            <div className="mt-6 flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="text-ios-label-secondary hover:text-ios-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ios-label-primary tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-ios-label-secondary hover:text-ios-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-ios-gray-5">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link to="/privacy" className="text-sm text-ios-label-secondary hover:text-ios-blue">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-ios-label-secondary hover:text-ios-blue">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-ios-label-secondary hover:text-ios-blue">
                Cookie Policy
              </Link>
            </div>
            <p className="mt-4 text-sm text-ios-label-secondary md:mt-0 md:order-1">
              &copy; {currentYear} Everything Grocery. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 text-xs text-ios-label-tertiary">
            <p>Prices and offers are subject to change. © {currentYear} Everything Grocery. All rights reserved.</p>
            <p className="mt-1">Everything Grocery is a demo project built for educational purposes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
