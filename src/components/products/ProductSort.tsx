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
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-700">{currentSortLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
            onClick={() => onSortChange(option.value)}
          >
            <span className={sortBy === option.value ? 'font-medium text-gray-900' : 'text-gray-600'}>
              {option.label}
            </span>
            {sortBy === option.value && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductSort;
