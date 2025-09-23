import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Example products for demo purposes
const products = [
  { id: 'p1', name: 'Fresh Apples', image: '/src/assets/images/apple.jpg', price: 2.99, description: 'Crisp and juicy apples.' },
  { id: 'p2', name: 'Organic Spinach', image: '/src/assets/images/spinach.jpg', price: 1.99, description: 'Fresh organic spinach leaves.' },
  { id: 'p3', name: 'Carrots', image: '/src/assets/images/carrots.jpg', price: 1.49, description: 'Sweet and crunchy carrots.' },
  { id: 'p4', name: 'Bananas', image: '/src/assets/images/bananas.jpg', price: 1.29, description: 'Ripe bananas full of flavor.' },
];

const categoryMeta = {
  'fruits-vegetables': {
    name: 'Fruits & Vegetables',
    description: 'Shop the freshest produce, greens, and more.',
    image: '/src/assets/images/fruits-vegetables.jpg',
  },
  'dairy-eggs': {
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, eggs, and dairy products.',
    image: '/src/assets/images/dairy-eggs.jpg',
  },
  'meat-seafood': {
    name: 'Meat & Seafood',
    description: 'Quality meats and fresh seafood.',
    image: '/src/assets/images/meat-seafood.jpg',
  },
  'bakery': {
    name: 'Bakery',
    description: 'Breads, pastries, and baked goods.',
    image: '/src/assets/images/bakery.jpg',
  },
  'beverages': {
    name: 'Beverages',
    description: 'Juices, sodas, and drinks.',
    image: '/src/assets/images/beverages.jpg',
  },
};

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams();
  const meta = categoryMeta[slug as keyof typeof categoryMeta];

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
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-full mb-3 border-2 border-glass-200"
                onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Image'; }}
              />
              <h3 className="text-lg font-bold text-black mb-1 text-center">{product.name}</h3>
              <p className="text-glass-600 text-sm text-center mb-2">{product.description}</p>
              <span className="text-water-700 font-bold text-base mb-2">${product.price.toFixed(2)}</span>
              <button className="btn-water px-4 py-2 rounded-full mt-2">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
