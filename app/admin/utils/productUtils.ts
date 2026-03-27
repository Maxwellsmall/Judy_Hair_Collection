import type { Product } from '../../../src/lib/api';

/**
 * Client-side case-insensitive substring filter.
 * Validates: Requirements 3.2
 */
export function filterProducts(products: Product[], search: string): Product[] {
  if (!search.trim()) return products;
  const lower = search.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}

/**
 * Formats a price with the Naira currency symbol.
 * Validates: Requirements 4.4
 */
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

/**
 * Maps a list of products to a list of card identifiers (one per product).
 * Validates: Requirements 2.1
 */
export function mapProductsToCards(products: Product[]): string[] {
  return products.map((p) => p._id);
}

/**
 * Derives unique category slugs from a product list.
 * Returns the slugs for the category filter pills (excluding the implicit "All" pill).
 * Validates: Requirements 2.3
 */
export function deriveCategoryPills(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.categorySlug).filter(Boolean)));
}

// ---------------------------------------------------------------------------
// Product form pure helpers
// ---------------------------------------------------------------------------

export interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  category: string;
  features: string;
  colors: string;
  sizes: string;
  featured: boolean;
  tags: string[];
  images: string[];
}

/**
 * Splits a newline-separated features string into a trimmed, non-empty array.
 * Validates: Requirements 7.6
 */
export function parseFeatures(text: string): string[] {
  return text.split('\n').map((f) => f.trim()).filter(Boolean);
}

/**
 * Splits a comma-separated string into a trimmed, non-empty array.
 * Validates: Requirements 7.7
 */
export function parseCommaSeparated(text: string): string[] {
  return text.split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Adds a tag to the list if it is non-empty and not already present.
 * Validates: Requirements 7.5
 */
export function addTag(tags: string[], tag: string): string[] {
  const trimmed = tag.trim();
  if (!trimmed || tags.includes(trimmed)) return tags;
  return [...tags, trimmed];
}

/**
 * Removes a tag from the list by value.
 * Validates: Requirements 7.5
 */
export function removeTag(tags: string[], tag: string): string[] {
  return tags.filter((t) => t !== tag);
}

/**
 * Validates a product form submission and returns an errors object.
 * Returns an empty object when all required fields are present and valid.
 * Validates: Requirements 7.9, 11.7
 */
export function validateProductForm(data: Partial<ProductFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name || !data.name.trim()) errors.name = 'Name is required';
  if (!data.price || parseFloat(data.price) <= 0) errors.price = 'A valid price is required';
  if (!data.description || !data.description.trim()) errors.description = 'Description is required';
  if (!data.category) errors.category = 'Category is required';
  return errors;
}

/**
 * Pre-populates form state from a raw product API response object.
 * Returns a ProductFormData with every field mapped from the source.
 * Validates: Requirements 7.2, 11.2
 */
export function populateProductForm(p: {
  name?: string;
  price?: number;
  originalPrice?: number;
  description?: string;
  category?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  tags?: string[];
  images?: string[];
}): ProductFormData {
  return {
    name: p.name ?? '',
    price: p.price != null ? String(p.price) : '',
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
    description: p.description ?? '',
    category: p.category ?? '',
    features: Array.isArray(p.features) ? p.features.join('\n') : '',
    colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
    sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
    featured: !!p.featured,
    tags: Array.isArray(p.tags) ? p.tags : [],
    images: Array.isArray(p.images) ? p.images : [],
  };
}
