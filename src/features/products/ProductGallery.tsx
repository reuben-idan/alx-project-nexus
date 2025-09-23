import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

// Types
type ImageType = {
  id: string;
  url: string;
  alt?: string;
  placeholder?: string;
};

export interface ProductGalleryProps {
  images: ImageType[];
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  interval?: number;
  showFullscreenButton?: boolean;
  showZoomButtons?: boolean;
  showNavigationArrows?: boolean;
  onImageClick?: (index: number) => void;
}

// Animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  className = '',
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
  showFullscreenButton = true,
  showZoomButtons = true,
  showNavigationArrows = true,
  onImageClick,
}) => {
  const [[currentIndex, direction], setCurrentIndex] = useState<[number, number]>([0, 0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navigation functions
  const paginate = useCallback((newDirection: number) => {
    if (images.length <= 1) return;
    
    setCurrentIndex(([current]) => {
      let nextIndex = current + newDirection;
      
      if (nextIndex >= images.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = images.length - 1;
      }
      
      return [nextIndex, newDirection];
    });
    
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  // Handle swipe gestures
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  }, [paginate]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, []);

  // Handle zoom
  const handleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(prev => !prev);
    if (onImageClick) onImageClick(currentIndex);
    if (isZoomed) {
      setPosition({ x: 0, y: 0 });
    }
  }, [currentIndex, isZoomed, onImageClick]);

  // Handle pan when zoomed
  const handlePan = useCallback((_: any, info: any) => {
    if (!isZoomed) return;
    
    setPosition(prev => {
      const newX = prev.x + info.delta.x;
      const newY = prev.y + info.delta.y;
      
      if (imageRef.current && containerRef.current) {
        const imageRect = imageRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);
        
        return {
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY),
        };
      }
      
      return prev;
    });
  }, [isZoomed]);

  // Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => ({
      ...prev,
      [index]: true
    }));
    setIsLoading(false);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          setIsZoomed(false);
          setPosition({ x: 0, y: 0 });
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          paginate(-1);
          break;
        case 'ArrowRight':
          paginate(1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'z':
        case 'Z':
          setIsZoomed(!isZoomed);
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, paginate, toggleFullscreen]);

  // Don't render if no images
  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'
      }`}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={isZoomed ? 'x' : false}
            dragConstraints={isZoomed ? { left: 0, right: 0 } : undefined}
            onDragEnd={handleDragEnd}
            onPan={handlePan}
            className="w-full h-full"
          >
            <motion.img
              ref={imageRef}
              src={currentImage.url}
              alt={currentImage.alt || 'Product image'}
              className={`w-full h-full object-contain ${
                isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
              onClick={handleZoom}
              style={{
                x: position.x,
                y: position.y,
                scale: isZoomed ? 2 : 1,
                transformOrigin: 'center center',
              }}
              onLoad={() => handleImageLoad(currentIndex)}
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded[currentIndex] ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {hasMultipleImages && showNavigationArrows && !isZoomed && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoom and fullscreen controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          {showZoomButtons && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
          )}
          {showFullscreenButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Image counter */}
        {hasMultipleImages && !isZoomed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && hasMultipleImages && !isZoomed && (
        <div className="flex justify-center p-2 space-x-2 bg-white border-t border-gray-200 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={(e) => {
                e.stopPropagation();
                const direction = index > currentIndex ? 1 : -1;
                setCurrentIndex([index, direction]);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-300' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
