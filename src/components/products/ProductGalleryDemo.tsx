import React from 'react';
import ProductGallery from './ProductGallery';

const ProductGalleryDemo = () => {
  // Sample product images for testing
  const demoImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      alt: 'Product 1',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      alt: 'Product 2',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      alt: 'Product 3',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Product Gallery Demo</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductGallery 
          images={demoImages} 
          className="h-96"
          showThumbnails={true}
          showNavigationArrows={true}
          showZoomButtons={true}
          showFullscreenButton={true}
        />
      </div>
    </div>
  );
};

export default ProductGalleryDemo;
