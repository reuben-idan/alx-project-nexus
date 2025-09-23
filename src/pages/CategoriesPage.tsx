import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', image: '/src/assets/images/fruits-vegetables.jpg', description: 'Fresh produce, greens, and more.' },
  { id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs', image: '/src/assets/images/dairy-eggs.jpg', description: 'Milk, cheese, eggs, and dairy products.' },
  { id: '3', name: 'Meat & Seafood', slug: 'meat-seafood', image: '/src/assets/images/meat-seafood.jpg', description: 'Quality meats and fresh seafood.' },
  { id: '4', name: 'Bakery', slug: 'bakery', image: '/src/assets/images/bakery.jpg', description: 'Breads, pastries, and baked goods.' },
  { id: '5', name: 'Beverages', slug: 'beverages', image: '/src/assets/images/beverages.jpg', description: 'Juices, sodas, and drinks.' },
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-glass-100 via-white/60 to-glass-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center glass-title">Shop by Category</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="glass-card rounded-3xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300 group"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-glass-200 group-hover:border-water-400"
                onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=Image'; }}
              />
              <h2 className="text-xl font-semibold mb-2 text-black text-center">{cat.name}</h2>
              <p className="text-glass-600 text-sm text-center mb-2">{cat.description}</p>
              <span className="inline-block mt-2 px-4 py-1 rounded-full bg-water-100 text-water-700 text-xs font-bold">Shop Now</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
