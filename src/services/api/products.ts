import axios from 'axios';
import { Product, PaginatedProducts, ProductFilterOptions } from '../../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  tags?: string[];
}

export const productService = {
  // Get all products with pagination and filtering
  async getProducts(params: GetProductsParams = {}): Promise<PaginatedProducts> {
    try {
      const response = await axios.get<PaginatedProducts>(PRODUCTS_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID or slug
  async getProductById(idOrSlug: string): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${PRODUCTS_ENDPOINT}/${idOrSlug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID/slug ${idOrSlug}:`, error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${PRODUCTS_ENDPOINT}/featured`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get new arrivals
  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${PRODUCTS_ENDPOINT}/new-arrivals`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },

  // Get products on sale
  async getOnSaleProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${PRODUCTS_ENDPOINT}/on-sale`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products on sale:', error);
      throw error;
    }
  },

  // Get related products
  async getRelatedProducts(
    productId: string,
    category: string,
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${PRODUCTS_ENDPOINT}/${productId}/related`, {
        params: { category, limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching related products for product ${productId}:`, error);
      throw error;
    }
  },

  // Get filter options
  async getFilterOptions(): Promise<ProductFilterOptions> {
    try {
      const response = await axios.get<ProductFilterOptions>(`${PRODUCTS_ENDPOINT}/filters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(query: string, params: Omit<GetProductsParams, 'search'> = {}) {
    try {
      const response = await axios.get<PaginatedProducts>(`${PRODUCTS_ENDPOINT}/search`, {
        params: { ...params, query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    params: Omit<GetProductsParams, 'category'> = {}
  ): Promise<PaginatedProducts> {
    try {
      const response = await axios.get<PaginatedProducts>(
        `${PRODUCTS_ENDPOINT}/category/${category}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },
};

export default productService;
