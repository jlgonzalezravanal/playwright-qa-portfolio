import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { env } from '../config/env';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

/**
 * Thin client over the Toolshop REST API. Methods return the raw response so
 * tests can assert on status codes as well as on bodies.
 */
export class ToolshopApi {
  constructor(private readonly request: APIRequestContext) {}

  private url(path: string): string {
    return `${env.apiUrl}${path}`;
  }

  getProducts(params: Record<string, string | number> = {}): Promise<APIResponse> {
    return this.request.get(this.url('/products'), { params });
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.request.get(this.url(`/products/${id}`));
  }

  searchProducts(query: string): Promise<APIResponse> {
    return this.request.get(this.url('/products/search'), { params: { q: query } });
  }

  getBrands(): Promise<APIResponse> {
    return this.request.get(this.url('/brands'));
  }

  login(email: string, password: string): Promise<APIResponse> {
    return this.request.post(this.url('/users/login'), { data: { email, password } });
  }

  getCurrentUser(token?: string): Promise<APIResponse> {
    return this.request.get(this.url('/users/me'), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /** Convenience helper: first product matching a search term. */
  async findProduct(query: string): Promise<Product> {
    const response = await this.searchProducts(query);
    const body = (await response.json()) as Paginated<Product>;
    const product = body.data[0];
    if (!product) {
      throw new Error(`No product found for "${query}"`);
    }
    return product;
  }
}
