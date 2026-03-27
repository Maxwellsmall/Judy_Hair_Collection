// Feature: admin-dashboard-redesign, Property 1: Product grid renders one card per product
// Feature: admin-dashboard-redesign, Property 2: Category filter pills derived from products

/**
 * Property 1: Product grid renders one card per product
 * Validates: Requirements 2.1
 *
 * Property 2: Category filter pills derived from products
 * Validates: Requirements 2.3
 */

import * as fc from 'fast-check';
import { mapProductsToCards, deriveCategoryPills } from '../../app/admin/utils/productUtils';
import type { Product } from '../../src/lib/api';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 60 }),
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
// Property 1: Product grid renders one card per product
// ---------------------------------------------------------------------------

describe('Property 1: Product grid renders one card per product', () => {
  it('maps N products to exactly N cards (1-to-1)', () => {
    // Feature: admin-dashboard-redesign, Property 1: Product grid renders one card per product
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 50 }), (products) => {
        const cards = mapProductsToCards(products);
        expect(cards).toHaveLength(products.length);
      }),
      { numRuns: 100 }
    );
  });

  it('each card corresponds to the product at the same index', () => {
    // Feature: admin-dashboard-redesign, Property 1: Product grid renders one card per product
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 50 }), (products) => {
        const cards = mapProductsToCards(products);
        products.forEach((p, i) => {
          expect(cards[i]).toBe(p._id);
        });
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Category filter pills derived from products
// ---------------------------------------------------------------------------

describe('Property 2: Category filter pills derived from products', () => {
  it('pill count equals unique categorySlug count + 1 (for "All")', () => {
    // Feature: admin-dashboard-redesign, Property 2: Category filter pills derived from products
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 50 }), (products) => {
        const slugPills = deriveCategoryPills(products);
        const uniqueSlugs = new Set(products.map((p) => p.categorySlug).filter(Boolean));
        // K unique slugs → K + 1 total pills (including "All")
        expect(slugPills.length + 1).toBe(uniqueSlugs.size + 1);
      }),
      { numRuns: 100 }
    );
  });

  it('derived pills contain no duplicates', () => {
    // Feature: admin-dashboard-redesign, Property 2: Category filter pills derived from products
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 50 }), (products) => {
        const pills = deriveCategoryPills(products);
        const unique = new Set(pills);
        expect(pills.length).toBe(unique.size);
      }),
      { numRuns: 100 }
    );
  });

  it('every derived pill slug appears in at least one product', () => {
    // Feature: admin-dashboard-redesign, Property 2: Category filter pills derived from products
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 0, maxLength: 50 }), (products) => {
        const pills = deriveCategoryPills(products);
        const allSlugs = new Set(products.map((p) => p.categorySlug));
        for (const pill of pills) {
          expect(allSlugs.has(pill)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});
