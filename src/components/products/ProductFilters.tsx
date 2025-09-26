import { useState, useEffect } from "react";
import { ProductFilterOptions } from "../../types/product";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface ProductFiltersProps {
  filters: Partial<ProductFilterOptions>;
  onFilterChange: (filters: Partial<ProductFilterOptions>) => void;
}

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Beverages",
  "Snacks",
  "Pantry",
  "Frozen Foods",
  "Household",
  "Personal Care",
];

const ProductFilters = ({ filters, onFilterChange }: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
    availability: true,
  });

  // Initialize price range from filters
  useEffect(() => {
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000]);
    }
  }, [filters.minPrice, filters.maxPrice]);

  // Toggle filter section
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setPriceRange([min, max]);
    onFilterChange({
      minPrice: min,
      maxPrice: max,
    });
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...(filters.categories || []), category];

    onFilterChange({
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  // Handle rating filter
  const handleRatingChange = (rating: number) => {
    onFilterChange({
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      inStock: undefined,
      onSale: undefined,
    });
    setPriceRange([0, 1000]);
  };

  // Check if any filters are active
  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    filters.inStock !== undefined ||
    filters.onSale !== undefined;

  return (
    <div className="glass-card backdrop-blur-xl shadow-glass p-6 rounded-2xl space-y-6 bg-gradient-to-br from-white/70 via-green-50 to-green-100 border border-green-200">
      <div className="flex items-center justify-between">
        <h3 className="glass-title text-lg font-semibold text-blue-600 drop-shadow">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-water-400 hover:text-water-600 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-green-200/40 pb-4">
        <button
          className="w-full flex justify-between items-center py-2 font-medium"
          onClick={() => toggleSection("category")}
        >
          <span className="text-green-700">Categories</span>
          {openSections.category ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {openSections.category && (
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={filters.categories?.includes(category) || false}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={`cat-${category}`}
                  className="text-sm font-semibold leading-none text-green-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 drop-shadow-sm"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-green-200/40 pb-4">
        <button
          className="w-full flex justify-between items-center py-2 font-medium"
          onClick={() => toggleSection("price")}
        >
          <span className="text-green-700">Price Range</span>
          {openSections.price ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {openSections.price && (
          <div className="mt-4 px-1">
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex justify-between text-sm text-glass-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-yellow-200/40 pb-4">
        <button
          className="w-full flex justify-between items-center py-2 font-medium"
          onClick={() => toggleSection("rating")}
        >
          <span className="text-yellow-800">Rating</span>
          {openSections.rating ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-2 space-y-2 bg-gradient-to-r from-yellow-50 via-yellow-100 to-white/80 rounded-xl p-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={() => handleRatingChange(rating)}
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < rating ? "text-yellow-400 drop-shadow" : "text-glass-400"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-yellow-800">& Up</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="border-b border-purple-200/40 pb-4">
        <button
          className="w-full flex justify-between items-center py-2 font-medium"
          onClick={() => toggleSection("availability")}
        >
          <span className="text-purple-800">Availability</span>
          {openSections.availability ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {openSections.availability && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) =>
                  onFilterChange({ inStock: checked as boolean })
                }
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-semibold leading-none text-purple-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 drop-shadow-sm"
              >
                In Stock Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={filters.onSale || false}
                onCheckedChange={(checked) =>
                  onFilterChange({ onSale: checked as boolean })
                }
              />
              <label
                htmlFor="on-sale"
                className="text-sm font-semibold leading-none text-purple-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 drop-shadow-sm"
              >
                On Sale
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-water-400 via-water-500 to-water-600 text-white shadow-glass"
              >
                {category}
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-water-200 text-water-800 hover:bg-water-300"
                >
                  
                </button>
              </span>
            ))}

            {(filters.minPrice !== undefined ||
              filters.maxPrice !== undefined) && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-glass">
                ${filters.minPrice || 0} - ${filters.maxPrice || ""}
                <button
                  onClick={() =>
                    onFilterChange({ minPrice: undefined, maxPrice: undefined })
                  }
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-200 text-green-800 hover:bg-green-300"
                >
                  
                </button>
              </span>
            )}

            {filters.minRating !== undefined && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-glass">
                {filters.minRating}+ Stars
                <button
                  onClick={() => onFilterChange({ minRating: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                >
                  
                </button>
              </span>
            )}

            {filters.inStock && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white shadow-glass">
                In Stock
                <button
                  onClick={() => onFilterChange({ inStock: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300"
                >
                  
                </button>
              </span>
            )}

            {filters.onSale && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white shadow-glass">
                On Sale
                <button
                  onClick={() => onFilterChange({ onSale: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-200 text-red-800 hover:bg-red-300"
                >
                  
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
