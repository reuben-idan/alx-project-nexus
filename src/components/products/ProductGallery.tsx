import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string }[];
  className?: string;
}

const ProductGallery = ({ images, className = '' }: ProductGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Image */}
      <div 
        className="relative aspect-square w-full bg-white rounded-lg overflow-hidden cursor-zoom-in"
        onClick={openModal}
      >
        <img
          src={images[selectedImageIndex]?.url}
          alt={images[selectedImageIndex]?.alt || 'Product image'}
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  selectImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImageIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-gray-200'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full">
                <img
                  src={images[selectedImageIndex]?.url}
                  alt={images[selectedImageIndex]?.alt || 'Product image'}
                  className="max-w-full max-h-[80vh] mx-auto object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2 overflow-x-auto py-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectImage(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-white/50'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
