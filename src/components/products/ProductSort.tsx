import { useState } from 'react';
import { ProductSortOption } from '../../types/product';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';

interface ProductSortProps {
  sortBy: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
}

const sortOptions: { value: ProductSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const ProductSort = ({ sortBy, onSortChange }: ProductSortProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Sort By';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="glass-card backdrop-blur-xl shadow-glass border-glass-300/20 text-glass-600 flex items-center gap-2 rounded-2xl px-4 py-2 font-medium"
        >
          <span className="text-sm font-medium text-glass-600">{currentSortLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card backdrop-blur-xl shadow-glass border-glass-300/20 rounded-2xl" align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer rounded-xl transition-all ${sortBy === option.value ? 'bg-water-400/20 text-glass-600 font-semibold' : 'hover:bg-glass-300/20 text-glass-600'}`}
            onClick={() => onSortChange(option.value)}
          >
            <span>{option.label}</span>
            {sortBy === option.value && (
              <Check className="h-4 w-4 text-water-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductSort;
