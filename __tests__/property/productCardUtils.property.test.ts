// Feature: admin-dashboard-redesign, Property 3: Client-side search filter is case-insensitive substring match
// Feature: admin-dashboard-redesign, Property 4: Category color mapping is deterministic and bounded
// Feature: admin-dashboard-redesign, Property 5: Price formatting always includes currency symbol and localized number

/**
 * Property 3: Client-side search filter is case-insensitive substring match
 * Validates: Requirements 3.2
 *
 * Property 4: Category color mapping is deterministic and bounded
 * Validates: Requirements 4.3
 *
 * Property 5: Price formatting always includes currency symbol and localized number
 * Validates: Requirements 4.4
 */

import * as fc from 'fast-check';
import { filterProducts, formatPrice } from '../../app/admin/utils/productUtils';
import { getCategoryColor, CATEGORY_COLORS } from '../../app/admin/utils/categoryColors';
import type { Product } from '../../src/lib/api';

// ---------------------------------------------------------------------------
// Minimal product factory for tests
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: 'test-id',
    name: 'Test Product',
    description: 'desc',
    price: 1000,
    category: 'Wigs',
    categorySlug: 'wigs',
    sizes: ['M'],
    images: [],
    featured: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const productNameArb = fc.string({ minLength: 1, maxLength: 60 });

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  name: productNameArb,
  description: fc.string(),
  price: fc.nat({ max: 1_000_000 }),
  category: fc.string({ minLength: 1, maxLength: 30 }),
  categorySlug: fc.string({ minLength: 1, maxLength: 30 }),
  sizes: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  images: fc.array(fc.webUrl({ validSchemes: ['https'] })),
  featured: fc.boolean(),
  createdAt: fc.constant('2024-01-01T00:00:00.000Z'),
  updatedAt: fc.constant('2024-01-01T00:00:00.000Z'),
});

// ---------------------------------------------------------------------------
// Property 3: Client-side search filter is case-insensitive substring match
// ---------------------------------------------------------------------------

describe('Property 3: Client-side search filter is case-insensitive substring match', () => {
  it('filtered result contains only products whose name includes the search string (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(productArb, { minLength: 0, maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (products, search) => {
          const result = filterProducts(products, search);
          const lower = search.toLowerCase();

          // Every result must match
          for (const p of result) {
            expect(p.name.toLowerCase()).toContain(lower);
          }

          // Every matching product must be in the result
          const expected = products.filter((p) => p.name.toLowerCase().includes(lower));
          expect(result).toHaveLength(expected.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty search returns all products', () => {
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 20 }), (products) => {
        expect(filterProducts(products, '')).toHaveLength(products.length);
        expect(filterProducts(products, '   ')).toHaveLength(products.length);
      }),
      { numRuns: 100 }
    );
  });

  it('search for a product name always returns at least that product', () => {
    fc.assert(
      fc.property(productArb, fc.array(productArb), (target, others) => {
        const products = [target, ...others];
        const result = filterProducts(products, target.name);
        expect(result.some((p) => p._id === target._id)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Category color mapping is deterministic and bounded
// ---------------------------------------------------------------------------

describe('Property 4: Category color mapping is deterministic and bounded', () => {
  it('same name always returns the same color object', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 50 }), (name) => {
        const first = getCategoryColor(name);
        const second = getCategoryColor(name);
        expect(first).toEqual(second);
        expect(first.bg).toBe(second.bg);
        expect(first.text).toBe(second.text);
        expect(first.hex).toBe(second.hex);
      }),
      { numRuns: 100 }
    );
  });

  it('returned color is always one of the 8 palette entries', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 50 }), (name) => {
        const color = getCategoryColor(name);
        expect(CATEGORY_COLORS).toContainEqual(color);
      }),
      { numRuns: 100 }
    );
  });

  it('index is bounded to 0–7 (palette length)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 50 }), (name) => {
        const index = name.charCodeAt(0) % CATEGORY_COLORS.length;
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(CATEGORY_COLORS.length);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Price formatting always includes currency symbol and localized number
// ---------------------------------------------------------------------------

describe('Property 5: Price formatting always includes currency symbol and localized number', () => {
  it('formatted price starts with ₦', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100_000_000 }), (price) => {
        const formatted = formatPrice(price);
        expect(formatted.startsWith('₦')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('formatted price contains the localized number', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100_000_000 }), (price) => {
        const formatted = formatPrice(price);
        const localized = price.toLocaleString();
        expect(formatted).toContain(localized);
      }),
      { numRuns: 100 }
    );
  });

  it('zero price formats correctly', () => {
    expect(formatPrice(0)).toBe(`₦${(0).toLocaleString()}`);
  });

  it('formatPrice is consistent: same input always same output', () => {
    fc.assert(
      fc.property(fc.nat({ max: 100_000_000 }), (price) => {
        expect(formatPrice(price)).toBe(formatPrice(price));
      }),
      { numRuns: 100 }
    );
  });
});
