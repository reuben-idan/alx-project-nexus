import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

const Carousel = <T,>({
  items,
  renderItem,
  className = '',
  itemClassName = '',
  showDots = true,
  showArrows = true,
  autoPlay = false,
  interval = 5000,
  loop = true,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(1);

  // Calculate number of visible items based on container width
  useEffect(() => {
    const updateDimensions = () => {
      if (carouselRef.current && itemRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        const newVisibleItems = Math.max(1, Math.floor(containerWidth / (itemRef.current.offsetWidth || 200)));
        
        setVisibleItems(newVisibleItems);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [items.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, currentIndex, isDragging, interval, items.length]);

  const nextSlide = () => {
    if (currentIndex < items.length - visibleItems || loop) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else if (loop) {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (loop) {
      setCurrentIndex(items.length - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), items.length - 1));
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Only trigger slide change if drag distance is significant
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  // Adjust the carousel position based on the current index
  const carouselStyle = {
    transform: `translateX(-${(currentIndex % items.length) * (100 / visibleItems)}%)`,
    transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
  };

  if (items.length === 0) {
    return <div className={`flex justify-center items-center ${className}`}>No items to display</div>;
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`} ref={carouselRef}>
      <div className="relative w-full overflow-visible">
        <motion.div
          className="flex w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            display: 'flex',
            width: `${(items.length / visibleItems) * 100}%`,
            ...carouselStyle,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              ref={index === 0 ? itemRef : null}
              className={`flex-shrink-0 ${itemClassName}`}
              style={{ width: `${100 / visibleItems}%` }}
            >
              {renderItem(item)}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > visibleItems && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(items.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * visibleItems)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index * visibleItems === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
