import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  maxPrice: number;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearPriceRange: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  searchQuery,
  selectedCategory,
  priceRange,
  sortBy,
  maxPrice,
  onClearSearch,
  onClearCategory,
  onClearPriceRange,
  onClearAll
}: ActiveFiltersProps) {
  const hasFilters = 
    searchQuery || 
    selectedCategory !== 'all' || 
    priceRange[0] !== 0 || 
    priceRange[1] !== maxPrice;

  if (!hasFilters) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {searchQuery}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={onClearSearch}
            />
          </Badge>
        )}
        {selectedCategory !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Category: {selectedCategory}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={onClearCategory}
            />
          </Badge>
        )}
        {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Price: ${priceRange[0]} - ${priceRange[1]}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={onClearPriceRange}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}
