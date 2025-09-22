export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  category: string;
  subCategory?: string;
  brand?: string;
  tags: string[];
  images: ProductImage[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  features?: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isInStock: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterOptions {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  ratings: number[];
}

export interface ProductSortOption {
  value: string;
  label: string;
  sortFn: (a: Product, b: Product) => number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
