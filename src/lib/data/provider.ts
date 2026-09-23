import { Product, ProjectKit, Category, Brand, Campus, Order } from "./types";
import { FIXTURE_PRODUCTS, FIXTURE_PROJECT_KITS, CATEGORIES, BRANDS } from "./fixtures/catalog";
import { CAMPUSES } from "./fixtures/campuses";

export interface ProductFilterParams {
  category?: string;
  brand?: string;
  query?: string;
  inStock?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}

/**
 * Data Provider Interface
 * Clean boundary separating frontend UI components from underlying data sources.
 * Easily swappable for real backend API endpoints when backend is connected.
 */
export interface DataProvider {
  getProducts(params?: ProductFilterParams): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getBrands(): Promise<Brand[]>;
  getProjectKits(): Promise<ProjectKit[]>;
  getProjectKitBySlug(slug: string): Promise<ProjectKit | null>;
  getCampuses(): Promise<Campus[]>;
  getCampusById(id: string): Promise<Campus | null>;
  getWishlist(): Promise<string[]>;
  getOrders(): Promise<Order[]>;
}

/**
 * Development Fixture Provider Implementation
 * Serves isolated development data without making external backend calls.
 */
class DevelopmentFixtureProvider implements DataProvider {
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    let result = [...FIXTURE_PRODUCTS];

    if (!params) return result;

    if (params.category && params.category !== "all") {
      const catLower = params.category.toLowerCase();
      result = result.filter(
        (p) =>
          p.category.toLowerCase().replace(/[\s&]+/g, "-") === catLower ||
          p.category.toLowerCase() === catLower
      );
    }

    if (params.brand && params.brand !== "all") {
      const brandLower = params.brand.toLowerCase();
      result = result.filter((p) => p.brand.toLowerCase() === brandLower);
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.inStock) {
      result = result.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    if (params.sort) {
      switch (params.sort) {
        case "price-asc":
          result.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
          break;
        case "price-desc":
          result.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "featured":
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    if (params.offset) {
      result = result.slice(params.offset);
    }

    if (params.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = FIXTURE_PRODUCTS.find((p) => p.slug === slug);
    return product ? { ...product } : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = FIXTURE_PRODUCTS.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  async getCategories(): Promise<Category[]> {
    return [...CATEGORIES];
  }

  async getBrands(): Promise<Brand[]> {
    return [...BRANDS];
  }

  async getProjectKits(): Promise<ProjectKit[]> {
    return [...FIXTURE_PROJECT_KITS];
  }

  async getProjectKitBySlug(slug: string): Promise<ProjectKit | null> {
    const kit = FIXTURE_PROJECT_KITS.find((k) => k.slug === slug);
    return kit ? { ...kit } : null;
  }

  async getCampuses(): Promise<Campus[]> {
    return [...CAMPUSES];
  }

  async getCampusById(id: string): Promise<Campus | null> {
    const campus = CAMPUSES.find((c) => c.id === id || c.code === id);
    return campus ? { ...campus } : null;
  }

  async getWishlist(): Promise<string[]> {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("partsly_wishlist") || localStorage.getItem("techbox_wishlist");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  }

  async getOrders(): Promise<Order[]> {
    // Development fixture: Return empty array so UI displays proper empty states ("No orders yet")
    // Never show invented or fake customer orders.
    return [];
  }
}

// Active singleton instance of the Data Provider
export const dataProvider: DataProvider = new DevelopmentFixtureProvider();

// Direct helper functions for clean React consumption
export const getProducts = (params?: ProductFilterParams) => dataProvider.getProducts(params);
export const getProductBySlug = (slug: string) => dataProvider.getProductBySlug(slug);
export const getProductById = (id: string) => dataProvider.getProductById(id);
export const getCategories = () => dataProvider.getCategories();
export const getBrands = () => dataProvider.getBrands();
export const getProjectKits = () => dataProvider.getProjectKits();
export const getProjectKitBySlug = (slug: string) => dataProvider.getProjectKitBySlug(slug);
export const getCampuses = () => dataProvider.getCampuses();
export const getCampusById = (id: string) => dataProvider.getCampusById(id);
export const getWishlist = () => dataProvider.getWishlist();
export const getOrders = () => dataProvider.getOrders();
