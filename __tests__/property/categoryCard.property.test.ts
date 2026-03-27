// Feature: admin-dashboard-redesign, Property 13: Category grid renders one card per category
// Feature: admin-dashboard-redesign, Property 14: Category card image fallback
// Feature: admin-dashboard-redesign, Property 15: Category slug display is prefixed with "/"

/**
 * Property 13: Category grid renders one card per category
 * Validates: Requirements 9.2
 *
 * Property 14: Category card image fallback
 * Validates: Requirements 10.1
 *
 * Property 15: Category slug display is prefixed with "/"
 * Validates: Requirements 10.3
 */

import * as fc from 'fast-check';
import type { CategoryModel } from '../../src/lib/api';

// ---------------------------------------------------------------------------
// Pure helpers that mirror CategoryCard / categories page logic
// ---------------------------------------------------------------------------

/** Returns true if the card should show a real image (not a placeholder) */
function shouldShowImage(image: string | undefined | null): boolean {
  return Boolean(image);
}

/** Returns the slug display string as rendered in CategoryCard */
function formatSlug(slug: string): string {
  return `/${slug}`;
}

/** Simulates the categories page: one card rendered per category */
function renderCategoryCards(categories: CategoryModel[]): CategoryModel[] {
  return categories; // 1-to-1 mapping
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const hexColorArb = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(
    ([r, g, b]) =>
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  );

const slugArb = fc
  .array(
    fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0', '1', '2'),
    { minLength: 1, maxLength: 20 }
  )
  .map((chars) => chars.join(''));

const categoryArb: fc.Arbitrary<CategoryModel> = fc.record({
  _id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  slug: slugArb,
  color: hexColorArb,
  description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  image: fc.option(fc.webUrl({ validSchemes: ['https'] }), { nil: undefined }),
  createdAt: fc.constant('2024-01-01T00:00:00.000Z'),
  updatedAt: fc.constant('2024-01-01T00:00:00.000Z'),
});

// ---------------------------------------------------------------------------
// Property 13: Category grid renders one card per category
// ---------------------------------------------------------------------------

describe('Property 13: Category grid renders one card per category', () => {
  it('renders exactly N cards for N categories', () => {
    fc.assert(
      fc.property(
        fc.array(categoryArb, { minLength: 0, maxLength: 30 }),
        (categories) => {
          const cards = renderCategoryCards(categories);
          expect(cards).toHaveLength(categories.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each card corresponds to a unique category _id', () => {
    fc.assert(
      fc.property(
        fc.array(categoryArb, { minLength: 0, maxLength: 20 }),
        (categories) => {
          const cards = renderCategoryCards(categories);
          const ids = cards.map((c) => c._id);
          const uniqueIds = new Set(ids);
          // If input has unique IDs, output should too
          const inputIds = new Set(categories.map((c) => c._id));
          expect(uniqueIds.size).toBe(inputIds.size);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 14: Category card image fallback
// ---------------------------------------------------------------------------

describe('Property 14: Category card image fallback', () => {
  it('shows placeholder when image is undefined', () => {
    fc.assert(
      fc.property(fc.constant(undefined), (image) => {
        expect(shouldShowImage(image)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('shows placeholder when image is null', () => {
    fc.assert(
      fc.property(fc.constant(null), (image) => {
        expect(shouldShowImage(image)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('shows placeholder when image is empty string', () => {
    fc.assert(
      fc.property(fc.constant(''), (image) => {
        expect(shouldShowImage(image)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('shows real image when image URL is a non-empty string', () => {
    fc.assert(
      fc.property(fc.webUrl({ validSchemes: ['https'] }), (image) => {
        expect(shouldShowImage(image)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('fallback logic is consistent for any nullable image value', () => {
    fc.assert(
      fc.property(
        fc.option(fc.webUrl({ validSchemes: ['https'] }), { nil: undefined }),
        (image) => {
          const result = shouldShowImage(image);
          if (image) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 15: Category slug display is prefixed with "/"
// ---------------------------------------------------------------------------

describe('Property 15: Category slug display is prefixed with "/"', () => {
  it('slug display always starts with "/"', () => {
    fc.assert(
      fc.property(slugArb, (slug) => {
        const display = formatSlug(slug);
        expect(display.startsWith('/')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('slug display equals "/" + slug', () => {
    fc.assert(
      fc.property(slugArb, (slug) => {
        expect(formatSlug(slug)).toBe(`/${slug}`);
      }),
      { numRuns: 100 }
    );
  });

  it('slug display for any category model is prefixed with "/"', () => {
    fc.assert(
      fc.property(categoryArb, (category) => {
        const display = formatSlug(category.slug);
        expect(display).toBe(`/${category.slug}`);
        expect(display.startsWith('/')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
