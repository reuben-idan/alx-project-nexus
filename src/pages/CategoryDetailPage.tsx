import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { AppDispatch } from '../store';

import { Product } from '../types/product';

const products: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Apples',
    slug: 'fresh-apples',
    description: 'Crisp and juicy apples.',
    shortDescription: 'Crisp and juicy apples.',
    price: 2.99,
    originalPrice: 3.49,
    discount: 14,
    rating: 4.8,
    reviewCount: 125,
    stock: 100,
    sku: 'APP-001',
    category: 'Fruits & Vegetables',
    tags: ['fruit', 'apple', 'fresh'],
    images: [{ id: 'apple1', url: '/images/Fresh Apples.png', alt: 'Fresh Apples', isPrimary: true }],
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    isInStock: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'p2',
    name: 'Organic Spinach',
    slug: 'organic-spinach',
    description: 'Fresh organic spinach leaves.',
    shortDescription: 'Fresh organic spinach leaves.',
    price: 1.99,
    originalPrice: 2.29,
    discount: 13,
    rating: 4.7,
    reviewCount: 89,
    stock: 75,
    sku: 'SPN-002',
    category: 'Fruits & Vegetables',
    tags: ['vegetable', 'spinach', 'organic'],
    images: [{ id: 'spinach1', url: '/images/Organic Spinach.png', alt: 'Organic Spinach', isPrimary: true }],
    isFeatured: false,
    isNew: true,
    isOnSale: true,
    isInStock: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'p3',
    name: 'Carrots',
    slug: 'carrots',
    description: 'Sweet and crunchy carrots.',
    shortDescription: 'Sweet and crunchy carrots.',
    price: 1.49,
    originalPrice: 1.79,
    discount: 17,
    rating: 4.6,
    reviewCount: 67,
    stock: 150,
    sku: 'CRT-003',
    category: 'Fruits & Vegetables',
    tags: ['vegetable', 'carrot', 'root'],
    images: [{ id: 'carrot1', url: '/images/Carrots.png', alt: 'Carrots', isPrimary: true }],
    isFeatured: false,
    isNew: false,
    isOnSale: true,
    isInStock: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'p4',
    name: 'Bananas',
    slug: 'bananas',
    description: 'Ripe bananas full of flavor.',
    shortDescription: 'Ripe bananas full of flavor.',
    price: 1.29,
    originalPrice: 1.59,
    discount: 19,
    rating: 4.9,
    reviewCount: 203,
    stock: 200,
    sku: 'BAN-004',
    category: 'Fruits & Vegetables',
    tags: ['fruit', 'banana', 'tropical'],
    images: [{ id: 'banana1', url: '/images/Bananas.png', alt: 'Bananas', isPrimary: true }],
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    isInStock: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
];

const categoryMeta = {
  'fruits-vegetables': {
    name: 'Fruits & Vegetables',
    description: 'Shop the freshest produce, greens, and more.',
    image: '/images/Fruits & Vegetables.png',
  },
  'dairy-eggs': {
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, eggs, and dairy products.',
    image: '/images/milk.png',
  },
  'meat-seafood': {
    name: 'Meat & Seafood',
    description: 'Quality meats and fresh seafood.',
    image: '/images/salmon.png',
  },
  'bakery': {
    name: 'Bakery',
    description: 'Breads, pastries, and baked goods.',
    image: '/images/Bakery.png',
  },
  'beverages': {
    name: 'Beverages',
    description: 'Juices, sodas, and drinks.',
    image: '/images/orange-juice.png',
  },
};

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const meta = categoryMeta[slug as keyof typeof categoryMeta];

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glass-100 via-white/60 to-glass-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center mb-10 gap-8">
          <img
            src={meta?.image}
            alt={meta?.name}
            className="w-32 h-32 object-cover rounded-2xl shadow-lg border-4 border-glass-200"
            onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128?text=Image'; }}
          />
          <div>
            <h1 className="text-4xl font-bold glass-title mb-2">{meta?.name || 'Category'}</h1>
            <p className="text-glass-700 text-lg mb-2">{meta?.description}</p>
            <Link to="/categories" className="text-water-600 hover:underline text-sm">← Back to Categories</Link>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-black">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <img
                src={product.images[0]?.url || '/images/logo.png'}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-full mb-3 border-2 border-glass-200"
                onError={e => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
              />
              <h3 className="text-lg font-bold text-black mb-1 text-center">{product.name}</h3>
              <p className="text-glass-600 text-sm text-center mb-2">{product.shortDescription}</p>
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-water-700 font-bold text-base">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-500 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <button
                className="btn-water px-4 py-2 rounded-full mt-2"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
